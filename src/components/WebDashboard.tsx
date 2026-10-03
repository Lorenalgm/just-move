import React from 'react';
import { UserProfile, ExerciseConfig } from '../types/exercise';
import { EXERCISES } from '../services/exerciseData';
import { Play, Flame, Trophy, Calendar, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface WebDashboardProps {
  profile: UserProfile;
  selectedExercise: ExerciseConfig;
  onSelectExercise: (ex: ExerciseConfig) => void;
  onStartExercise: (ex: ExerciseConfig) => void;
  onOpenTutorial: () => void;
}

export const WebDashboard: React.FC<WebDashboardProps> = ({
  profile,
  selectedExercise,
  onSelectExercise,
  onStartExercise,
  onOpenTutorial,
}) => {
  const weekProgressPercent = Math.min(100, Math.round((profile.weekSessions / profile.weekTarget) * 100));

  return (
    <div className="w-full flex flex-col gap-6 py-2 sm:py-4 animate-in fade-in duration-300">
      {/* 2-Column Responsive Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (Left - 7 cols on lg, approx 60%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Featured Next Session Banner */}
          <div className="bg-gradient-to-r from-[#122A23] via-[#16352D] to-[#122A23] border border-[#214A3D] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
              <div className="max-w-md">
                <span className="text-xs font-semibold text-move-gray">
                  Próxima sessão recomendada
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {selectedExercise.name}
                </h2>
                <p className="text-xs sm:text-sm text-move-gray mt-1 leading-relaxed">
                  {selectedExercise.description}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-medium text-slate-200">
                  <span className="bg-[#091512] px-3 py-1.5 rounded-xl border border-white/10">
                    {selectedExercise.targetReps} repetições
                  </span>
                  <span className="bg-[#091512] px-3 py-1.5 rounded-xl border border-white/10 text-move-orange font-semibold">
                    +{selectedExercise.targetPoints} pontos
                  </span>
                  <span className="bg-[#091512] px-3 py-1.5 rounded-xl border border-white/10 text-move-mint font-semibold">
                    Alvo {selectedExercise.targetAngleMin}° a {selectedExercise.targetAngleMax}°
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => onStartExercise(selectedExercise)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-move-orange to-move-orangeHover text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-move-orange/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Começar treino</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Library Grid */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-lg font-bold text-white">Exercícios para praticar</h3>
                <p className="text-xs text-move-gray">Selecione o movimento que deseja treinar com a câmera.</p>
              </div>
              <button
                onClick={onOpenTutorial}
                className="text-xs font-semibold text-move-mint hover:underline flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Ver tutorial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {EXERCISES.map((ex) => {
                const isSelected = selectedExercise.id === ex.id;

                return (
                  <div
                    key={ex.id}
                    onClick={() => onSelectExercise(ex)}
                    className={`cursor-pointer p-4 rounded-3xl border transition-all flex flex-col justify-between shadow-md ${
                      isSelected
                        ? 'bg-[#16352C] border-move-mint/60 shadow-[0_0_15px_rgba(0,232,157,0.15)] ring-1 ring-move-mint/30'
                        : 'bg-[#10241E] border-[#1E3F34] hover:bg-[#142C24]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-move-gray">
                          {ex.category}
                        </span>
                        <span className="text-xs font-semibold text-move-orange">
                          {ex.bestScore} recorde
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">
                        {ex.name}
                      </h4>
                      <p className="text-xs text-move-gray line-clamp-2 leading-relaxed mb-3">
                        {ex.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">
                        {ex.targetReps} reps · {ex.primaryJoints}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartExercise(ex);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-move-orange hover:bg-move-orangeHover text-white text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Treinar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right - 4 cols on lg, approx 40%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Streak */}
          <div className="bg-[#10251F] border border-[#1E4337] rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-move-orange/15 border border-move-orange/30 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-move-orange animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-move-gray font-medium block">
                  Sequência atual
                </span>
                <span className="text-lg font-bold text-white">
                  {profile.streakDays} dias seguidos
                </span>
                <span className="text-[11px] text-move-mint block mt-0.5">
                  Recorde pessoal: {profile.streakRecord} dias
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Weekly Goal */}
          <div className="bg-[#10251F] border border-[#1E4337] rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-move-gray font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-move-mint" />
                <span>Meta da semana</span>
              </span>
              <span className="text-white font-bold">
                {profile.weekSessions} de {profile.weekTarget} sessões
              </span>
            </div>
            <div className="w-full bg-[#081512] h-2 rounded-full overflow-hidden">
              <div
                className="bg-move-orange h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#FF6B2C]"
                style={{ width: `${weekProgressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-move-gray">
              {profile.weekSessions >= profile.weekTarget
                ? 'Meta da semana atingida!'
                : `Faltam ${profile.weekTarget - profile.weekSessions} sessões para concluir a meta.`}
            </span>
          </div>

          {/* Card 3: User Level & XP */}
          <div className="bg-[#10251F] border border-[#1E4337] rounded-3xl p-5 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-move-gray font-medium flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Seu nível</span>
              </span>
              <span className="text-move-orange font-bold">
                {profile.totalPoints.toLocaleString('pt-BR')} pontos
              </span>
            </div>
            <div className="text-base font-bold text-white">
              Nível {profile.level} - {profile.levelTitle}
            </div>
            <div className="text-[11px] text-move-gray">
              Próximo nível a cada 2.500 pontos acumulados.
            </div>
          </div>

          {/* Card 4: Recent History */}
          <div className="bg-[#10251F] border border-[#1E4337] rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-move-mint" />
              <span>Treinos recentes</span>
            </span>

            <div className="divide-y divide-[#1A3A31] text-xs">
              {profile.history.slice(0, 4).map((h, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-white block">{h.exerciseName}</span>
                    <span className="text-[11px] text-move-gray">{h.timestamp} · {h.repsCompleted} reps</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-move-orange">+{h.pointsEarned} pts</span>
                    <span className="text-[11px] text-move-mint block">{h.accuracy}% precisão</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
