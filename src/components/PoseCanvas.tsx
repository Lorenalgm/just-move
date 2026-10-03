import React, { useEffect, useRef } from 'react';
import { Landmark, ExerciseConfig, FormFeedback } from '../types/exercise';
import { POSE_LANDMARKS } from '../services/exerciseEngines';

interface PoseCanvasProps {
  landmarks: Landmark[];
  config: ExerciseConfig;
  feedback: FormFeedback;
  currentAngle: number;
  showGhost?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isMirrored?: boolean;
}

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  landmarks,
  config,
  feedback,
  currentAngle,
  showGhost = true,
  videoRef,
  isMirrored = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get exact rendered container size
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.offsetWidth || 640;
    const height = rect.height || canvas.offsetHeight || 480;

    // Support crisp Retina/HiDPI display
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Get native video dimensions for object-cover projection mapping
    const video = videoRef?.current;
    const videoWidth = video?.videoWidth || 640;
    const videoHeight = video?.videoHeight || 480;

    // Helper: projects normalized landmark (0..1, 0..1) to canvas coordinates matching CSS object-cover
    const project = (p: Landmark): { x: number; y: number } => {
      const scale = Math.max(width / videoWidth, height / videoHeight);
      const renderedW = videoWidth * scale;
      const renderedH = videoHeight * scale;

      const offsetX = (width - renderedW) / 2;
      const offsetY = (height - renderedH) / 2;

      // In mirrored mode (front camera with -scale-x-100), invert horizontal axis
      const normX = isMirrored ? (1.0 - p.x) : p.x;
      const normY = p.y;

      return {
        x: offsetX + normX * renderedW,
        y: offsetY + normY * renderedH,
      };
    };

    // 1. Draw Ghost Guide
    if (showGhost) {
      drawGhostGuide(ctx, width, height, config);
    }

    if (!landmarks || landmarks.length === 0) {
      ctx.restore();
      return;
    }

    // Determine colors
    const isError = feedback.severity === 'error';
    const isWarning = feedback.severity === 'warning';
    const isPerfect = feedback.severity === 'perfect';

    const mainColor = isError ? '#EF4444' : isWarning ? '#F59E0B' : isPerfect ? '#00FFA3' : '#00E89D';
    const glowColor = isError ? 'rgba(239, 68, 68, 0.5)' : isWarning ? 'rgba(245, 158, 11, 0.5)' : 'rgba(0, 232, 157, 0.5)';

    // Connections to draw
    const connections: [number, number][] = [
      // Shoulders
      [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
      // Left Arm
      [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
      [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
      // Right Arm
      [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
      [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
      // Torso & Hips (if visible)
      [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
      [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
      [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
      // Legs
      [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
      [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
      [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
      [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
    ];

    // 2. Draw Skeleton Lines
    connections.forEach(([i1, i2]) => {
      const p1 = landmarks[i1];
      const p2 = landmarks[i2];
      if (!p1 || !p2) return;

      const v1 = p1.visibility ?? 1;
      const v2 = p2.visibility ?? 1;
      if (v1 < 0.25 || v2 < 0.25) return;

      const pos1 = project(p1);
      const pos2 = project(p2);

      ctx.beginPath();
      ctx.moveTo(pos1.x, pos1.y);
      ctx.lineTo(pos2.x, pos2.y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = mainColor;
      ctx.lineCap = 'round';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
    });

    // 3. Draw Head Ring (Encircles user's actual face perfectly!)
    const nose = landmarks[POSE_LANDMARKS.NOSE];
    const lEye = landmarks[POSE_LANDMARKS.LEFT_EYE];
    const rEye = landmarks[POSE_LANDMARKS.RIGHT_EYE];
    const lSh = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rSh = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    if (nose && (nose.visibility ?? 1) > 0.25) {
      const nosePos = project(nose);
      let headRadius = 45;

      if (lSh && rSh && (lSh.visibility ?? 1) > 0.25 && (rSh.visibility ?? 1) > 0.25) {
        const lShPos = project(lSh);
        const rShPos = project(rSh);
        const shoulderSpan = Math.hypot(rShPos.x - lShPos.x, rShPos.y - lShPos.y);
        headRadius = Math.max(30, Math.min(85, shoulderSpan * 0.38));
      }

      ctx.beginPath();
      ctx.arc(nosePos.x, nosePos.y - headRadius * 0.1, headRadius, 0, 2 * Math.PI);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = mainColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.fillStyle = isPerfect ? 'rgba(0, 255, 163, 0.12)' : 'rgba(0, 232, 157, 0.08)';
      ctx.fill();
    }

    // 4. Draw Joint Nodes
    const joints = [
      POSE_LANDMARKS.LEFT_SHOULDER,
      POSE_LANDMARKS.RIGHT_SHOULDER,
      POSE_LANDMARKS.LEFT_ELBOW,
      POSE_LANDMARKS.RIGHT_ELBOW,
      POSE_LANDMARKS.LEFT_WRIST,
      POSE_LANDMARKS.RIGHT_WRIST,
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.LEFT_KNEE,
      POSE_LANDMARKS.RIGHT_KNEE,
      POSE_LANDMARKS.LEFT_ANKLE,
      POSE_LANDMARKS.RIGHT_ANKLE,
    ];

    joints.forEach((idx) => {
      const p = landmarks[idx];
      if (!p || (p.visibility ?? 1) < 0.25) return;

      const pos = project(p);
      const isHighlighted = feedback.highlightJoints?.includes(idx);

      // Outer ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHighlighted ? 10 : 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#061410';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHighlighted ? 9 : 6.5, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = isHighlighted ? '#EF4444' : mainColor;
      ctx.shadowColor = isHighlighted ? '#EF4444' : glowColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
    });

    // 5. Draw Angle Arc directly at the active shoulder joint
    if (lSh && (lSh.visibility ?? 1) > 0.3 && currentAngle > 0) {
      // Pick shoulder that is on screen right in mirrored view (or left shoulder)
      const targetJoint = isMirrored ? (rSh && (rSh.visibility ?? 1) > 0.3 ? rSh : lSh) : lSh;
      const shPos = project(targetJoint);

      ctx.save();
      ctx.shadowBlur = 0;

      // Arc
      ctx.beginPath();
      ctx.arc(shPos.x, shPos.y, 32, 0, (currentAngle * Math.PI) / 180);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FF6B2C';
      ctx.stroke();

      // Degree Badge
      const text = `${currentAngle}°`;
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
      const textMetrics = ctx.measureText(text);
      const badgeW = textMetrics.width + 12;
      const badgeH = 22;
      const badgeX = shPos.x + 36;
      const badgeY = shPos.y - 11;

      ctx.fillStyle = 'rgba(6, 18, 14, 0.9)';
      ctx.strokeStyle = '#244A3F';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPerfect ? '#00FFA3' : '#00E89D';
      ctx.fillText(text, badgeX + 6, badgeY + 16);
      ctx.restore();
    }

    ctx.restore();
  }, [landmarks, config, feedback, currentAngle, showGhost, videoRef, isMirrored]);

  const drawGhostGuide = (ctx: CanvasRenderingContext2D, w: number, h: number, cfg: ExerciseConfig) => {
    ctx.save();
    const cx = w * 0.5;
    const cy = h * 0.46;

    ctx.strokeStyle = 'rgba(0, 232, 157, 0.32)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);

    const shoulderY = cy - h * 0.12;
    const sWidth = w * 0.14;

    if (cfg.id === 'shoulder_abduction') {
      const armLength = w * 0.28;

      // Left arm horizontal guideline
      ctx.beginPath();
      ctx.moveTo(cx - sWidth, shoulderY);
      ctx.lineTo(cx - sWidth - armLength, shoulderY);
      ctx.stroke();

      // Right arm horizontal guideline
      ctx.beginPath();
      ctx.moveTo(cx + sWidth, shoulderY);
      ctx.lineTo(cx + sWidth + armLength, shoulderY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 107, 44, 0.9)';
      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Alvo 90°', cx - sWidth - armLength + 10, shoulderY - 10);
      ctx.fillText('Alvo 90°', cx + sWidth + armLength - 70, shoulderY - 10);
    } else if (cfg.id === 'squat') {
      const squatTargetY = cy + h * 0.22;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, squatTargetY);
      ctx.lineTo(cx + w * 0.3, squatTargetY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 107, 44, 0.9)';
      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Profundidade alvo 90°', cx - 75, squatTargetY - 10);
    }

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
