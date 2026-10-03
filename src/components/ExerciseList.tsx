import React from 'react';
import { ExerciseConfig } from '../types/exercise';
import { ChevronRight, Activity, Flame, Zap, TrendingUp } from 'lucide-react';

interface ExerciseListProps {
  exercises: ExerciseConfig[];
  selectedExercise: ExerciseConfig;
  onSelectExercise: (exercise: ExerciseConfig) => void;
  onOpenDetails: (exercise: ExerciseConfig) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  selectedExercise,
  onSelectExercise,
  onOpenDetails,
}) => {
  // SVG stick figures representing each movement
  const renderExerciseFigure = (id: string) => {
    switch (id) {
      case 'shoulder_abduction':
        return (
          <svg className="w-10 h-10 text-move-mint" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="24" cy="10" r="5" />
            {/* Spine */}
            <line x1="24" y1="15" x2="24" y2="30" />
            {/* Arms raised horizontally */}
            <line x1="10" y1="21" x2="38" y2="21" />
            {/* Legs */}
            <line x1="24" y1="30" x2="18" y2="42" />
            <line x1="24" y1="30" x2="30" y2="42" />
          </svg>
        );
      case 'shoulder_flexion':
        return (
          <svg className="w-10 h-10 text-move-mint" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="21" cy="10" r="5" />
            {/* Torso */}
            <line x1="21" y1="15" x2="21" y2="30" />
            {/* Arm forward */}
            <line x1="21" y1="20" x2="36" y2="15" />
            {/* Legs */}
            <line x1="21" y1="30" x2="16" y2="42" />
            <line x1="21" y1="30" x2="26" y2="42" />
          </svg>
        );
      case 'squat':
        return (
          <svg className="w-10 h-10 text-move-mint" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="24" cy="12" r="5" />
            {/* Torso */}
            <line x1="24" y1="17" x2="22" y2="28" />
            {/* Arms */}
            <line x1="23" y1="20" x2="34" y2="20" />
            {/* Squat bent legs */}
            <path d="M 22 28 L 14 34 L 16 43" />
            <path d="M 22 28 L 30 34 L 28 43" />
          </svg>
        );
      case 'jumping_jacks':
      default:
        return (
          <svg className="w-10 h-10 text-move-mint" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="9" r="4.5" />
            <line x1="24" y1="13.5" x2="24" y2="28" />
            <line x1="24" y1="19" x2="11" y2="10" />
            <line x1="24" y1="19" x2="37" y2="10" />
            <line x1="24" y1="28" x2="13" y2="41" />
            <line x1="24" y1="28" x2="35" y2="41" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white">Movimentos</h3>
        <button
          onClick={() => onOpenDetails(selectedExercise)}
          className="text-xs font-semibold text-move-gray hover:text-white transition-colors"
        >
          Ver todos
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
        {exercises.map((ex) => {
          const isSelected = selectedExercise.id === ex.id;

          return (
            <button
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className={`flex flex-col justify-between p-4 rounded-3xl min-w-[135px] sm:min-w-[145px] text-left transition-all border ${
                isSelected
                  ? 'bg-[#18362D] border-move-mint/60 shadow-[0_0_15px_rgba(0,232,157,0.15)] ring-1 ring-move-mint/40'
                  : 'bg-[#132A24] border-[#1F3E35] hover:bg-[#16312A]'
              }`}
            >
              <div className="h-12 flex items-center justify-start mb-2">
                {renderExerciseFigure(ex.id)}
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {ex.name}
                </h4>
                <div className="text-[11px] font-semibold text-move-orange mt-1">
                  {ex.bestScore} best
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
