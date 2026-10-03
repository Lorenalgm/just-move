import React from 'react';
import { UserProfile, ExerciseConfig } from '../types/exercise';
import { EXERCISES } from '../services/exerciseData';
import { Header } from './Header';
import { NextSessionCard } from './NextSessionCard';
import { ExerciseList } from './ExerciseList';
import { StreakCard } from './StreakCard';

interface MobileDashboardProps {
  profile: UserProfile;
  selectedExercise: ExerciseConfig;
  onSelectExercise: (exercise: ExerciseConfig) => void;
  onStartExercise: (exercise: ExerciseConfig) => void;
  onOpenDetails: (exercise: ExerciseConfig) => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  profile,
  selectedExercise,
  onSelectExercise,
  onStartExercise,
  onOpenDetails,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center animate-in fade-in duration-300">
      {/* Phone Shell */}
      <div className="relative w-full rounded-[44px] bg-[#0A1613] p-3 sm:p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] border-4 border-[#1B362F] overflow-hidden">
        {/* Phone Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#050C0A] rounded-full z-30 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-1 bg-[#1A312A] rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0E1E1A] ml-2" />
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative w-full min-h-[680px] max-h-[820px] bg-[#0B1814] rounded-[36px] overflow-y-auto overflow-x-hidden p-4 sm:p-5 flex flex-col justify-between gap-5 no-scrollbar">
          <Header profile={profile} />

          <NextSessionCard
            exercise={selectedExercise}
            onStart={() => onStartExercise(selectedExercise)}
          />

          <ExerciseList
            exercises={EXERCISES}
            selectedExercise={selectedExercise}
            onSelectExercise={onSelectExercise}
            onOpenDetails={onOpenDetails}
          />

          <StreakCard profile={profile} />
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-move-gray">
        <span>✨ Visualização responsiva mobile fiel ao design.</span>
      </div>
    </div>
  );
};
