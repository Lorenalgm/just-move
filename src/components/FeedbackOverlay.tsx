import React from 'react';
import { ExerciseConfig, ExerciseMetrics } from '../types/exercise';
import { Volume2, VolumeX, Eye, EyeOff, X, Sparkles, CheckCircle2, AlertTriangle, Maximize, Minimize } from 'lucide-react';

interface FeedbackOverlayProps {
  config: ExerciseConfig;
  metrics: ExerciseMetrics;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  showGhost: boolean;
  onToggleGhost: () => void;
  onExit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  aiStatus: { status: 'loading' | 'ready' | 'simulating' | 'error'; message: string };
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  config,
  metrics,
  isSimulating,
  onToggleSimulation,
  showGhost,
  onToggleGhost,
  onExit,
  soundEnabled,
  onToggleSound,
  isFullScreen,
  onToggleFullScreen,
}) => {
  const { repCount, targetReps, score, accuracy, feedback, progressPercent, currentAngle, targetAngle, inPosition } = metrics;

  const getSeverityStyle = () => {
    switch (feedback.severity) {
      case 'perfect':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
          icon: <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />,
        };
      case 'good':
        return {
          bg: 'bg-teal-500/20 border-teal-500/40 text-teal-200',
          icon: <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/20 border-amber-500/50 text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-500/20 border-rose-500/50 text-rose-200',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/60 border-slate-700/60 text-slate-200',
          icon: <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />,
        };
    }
  };

  const style = getSeverityStyle();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const repProgress = Math.min(1, repCount / targetReps);
  const strokeDashoffset = circumference - repProgress * circumference;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3.5 sm:p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Exercise name & status */}
        <div className="flex items-center gap-3 bg-black/65 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-move-gray font-medium">
                {config.category}
              </span>
              {isSimulating ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-move-orange/20 text-move-orange border border-move-orange/30">
                  Modo demonstração
                </span>
              ) : inPosition ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-move-mint/20 text-move-mint border border-move-mint/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-move-mint animate-pulse" />
                  Rastreando
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Posicione-se
                </span>
              )}
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              {config.name}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? 'Usar câmera real' : 'Testar com atleta virtual'}
            className="px-3 py-2 rounded-xl bg-black/65 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            {isSimulating ? '📷 Câmera' : '🤖 Simular'}
          </button>

          {/* Ghost Guide Toggle */}
          <button
            onClick={onToggleGhost}
            title={showGhost ? 'Ocultar guia visual' : 'Exibir guia visual'}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              showGhost
                ? 'bg-move-mint/20 border-move-mint/60 text-move-mint'
                : 'bg-black/65 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {showGhost ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar áudio' : 'Ativar áudio e voz'}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              soundEnabled
                ? 'bg-move-orange/20 border-move-orange/60 text-move-orange'
                : 'bg-black/65 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Fullscreen Expand/Collapse Toggle */}
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              title={isFullScreen ? 'Sair da tela cheia' : 'Expandir tela cheia'}
              className="p-2.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition-all"
            >
              {isFullScreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Exit */}
          <button
            onClick={onExit}
            title="Finalizar treino"
            className="p-2.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Center Dynamic Feedback Banner */}
      <div className="flex flex-col items-center justify-center my-auto transition-all duration-300">
        <div
          className={`flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl backdrop-blur-xl border shadow-2xl max-w-sm sm:max-w-md text-center transition-all ${style.bg}`}
        >
          {style.icon}
          <span className="font-semibold text-xs sm:text-base leading-snug tracking-wide">
            {feedback.message}
          </span>
        </div>

        {/* Real-time Movement Range Bar */}
        <div className="w-56 sm:w-72 mt-3 bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 flex flex-col gap-1.5 shadow-xl">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-move-gray flex items-center gap-1.5">
              <span>Amplitude</span>
              <span className="text-move-mint font-mono bg-move-mint/10 px-1.5 py-0.5 rounded border border-move-mint/20">
                {currentAngle}° / {targetAngle}°
              </span>
            </span>
            <span className={progressPercent >= 80 ? 'text-move-mint' : 'text-white'}>
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full transition-all duration-100 rounded-full ${
                progressPercent >= 80
                  ? 'bg-gradient-to-r from-move-mint to-[#00FFA3] shadow-[0_0_12px_#00E89D]'
                  : 'bg-gradient-to-r from-move-orange to-amber-400'
              }`}
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="pointer-events-auto bg-black/80 backdrop-blur-xl rounded-3xl p-3.5 sm:p-4 border border-white/10 shadow-2xl flex items-center justify-between gap-4 max-w-md mx-auto w-full">
        {/* Repetition Ring */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90">
              <circle
                cx="30"
                cy="30"
                r={radius * 0.75}
                className="stroke-white/10"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r={radius * 0.75}
                className="stroke-move-orange transition-all duration-300"
                strokeWidth="5"
                strokeDasharray={circumference * 0.75}
                strokeDashoffset={strokeDashoffset * 0.75}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm sm:text-base font-extrabold text-white leading-none">{repCount}</span>
              <span className="text-[9px] text-move-gray font-bold">/{targetReps}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-move-gray font-semibold">Repetições</div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
              {repCount >= targetReps ? 'Meta batida! 🎯' : `${repCount} de ${targetReps}`}
            </div>
          </div>
        </div>

        {/* Score & Accuracy Stats */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-4">
          <div className="text-left">
            <div className="text-[11px] text-move-gray font-semibold">Pontos</div>
            <div className="text-base sm:text-lg font-bold text-move-orange">+{score}</div>
          </div>

          <div className="text-left">
            <div className="text-[11px] text-move-gray font-semibold">Precisão</div>
            <div className="text-base sm:text-lg font-bold text-move-mint">{accuracy}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
