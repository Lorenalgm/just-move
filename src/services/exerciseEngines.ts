import { Landmark, ExerciseConfig, ExerciseMetrics, FormFeedback, RepPhase } from '../types/exercise';
import { calculateAngle, calculateDistance } from '../utils/geometry';
import { audioService } from '../utils/audioFeedback';

export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

export class ExerciseTracker {
  private config: ExerciseConfig;
  private repCount: number = 0;
  private phase: RepPhase = 'rest';
  private score: number = 0;
  private peakAngleInRep: number = 0;
  private repQualities: ('PERFEITO' | 'BOM' | 'REGULAR')[] = [];

  constructor(config: ExerciseConfig) {
    this.config = config;
  }

  public reset(config?: ExerciseConfig) {
    if (config) this.config = config;
    this.repCount = 0;
    this.phase = 'rest';
    this.score = 0;
    this.peakAngleInRep = 0;
    this.repQualities = [];
  }

  public processFrame(landmarks: Landmark[]): ExerciseMetrics {
    const isVisible = this.checkBodyVisibility(landmarks);

    if (!isVisible) {
      const hint = this.config.id === 'squat'
        ? 'Afaste-se para que a câmera enquadre quadril e pernas.'
        : 'Posicione-se de frente para a câmera mostrando ombros e braços.';

      return {
        currentAngle: 0,
        targetAngle: 90,
        progressPercent: 0,
        phase: 'rest',
        feedback: {
          severity: 'warning',
          message: hint,
        },
        repCount: this.repCount,
        targetReps: this.config.targetReps,
        score: this.score,
        accuracy: this.calculateAverageAccuracy(),
        repQualities: this.repQualities,
        inPosition: false,
      };
    }

    switch (this.config.id) {
      case 'shoulder_abduction':
        return this.processShoulderAbduction(landmarks);
      case 'shoulder_flexion':
        return this.processShoulderFlexion(landmarks);
      case 'squat':
        return this.processSquat(landmarks);
      case 'jumping_jacks':
        return this.processJumpingJacks(landmarks);
      default:
        return this.processShoulderAbduction(landmarks);
    }
  }

  private checkBodyVisibility(lm: Landmark[]): boolean {
    if (!lm || lm.length < 15) return false;
    const lSh = lm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rSh = lm[POSE_LANDMARKS.RIGHT_SHOULDER];

    if (!lSh || !rSh) return false;

    // For shoulder exercises, shoulders are sufficient (even if sitting or waist-up)
    if (this.config.id === 'shoulder_abduction' || this.config.id === 'shoulder_flexion') {
      const shVis = ((lSh.visibility ?? 1) > 0.3) || ((rSh.visibility ?? 1) > 0.3);
      return shVis;
    }

    // For squat, knees are also required
    if (this.config.id === 'squat') {
      const lKnee = lm[POSE_LANDMARKS.LEFT_KNEE];
      const rKnee = lm[POSE_LANDMARKS.RIGHT_KNEE];
      return (lKnee?.visibility ?? 1) > 0.3 || (rKnee?.visibility ?? 1) > 0.3;
    }

    return true;
  }

  /**
   * Calculates arm angle relative to torso (using hips if visible, or vertical axis if hips are off-camera)
   */
  private getArmAngle(shoulder: Landmark, elbow: Landmark, wrist: Landmark, hip?: Landmark): number {
    // If hip is clearly visible, use hip-shoulder-elbow
    if (hip && (hip.visibility ?? 1) > 0.35 && hip.y > shoulder.y) {
      return calculateAngle(hip, shoulder, elbow);
    }

    // Fallback to vertical axis (robust when user is seated or framed chest-up)
    const endPoint = (elbow.visibility ?? 1) > 0.35 ? elbow : wrist;
    const dx = endPoint.x - shoulder.x;
    const dy = endPoint.y - shoulder.y;

    let rad = Math.atan2(Math.abs(dx), dy);
    let deg = (rad * 180) / Math.PI;

    if (dy < 0) {
      deg = 180 - (Math.atan2(Math.abs(dx), -dy) * 180) / Math.PI;
    }

    return Math.round(deg);
  }

