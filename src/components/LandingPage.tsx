import React from 'react';
import { ExerciseConfig, UserProfile } from '../types/exercise';
import { EXERCISES } from '../services/exerciseData';
import { HeroIllustration } from './HeroIllustration';
import { Play, Sparkles, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  profile: UserProfile;
  onStartExercise: (exercise: ExerciseConfig) => void;
  onGoToDashboard: () => void;
  onOpenTutorial: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  onStartExercise,
  onGoToDashboard,
  onOpenTutorial,
}) => {
  const heroExercise = EXERCISES[0]; // Abdução de ombro

  return (
    <div className="w-full flex flex-col gap-10 py-2 sm:py-6 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl bg-gradient-to-b from-[#102720] to-[#0A1713] border border-[#1F4137] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-move-mint/15 border border-move-mint/30 text-move-mint text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Treino inteligente por câmera</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Exercícios guiados pela câmera com{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-move-mint to-amber-300">
                feedback em tempo real.
              </span>
            </h1>

            <p className="text-move-gray text-base sm:text-lg leading-relaxed mb-6 max-w-lg">
              Treine na frente da tela com correção instantânea de postura, contagem automática de repetições e metas diárias para manter o ritmo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onStartExercise(heroExercise)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-move-orange to-move-orangeHover text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-move-orange/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Começar treino</span>
              </button>

              <button
                onClick={onOpenTutorial}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#142F26] border border-[#234A3E] text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Como funciona</span>
              </button>

              <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl text-move-gray hover:text-white font-semibold text-sm flex items-center justify-center gap-1 transition-all"
              >
                <span>Ver treinos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Badges strip */}
            <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-[#1C3A32] w-full text-xs text-move-gray">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-move-mint shrink-0" />
                <span>Totalmente privado no navegador</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-move-mint shrink-0" />
                <span>Comandos de voz em português</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Avatar Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="w-full">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Como funciona
          </h2>
          <p className="text-move-gray text-xs sm:text-sm mt-1">
            Três passos simples para treinar com a câmera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#10241E] border border-[#1E3F34] p-5 rounded-3xl flex flex-col items-start text-left">
            <div className="w-9 h-9 rounded-xl bg-move-mint/15 text-move-mint flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-1">Posicione a câmera</h3>
            <p className="text-xs text-move-gray leading-relaxed">
              Fique a cerca de 1,5m da tela com boa iluminação. O app reconhece sua postura em pé ou sentada.
            </p>
          </div>

          <div className="bg-[#10241E] border border-[#1E3F34] p-5 rounded-3xl flex flex-col items-start text-left">
            <div className="w-9 h-9 rounded-xl bg-move-orange/15 text-move-orange flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-1">Siga o guia visual</h3>
            <p className="text-xs text-move-gray leading-relaxed">
              Acompanhe as linhas na tela mostrando a altura ideal dos braços até 90°. O esqueleto fica verde no ponto certo.
            </p>
          </div>

          <div className="bg-[#10241E] border border-[#1E3F34] p-5 rounded-3xl flex flex-col items-start text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-1">Receba feedbacks</h3>
            <p className="text-xs text-move-gray leading-relaxed">
              Ouça bipes e orientações por voz confirmando cada repetição bem executada.
            </p>
          </div>
        </div>
      </section>

      {/* Exercises Section */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-white">Exercícios disponíveis</h3>
            <p className="text-xs text-move-gray">Escolha um movimento para começar.</p>
          </div>
          <button
            onClick={onGoToDashboard}
            className="text-xs font-semibold text-move-mint hover:underline flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXERCISES.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#112720] hover:bg-[#153128] border border-[#1E3F34] hover:border-move-mint/40 rounded-3xl p-5 flex flex-col justify-between transition-all group shadow-md"
            >
              <div>
                <span className="text-[11px] font-medium text-move-gray">
                  {ex.category}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5 mb-1 group-hover:text-move-mint transition-colors">
                  {ex.name}
                </h4>
                <p className="text-xs text-move-gray line-clamp-2 mb-3">
                  {ex.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1C3A31] flex items-center justify-between">
                <span className="text-xs font-semibold text-move-orange">
                  {ex.targetReps} reps · {ex.targetPoints} pts
                </span>
                <button
                  onClick={() => onStartExercise(ex)}
                  className="w-9 h-9 rounded-xl bg-move-orange hover:bg-move-orangeHover flex items-center justify-center text-white shadow-md shadow-move-orange/25 group-hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
