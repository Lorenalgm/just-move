import React, { useEffect } from 'react';
import { ExerciseConfig, ExerciseMetrics } from '../types/exercise';
import { launchConfetti } from '../utils/confetti';
import { audioService } from '../utils/audioFeedback';
import { Trophy, Award, Flame, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface WorkoutSummaryProps {
  config: ExerciseConfig;
  metrics: ExerciseMetrics;
  onFinish: () => void;
  onRestart: () => void;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  config,
  metrics,
  onFinish,
  onRestart,
}) => {
  useEffect(() => {
    launchConfetti();
    audioService.playVictory();
    audioService.speak('Parabéns! Treino concluído com sucesso!');
  }, []);

  const totalPoints = Math.max(metrics.score, config.targetPoints);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#122620] border border-[#244A3F] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        {/* Celebration Trophy Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-move-orange to-amber-400 p-0.5 shadow-[0_0_30px_rgba(255,107,44,0.4)] mb-4">
          <div className="w-full h-full rounded-full bg-[#122620] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-move-orange animate-bounce" />
          </div>
        </div>

        <span className="text-xs font-bold text-move-mint mb-1">
          Sessão finalizada
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          Excelente treino!
        </h2>
        <p className="text-move-gray text-sm mb-6">
          Você completou o exercício de <span className="text-white font-bold">{config.name}</span> com postura guiada por IA.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-[#163028] p-4 rounded-2xl border border-[#244A3F] flex flex-col items-center">
            <div className="text-move-gray text-xs font-semibold mb-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-move-mint" /> Repetições
            </div>
            <div className="text-2xl font-black text-white">
              {metrics.repCount} <span className="text-sm font-normal text-move-gray">/{config.targetReps}</span>
            </div>
          </div>

          <div className="bg-[#163028] p-4 rounded-2xl border border-[#244A3F] flex flex-col items-center">
            <div className="text-move-gray text-xs font-semibold mb-1 flex items-center gap-1">
              <Award className="w-4 h-4 text-move-orange" /> Precisão
            </div>
            <div className="text-2xl font-black text-move-mint">
              {metrics.accuracy}%
            </div>
          </div>

          <div className="bg-[#163028] p-4 rounded-2xl border border-[#244A3F] flex flex-col items-center col-span-2">
            <div className="text-move-gray text-xs font-semibold mb-1 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> Pontos ganhos
            </div>
            <div className="text-3xl font-black text-move-orange">
              +{totalPoints} <span className="text-base font-bold text-white">pts</span>
            </div>
          </div>
        </div>

        {/* Streak Boost Announcement */}
        <div className="w-full bg-[#18362D] border border-move-mint/30 rounded-2xl p-3.5 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-move-orange/20 border border-move-orange flex items-center justify-center text-move-orange font-black text-lg">
            🔥
          </div>
          <div className="text-left">
            <div className="text-white text-xs font-bold">Sequência mantida!</div>
            <div className="text-move-gray text-xs">Sua constância aumentou para o 5º dia consecutivo.</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onFinish}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-move-orange to-move-orangeHover text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-move-orange/30 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span>Salvar e Voltar ao Início</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-move-gray hover:text-white hover:bg-white/10 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Exercício</span>
          </button>
        </div>
      </div>
    </div>
  );
};
