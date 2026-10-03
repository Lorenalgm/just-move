import React, { useEffect, useRef, useState } from 'react';
import { ExerciseConfig, ExerciseMetrics, WorkoutResult } from '../types/exercise';
import { PoseDetectorService, PoseResults } from '../services/poseDetector';
import { ExerciseTracker } from '../services/exerciseEngines';
import { PoseCanvas } from './PoseCanvas';
import { FeedbackOverlay } from './FeedbackOverlay';
import { WorkoutSummary } from './WorkoutSummary';
import { audioService } from '../utils/audioFeedback';
import { recordWorkoutCompletion } from '../utils/storage';
import { Maximize2, Minimize2 } from 'lucide-react';

interface WorkoutViewProps {
  config: ExerciseConfig;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onExit: () => void;
  onSessionComplete: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  config,
  isFullScreen = false,
  onToggleFullScreen,
  onExit,
  onSessionComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const detectorRef = useRef<PoseDetectorService | null>(null);
  const trackerRef = useRef<ExerciseTracker>(new ExerciseTracker(config));

  // Refs to eliminate stale closure issues inside callbacks
  const isCountdownDoneRef = useRef<boolean>(false);
  const isCompletedRef = useRef<boolean>(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [aiStatus, setAiStatus] = useState<{ status: 'loading' | 'ready' | 'simulating' | 'error'; message: string }>({
    status: 'loading',
    message: 'Carregando IA...',
  });

  const [metrics, setMetrics] = useState<ExerciseMetrics>({
    currentAngle: 0,
    targetAngle: 90,
    progressPercent: 0,
    phase: 'rest',
    feedback: {
      severity: 'neutral',
      message: 'Conectando câmera e IA...',
    },
    repCount: 0,
    targetReps: config.targetReps,
    score: 0,
    accuracy: 100,
    repQualities: [],
    inPosition: false,
  });

  const [currentLandmarks, setCurrentLandmarks] = useState<any[]>([]);

  // 1. Initial Countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      audioService.speak(String(countdown));
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      audioService.speak('Começar!');
      isCountdownDoneRef.current = true;
      setCountdown(null);
    }
  }, [countdown]);

  // 2. Initialize Camera and Pose Detector
  useEffect(() => {
    const detector = new PoseDetectorService();
    detectorRef.current = detector;
    trackerRef.current.reset(config);
    isCompletedRef.current = false;
    isCountdownDoneRef.current = false;

    detector.setStatusCallback((status, message) => {
      setAiStatus({ status, message: message || '' });
    });

    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    async function setupTracking() {
      if (!video) return;

      const initialized = await detector.initialize(video, (results: PoseResults) => {
        if (!isMounted) return;
        setCurrentLandmarks(results.landmarks);

        // Process through biomechanics engine!
        // Always calculate angles so user can see amplitude immediately!
        if (!isCompletedRef.current) {
          const updatedMetrics = trackerRef.current.processFrame(results.landmarks);
          setMetrics(updatedMetrics);

          // Check if workout completed
          if (updatedMetrics.repCount >= config.targetReps && isCountdownDoneRef.current) {
            isCompletedRef.current = true;
            setIsCompleted(true);
            const result: WorkoutResult = {
              exerciseId: config.id,
              exerciseName: config.name,
              timestamp: 'Agora',
              repsCompleted: updatedMetrics.repCount,
              targetReps: config.targetReps,
              pointsEarned: Math.max(updatedMetrics.score, config.targetPoints),
              accuracy: updatedMetrics.accuracy,
              durationSeconds: 45,
            };
            recordWorkoutCompletion(result);
          }
        }
      });

      // Start camera feed
      const cameraSuccess = await detector.startCamera();
      if (isMounted) {
        if (cameraSuccess) {
          setAiStatus({ status: 'ready', message: 'Câmera e IA conectados' });
        } else {
          // If camera permission blocked or unavailable, switch automatically to simulation
          setIsSimulating(true);
          detector.startSimulation(config.id);
        }
      }
    }

    setupTracking();

    return () => {
      isMounted = false;
      detector.stop();
    };
  }, [config]);

  // Handle Simulation Toggle
  const handleToggleSimulation = () => {
    const detector = detectorRef.current;
    if (!detector) return;

    if (isSimulating) {
      detector.stopSimulation();
      setIsSimulating(false);
      detector.startCamera().then((ok) => {
        if (!ok) {
          setIsSimulating(true);
          detector.startSimulation(config.id);
        }
      });
    } else {
      detector.stop();
      setIsSimulating(true);
      detector.startSimulation(config.id);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setSoundEnabled(next);
    audioService.setVoiceEnabled(next);
  };

  const handleRestart = () => {
    isCompletedRef.current = false;
    isCountdownDoneRef.current = false;
    setIsCompleted(false);
    trackerRef.current.reset(config);
    setCountdown(3);
    setMetrics({
      currentAngle: 0,
      targetAngle: 90,
      progressPercent: 0,
      phase: 'rest',
      feedback: { severity: 'neutral', message: 'Posicione-se para reiniciar...' },
      repCount: 0,
      targetReps: config.targetReps,
      score: 0,
      accuracy: 100,
      repQualities: [],
      inPosition: false,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#091411] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-[#1C372E]">
      {/* Video Element (Hidden or Mirrored Background) */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${
          isSimulating ? 'opacity-20 blur-sm' : 'opacity-90'
        }`}
      />

      {/* Aesthetic grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#00E89D_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Pose Canvas Overlay */}
      <PoseCanvas
        landmarks={currentLandmarks}
        config={config}
        feedback={metrics.feedback}
        currentAngle={metrics.currentAngle}
        showGhost={showGhost}
        videoRef={videoRef}
        isMirrored={!isSimulating}
      />

      {/* Feedback HUD Overlay */}
      <FeedbackOverlay
        config={config}
        metrics={metrics}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        showGhost={showGhost}
        onToggleGhost={() => setShowGhost(!showGhost)}
        onExit={onExit}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        aiStatus={aiStatus}
        isFullScreen={isFullScreen}
        onToggleFullScreen={onToggleFullScreen}
      />

      {/* Non-intrusive Countdown Banner */}
      {countdown !== null && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-black/85 backdrop-blur-md border border-move-orange/60 px-5 py-2 rounded-full flex items-center gap-2.5 shadow-2xl animate-in zoom-in-95">
          <span className="w-2.5 h-2.5 rounded-full bg-move-orange animate-ping" />
          <span className="text-xs font-bold text-white">
            {countdown === 0 ? 'Começando!' : `Iniciando em ${countdown}... Posicione-se`}
          </span>
        </div>
      )}

      {/* Workout Completion Modal */}
      {isCompleted && (
        <WorkoutSummary
          config={config}
          metrics={metrics}
          onFinish={() => {
            onSessionComplete();
            onExit();
          }}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};
