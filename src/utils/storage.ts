import { UserProfile, WorkoutResult } from '../types/exercise';

const STORAGE_KEY = 'just_move_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Você',
  level: 4,
  levelTitle: 'Constância',
  totalPoints: 8420,
  streakDays: 4,
  streakRecord: 6,
  weekSessions: 4,
  weekTarget: 6,
  history: [
    {
      exerciseId: 'shoulder_abduction',
      exerciseName: 'Abdução de ombro',
      timestamp: 'Hoje',
      repsCompleted: 12,
      targetReps: 12,
      pointsEarned: 940,
      accuracy: 96,
      durationSeconds: 48,
    },
    {
      exerciseId: 'shoulder_flexion',
      exerciseName: 'Flexão de ombro',
      timestamp: 'Ontem',
      repsCompleted: 10,
      targetReps: 10,
      pointsEarned: 780,
      accuracy: 92,
      durationSeconds: 42,
    },
    {
      exerciseId: 'squat',
      exerciseName: 'Agachamento',
      timestamp: 'Anteontem',
      repsCompleted: 15,
      targetReps: 15,
      pointsEarned: 1120,
      accuracy: 94,
      durationSeconds: 65,
    }
  ]
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function recordWorkoutCompletion(result: WorkoutResult): UserProfile {
  const current = loadUserProfile();
  const updatedPoints = current.totalPoints + result.pointsEarned;
  const updatedSessions = Math.min(current.weekTarget, current.weekSessions + 1);
  const updatedStreak = current.streakDays + 1;
  const updatedRecord = Math.max(current.streakRecord, updatedStreak);

  // Level up every 2500 points
  const newLevel = Math.floor(updatedPoints / 2500) + 1;
  const levelTitles = ['Iniciante', 'Foco', 'Disciplina', 'Constância', 'Mestre do Movimento', 'Atleta Pro'];
  const newTitle = levelTitles[Math.min(levelTitles.length - 1, newLevel - 1)] || 'Constância';

  const updated: UserProfile = {
    ...current,
    totalPoints: updatedPoints,
    weekSessions: updatedSessions,
    streakDays: updatedStreak,
    streakRecord: updatedRecord,
    level: newLevel,
    levelTitle: newTitle,
    history: [result, ...current.history.slice(0, 19)],
  };

  saveUserProfile(updated);
  return updated;
}
