export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type ExerciseId = 'shoulder_abduction' | 'shoulder_flexion' | 'squat' | 'jumping_jacks';

export interface ExerciseConfig {
  id: ExerciseId;
  name: string;
  category: string;
  targetReps: number;
  targetPoints: number;
  bestScore: number;
  iconName: string;
  description: string;
  instructions: string[];
  tips: string[];
  targetAngleMin: number;
  targetAngleMax: number;
  restAngle: number;
  primaryJoints: string;
}

export type RepPhase = 'rest' | 'ascending' | 'peak' | 'descending';

export type FeedbackSeverity = 'perfect' | 'good' | 'warning' | 'error' | 'neutral';

export interface FormFeedback {
  severity: FeedbackSeverity;
  message: string;
  angleValue?: number;
  scoreBonus?: number;
  highlightJoints?: number[];
}

export interface ExerciseMetrics {
  currentAngle: number;
  targetAngle: number;
  progressPercent: number; // 0 to 100% of movement
  phase: RepPhase;
  feedback: FormFeedback;
  repCount: number;
  targetReps: number;
  score: number;
  accuracy: number;
  repQualities: ('PERFEITO' | 'BOM' | 'REGULAR')[];
  inPosition: boolean;
}

export interface WorkoutResult {
  exerciseId: ExerciseId;
  exerciseName: string;
  timestamp: string;
  repsCompleted: number;
  targetReps: number;
  pointsEarned: number;
  accuracy: number;
  durationSeconds: number;
}

export interface UserProfile {
  name: string;
  level: number;
  levelTitle: string;
  totalPoints: number;
  streakDays: number;
  streakRecord: number;
  weekSessions: number;
  weekTarget: number;
  history: WorkoutResult[];
}