  // --- ABDUÇÃO DE OMBRO ---
  private processShoulderAbduction(lm: Landmark[]): ExerciseMetrics {
    const lSh = lm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rSh = lm[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lElb = lm[POSE_LANDMARKS.LEFT_ELBOW];
    const rElb = lm[POSE_LANDMARKS.RIGHT_ELBOW];
    const lWri = lm[POSE_LANDMARKS.LEFT_WRIST];
    const rWri = lm[POSE_LANDMARKS.RIGHT_WRIST];
    const lHip = lm[POSE_LANDMARKS.LEFT_HIP];
    const rHip = lm[POSE_LANDMARKS.RIGHT_HIP];

    const leftAngle = this.getArmAngle(lSh, lElb, lWri, lHip);
    const rightAngle = this.getArmAngle(rSh, rElb, rWri, rHip);

    // If both arms are moving, use average; if one arm is raised higher (e.g. testing), track the primary arm
    const maxArm = Math.max(leftAngle, rightAngle);
    const minArm = Math.min(leftAngle, rightAngle);
    const avgAngle = Math.abs(leftAngle - rightAngle) < 25 ? Math.round((leftAngle + rightAngle) / 2) : maxArm;

    const targetMin = 75; // Forgiving target zone (75° to 105°)
    const targetIdeal = 90;
    const targetMax = 110;
    const restThreshold = 32;

    let feedback: FormFeedback = {
      severity: 'neutral',
      message: 'Eleve os braços lateralmente até a linha dos ombros (90°)',
      angleValue: avgAngle,
    };

    if (this.phase === 'rest') {
      if (avgAngle > restThreshold + 8) {
        this.phase = 'ascending';
        this.peakAngleInRep = avgAngle;
      } else {
        feedback = {
          severity: 'neutral',
          message: 'Posição inicial: braços relaxados ao lado do corpo.',
          angleValue: avgAngle,
        };
      }
    }

    if (this.phase === 'ascending') {
      if (avgAngle > this.peakAngleInRep) {
        this.peakAngleInRep = avgAngle;
      }

      if (avgAngle >= targetMin) {
        this.phase = 'peak';
      } else {
        feedback = {
          severity: 'good',
          message: `Elevando... ${avgAngle}° / 90° (continue subindo)`,
          angleValue: avgAngle,
        };
      }
    }

    if (this.phase === 'peak') {
      if (avgAngle > this.peakAngleInRep) {
        this.peakAngleInRep = avgAngle;
      }

      if (avgAngle > targetMax) {
        feedback = {
          severity: 'warning',
          message: `Atenção: braços muito altos (${avgAngle}°). Alinhe a 90°.`,
          angleValue: avgAngle,
        };
      } else {
        feedback = {
          severity: 'perfect',
          message: `Excelente amplitude (${avgAngle}°)! Agora desça devagar.`,
          angleValue: avgAngle,
        };
      }

      // Check transition to descending
      if (avgAngle < targetMin - 8) {
        this.phase = 'descending';
      }
    }

    if (this.phase === 'descending') {
      if (avgAngle <= restThreshold + 10) {
        // Repetition complete!
        this.repCount++;
        const quality = this.evaluateRepQuality(this.peakAngleInRep, targetMin, targetMax);
        this.repQualities.push(quality);

        const repPoints = quality === 'PERFEITO' ? 100 : quality === 'BOM' ? 70 : 40;
        this.score += repPoints;

        audioService.playRepSuccess(quality);

        if (this.repCount >= this.config.targetReps) {
          audioService.speak('Parabéns! Meta batida com sucesso!');
        } else {
          audioService.speak(this.repCount % 2 === 0 ? `Repetição ${this.repCount}!` : 'Muito bom!');
        }

        feedback = {
          severity: 'perfect',
          message: `Repetição ${this.repCount} concluída! +${repPoints} pts (${quality})`,
          scoreBonus: repPoints,
          angleValue: avgAngle,
        };

        this.phase = 'rest';
        this.peakAngleInRep = 0;
      } else {
        feedback = {
          severity: 'good',
          message: `Descendo... retorne os braços até o corpo (${avgAngle}°).`,
          angleValue: avgAngle,
        };
      }
    }

    // Dynamic progress bar: 0% at rest, 100% when reaching targetIdeal (90°)
    const rawProgress = ((avgAngle - restThreshold) / (targetIdeal - restThreshold)) * 100;
    const progressPercent = Math.min(100, Math.max(0, Math.round(rawProgress)));

    return {
      currentAngle: avgAngle,
      targetAngle: 90,
      progressPercent,
      phase: this.phase,
      feedback,
      repCount: this.repCount,
      targetReps: this.config.targetReps,
      score: this.score,
      accuracy: this.calculateAverageAccuracy(),
      repQualities: this.repQualities,
      inPosition: true,
    };
  }

  // --- FLEXÃO DE OMBRO ---
  private processShoulderFlexion(lm: Landmark[]): ExerciseMetrics {
    const lSh = lm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rSh = lm[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lElb = lm[POSE_LANDMARKS.LEFT_ELBOW];
    const rElb = lm[POSE_LANDMARKS.RIGHT_ELBOW];
    const lWri = lm[POSE_LANDMARKS.LEFT_WRIST];
    const rWri = lm[POSE_LANDMARKS.RIGHT_WRIST];
    const lHip = lm[POSE_LANDMARKS.LEFT_HIP];
    const rHip = lm[POSE_LANDMARKS.RIGHT_HIP];

    const leftAngle = this.getArmAngle(lSh, lElb, lWri, lHip);
    const rightAngle = this.getArmAngle(rSh, rElb, rWri, rHip);
    const avgAngle = Math.max(leftAngle, rightAngle);

    const targetMin = 75;
    const targetIdeal = 90;
    const restThreshold = 32;

    let feedback: FormFeedback = {
      severity: 'neutral',
      message: 'Eleve os braços para frente até 90°',
      angleValue: avgAngle,
    };

    if (this.phase === 'rest') {
      if (avgAngle > restThreshold + 10) {
        this.phase = 'ascending';
        this.peakAngleInRep = avgAngle;
      }
    } else if (this.phase === 'ascending') {
      this.peakAngleInRep = Math.max(this.peakAngleInRep, avgAngle);
      if (avgAngle >= targetMin) {
        this.phase = 'peak';
      } else {
        feedback = { severity: 'good', message: `Subindo para frente: ${avgAngle}° / 90°`, angleValue: avgAngle };
      }
    } else if (this.phase === 'peak') {
      feedback = { severity: 'perfect', message: `Boa amplitude (${avgAngle}°)! Agora desça devagar.`, angleValue: avgAngle };
      if (avgAngle < targetMin - 8) {
        this.phase = 'descending';
      }
    } else if (this.phase === 'descending') {
      if (avgAngle <= restThreshold + 10) {
        this.repCount++;
        const quality = this.evaluateRepQuality(this.peakAngleInRep, targetMin, 115);
        this.repQualities.push(quality);
        const pts = quality === 'PERFEITO' ? 100 : 70;
        this.score += pts;
        audioService.playRepSuccess(quality);
        audioService.speak(`Repetição ${this.repCount}!`);
        feedback = { severity: 'perfect', message: `Repetição ${this.repCount} concluída!`, scoreBonus: pts };
        this.phase = 'rest';
        this.peakAngleInRep = 0;
      }
    }

    const progressPercent = Math.min(100, Math.max(0, Math.round(((avgAngle - restThreshold) / (targetIdeal - restThreshold)) * 100)));

    return {
      currentAngle: avgAngle,
      targetAngle: 90,
      progressPercent,
      phase: this.phase,
      feedback,
      repCount: this.repCount,
      targetReps: this.config.targetReps,
      score: this.score,
      accuracy: this.calculateAverageAccuracy(),
      repQualities: this.repQualities,
      inPosition: true,
    };
  }

  // --- AGACHAMENTO ---
  private processSquat(lm: Landmark[]): ExerciseMetrics {
    const lHip = lm[POSE_LANDMARKS.LEFT_HIP];
    const lKnee = lm[POSE_LANDMARKS.LEFT_KNEE];
    const lAnkle = lm[POSE_LANDMARKS.LEFT_ANKLE];
    const rHip = lm[POSE_LANDMARKS.RIGHT_HIP];
    const rKnee = lm[POSE_LANDMARKS.RIGHT_KNEE];
    const rAnkle = lm[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKneeAngle = calculateAngle(lHip, lKnee, lAnkle);
    const rightKneeAngle = calculateAngle(rHip, rKnee, rAnkle);
    const avgKneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

    const standAngle = 165;
    const squatDepth = 95;

    let feedback: FormFeedback = {
      severity: 'neutral',
      message: 'Agache flexionando os joelhos até 90°',
      angleValue: avgKneeAngle,
    };

    if (this.phase === 'rest') {
      if (avgKneeAngle < standAngle - 15) {
        this.phase = 'descending';
        this.peakAngleInRep = avgKneeAngle;
      }
    } else if (this.phase === 'descending') {
      this.peakAngleInRep = Math.min(this.peakAngleInRep || 180, avgKneeAngle);
      if (avgKneeAngle <= squatDepth + 10) {
        this.phase = 'peak';
        feedback = { severity: 'perfect', message: 'Ótima profundidade! Suba com força.', angleValue: avgKneeAngle };
      } else {
        feedback = { severity: 'good', message: `Descendo: ${avgKneeAngle}° (meta 90°)`, angleValue: avgKneeAngle };
      }
    } else if (this.phase === 'peak') {
      feedback = { severity: 'perfect', message: 'Empurre o chão para subir!', angleValue: avgKneeAngle };
      if (avgKneeAngle > squatDepth + 15) {
        this.phase = 'ascending';
      }
    } else if (this.phase === 'ascending') {
      if (avgKneeAngle >= standAngle - 10) {
        this.repCount++;
        const quality = this.peakAngleInRep <= 100 ? 'PERFEITO' : 'BOM';
        this.repQualities.push(quality);
        const pts = quality === 'PERFEITO' ? 100 : 70;
        this.score += pts;
        audioService.playRepSuccess(quality);
        audioService.speak(`Repetição ${this.repCount}!`);
        feedback = { severity: 'perfect', message: `Agachamento completo! Rep ${this.repCount}`, scoreBonus: pts };
        this.phase = 'rest';
        this.peakAngleInRep = 180;
      }
    }

    const progressPercent = Math.min(100, Math.max(0, Math.round(((standAngle - avgKneeAngle) / (standAngle - squatDepth)) * 100)));

    return {
      currentAngle: avgKneeAngle,
      targetAngle: 90,
      progressPercent,
      phase: this.phase,
      feedback,
      repCount: this.repCount,
      targetReps: this.config.targetReps,
      score: this.score,
      accuracy: this.calculateAverageAccuracy(),
      repQualities: this.repQualities,
      inPosition: true,
    };
  }

  // --- POLICHINELO ---
  private processJumpingJacks(lm: Landmark[]): ExerciseMetrics {
    const lSh = lm[POSE_LANDMARKS.LEFT_SHOULDER];
    const lElb = lm[POSE_LANDMARKS.LEFT_ELBOW];
    const lWri = lm[POSE_LANDMARKS.LEFT_WRIST];
    const rSh = lm[POSE_LANDMARKS.RIGHT_SHOULDER];
    const rElb = lm[POSE_LANDMARKS.RIGHT_ELBOW];
    const rWri = lm[POSE_LANDMARKS.RIGHT_WRIST];

    const leftAngle = this.getArmAngle(lSh, lElb, lWri);
    const rightAngle = this.getArmAngle(rSh, rElb, rWri);
    const armAngle = Math.round((leftAngle + rightAngle) / 2);

    let feedback: FormFeedback = { severity: 'neutral', message: 'Abra braços e pernas em salto!' };

    if (this.phase === 'rest') {
      if (armAngle > 90) {
        this.phase = 'peak';
      }
    } else if (this.phase === 'peak') {
      if (armAngle < 40) {
        this.repCount++;
        this.score += 80;
        audioService.playRepSuccess('PERFEITO');
        this.repQualities.push('PERFEITO');
        audioService.speak(`${this.repCount}`);
        feedback = { severity: 'perfect', message: `Boa! Rep ${this.repCount}`, scoreBonus: 80 };
        this.phase = 'rest';
      }
    }

    const progressPercent = Math.min(100, Math.max(0, Math.round((armAngle / 150) * 100)));

    return {
      currentAngle: armAngle,
      targetAngle: 150,
      progressPercent,
      phase: this.phase,
      feedback,
      repCount: this.repCount,
      targetReps: this.config.targetReps,
      score: this.score,
      accuracy: this.calculateAverageAccuracy(),
      repQualities: this.repQualities,
      inPosition: true,
    };
  }

  private evaluateRepQuality(peakAngle: number, min: number, max: number): 'PERFEITO' | 'BOM' | 'REGULAR' {
    if (peakAngle >= min && peakAngle <= max) {
      return 'PERFEITO';
    }
    if (peakAngle >= min - 10 && peakAngle <= max + 15) {
      return 'BOM';
    }
    return 'REGULAR';
  }

  private calculateAverageAccuracy(): number {
    if (this.repQualities.length === 0) return 100;
    const total = this.repQualities.reduce((acc, q) => acc + (q === 'PERFEITO' ? 100 : q === 'BOM' ? 80 : 60), 0);
    return Math.round(total / this.repQualities.length);
  }
}
