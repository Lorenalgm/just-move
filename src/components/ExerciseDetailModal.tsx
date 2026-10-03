import React from 'react';
import { ExerciseConfig } from '../types/exercise';
import { X, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: ExerciseConfig;
  isOpen: boolean;
  onClose: () => void;
  onStart: (exercise: ExerciseConfig) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#10241E] border border-[#204439] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1C3B32]">
          <div>
            <span className="text-xs font-semibold text-move-mint">
              {exercise.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {exercise.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-move-gray hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <p className="text-xs sm:text-sm text-move-gray leading-relaxed">
            {exercise.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-[#142C24] p-3 rounded-2xl border border-[#1E3F34] text-center">
            <div>
              <div className="text-[11px] text-move-gray">Meta</div>
              <div className="text-sm sm:text-base font-bold text-white">{exercise.targetReps} reps</div>
            </div>
            <div className="border-x border-[#1E3F34]">
              <div className="text-[11px] text-move-gray">Pontuação</div>
              <div className="text-sm sm:text-base font-bold text-move-orange">+{exercise.targetPoints} pts</div>
            </div>
            <div>
              <div className="text-[11px] text-move-gray">Ângulo alvo</div>
              <div className="text-sm sm:text-base font-bold text-move-mint">
                {exercise.targetAngleMin}° a {exercise.targetAngleMax}°
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-move-mint" /> Como executar
            </h4>
            <ul className="space-y-1.5 text-xs text-move-gray">
              {exercise.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#142C24]/60 p-2 rounded-xl border border-white/5">
                  <span className="w-4 h-4 rounded-full bg-move-mint/20 text-move-mint flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug text-slate-200">{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Dicas de postura
            </h4>
            <ul className="space-y-1 text-xs text-move-gray">
              {exercise.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onStart(exercise);
            }}
            className="w-full py-3.5 rounded-2xl bg-move-orange hover:bg-move-orangeHover text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-move-orange/30 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Começar treino com câmera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
