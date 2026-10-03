import React from 'react';
import { ExerciseConfig } from '../types/exercise';
import { Play } from 'lucide-react';

interface NextSessionCardProps {
  exercise: ExerciseConfig;
  onStart: () => void;
}

export const NextSessionCard: React.FC<NextSessionCardProps> = ({
  exercise,
  onStart,
}) => {
  return (
    <div className="w-full bg-[#142B25] hover:bg-[#18332C] transition-all border border-[#214339] rounded-3xl p-5 shadow-xl relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-move-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-move-gray">
            Próxima sessão
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            {exercise.name}
          </h2>
          <p className="text-xs sm:text-sm text-move-gray font-medium mt-1">
            {exercise.targetReps} reps · meta {exercise.targetPoints} pts
          </p>
        </div>

        {/* Big Orange Play Button */}
        <button
          onClick={onStart}
          aria-label={`Iniciar ${exercise.name}`}
          className="w-14 h-14 rounded-full bg-move-orange hover:bg-move-orangeHover active:scale-95 transition-all flex items-center justify-center shadow-[0_6px_20px_rgba(255,107,44,0.4)] group-hover:scale-105 shrink-0"
        >
          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
        </button>
      </div>

      {/* Progress Segments */}
      <div className="flex items-center gap-1.5 mt-5">
        <div className="h-1.5 flex-1 bg-move-mint rounded-full shadow-[0_0_6px_#00E89D]" />
        <div className="h-1.5 flex-1 bg-move-mint rounded-full shadow-[0_0_6px_#00E89D]" />
        <div className="h-1.5 flex-1 bg-[#1F3D34] rounded-full" />
        <div className="h-1.5 flex-1 bg-[#1F3D34] rounded-full" />
      </div>
    </div>
  );
};
