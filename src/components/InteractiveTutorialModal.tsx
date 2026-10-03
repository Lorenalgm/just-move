import React, { useState } from 'react';
import { X, Camera, Eye, Sparkles, Volume2, ChevronRight, ChevronLeft, Play } from 'lucide-react';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: () => void;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  onStartWorkout,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Posicionamento da câmera',
      tag: 'Passo 1 de 4',
      icon: <Camera className="w-5 h-5 text-move-mint" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-move-gray">
            Para a câmera enxergar seus movimentos sem falhas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#122A23] p-3 rounded-2xl border border-[#1E4338] text-center">
              <div className="text-xl mb-1">📏</div>
              <div className="text-xs font-bold text-white">Distância</div>
              <div className="text-[11px] text-move-gray mt-0.5">1,5m da tela para enquadrar os braços abertos.</div>
            </div>

            <div className="bg-[#122A23] p-3 rounded-2xl border border-[#1E4338] text-center">
              <div className="text-xl mb-1">💡</div>
              <div className="text-xs font-bold text-white">Iluminação</div>
              <div className="text-[11px] text-move-gray mt-0.5">Luz de frente. Evite janelas fortes atrás de você.</div>
            </div>

            <div className="bg-[#122A23] p-3 rounded-2xl border border-[#1E4338] text-center">
              <div className="text-xl mb-1">🪑</div>
              <div className="text-xs font-bold text-white">Flexibilidade</div>
              <div className="text-[11px] text-move-gray mt-0.5">Você pode treinar braços em pé ou sentada na cadeira.</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Cores do esqueleto na tela',
      tag: 'Passo 2 de 4',
      icon: <Eye className="w-5 h-5 text-move-orange" />,
      content: (
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm text-move-gray">
            O esqueleto desenhado sobre seu corpo muda de cor conforme sua postura:
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-3.5 h-3.5 rounded-full bg-move-mint shadow-[0_0_6px_#00E89D] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-move-mint">Verde (perfeito)</span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Amplitude ideal de 90° atingida com boa postura.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300">Amarelo (continue subindo)</span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Braços em movimento, continue elevando até a altura dos ombros.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-300">Vermelho (correção)</span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Braços altos demais ou tronco inclinado. Mantenha a coluna ereta.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'O movimento correto',
      tag: 'Passo 3 de 4',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-move-gray">
            Exemplo na abdução de ombro: suba até 90° e desça com controle.
          </p>

          <div className="w-full bg-[#0B1A15] border border-[#1A382F] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
            <svg className="w-48 h-28" viewBox="0 0 200 120" fill="none">
              <circle cx="100" cy="25" r="12" stroke="#00E89D" strokeWidth="2.5" fill="rgba(0,232,157,0.1)" />
              <line x1="100" y1="37" x2="100" y2="95" stroke="#00E89D" strokeWidth="3" />

              <line x1="25" y1="52" x2="175" y2="52" stroke="#FF6B2C" strokeWidth="2" strokeDasharray="4 4" />
              <text x="35" y="45" fill="#FF6B2C" fontSize="10" fontWeight="bold">Alvo 90°</text>
              <text x="135" y="45" fill="#FF6B2C" fontSize="10" fontWeight="bold">Alvo 90°</text>

              <line x1="100" y1="52" x2="50" y2="52" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
              <line x1="100" y1="52" x2="150" y2="52" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />

              <circle cx="100" cy="52" r="4" fill="#0A1613" stroke="#00FFA3" strokeWidth="2" />
              <circle cx="50" cy="52" r="4" fill="#0A1613" stroke="#00FFA3" strokeWidth="2" />
              <circle cx="150" cy="52" r="4" fill="#0A1613" stroke="#00FFA3" strokeWidth="2" />
            </svg>
            <span className="text-[11px] text-move-mint font-medium mt-1">
              Eleve até a linha pontilhada e desça até a posição inicial para validar a repetição.
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Áudio e comandos por voz',
      tag: 'Passo 4 de 4',
      icon: <Volume2 className="w-5 h-5 text-move-mint" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-move-gray">
            Você pode treinar apenas ouvindo os sons do app:
          </p>

          <div className="space-y-1.5 text-xs">
            <div className="bg-[#122A23] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Bipe de confirmação:</span>
              <span className="text-move-mint font-semibold">Repetição validada</span>
            </div>
            <div className="bg-[#122A23] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Voz em português:</span>
              <span className="text-white font-semibold">"Perfeito!", "Excelente!", "Coluna ereta"</span>
            </div>
            <div className="bg-[#122A23] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Som final:</span>
              <span className="text-move-orange font-semibold">Meta de repetições concluída</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-[#0E201B] border border-[#1E4337] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1A382F]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#142C24] border border-[#234B3E] flex items-center justify-center shrink-0">
              {steps[currentStep].icon}
            </div>
            <div>
              <span className="text-[10px] text-move-mint font-semibold block">
                {steps[currentStep].tag}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-move-gray hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-4">
          {steps[currentStep].content}
        </div>

        {/* Step Navigation */}
        <div className="pt-3 border-t border-[#1A382F] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === i
                    ? 'w-5 bg-move-mint shadow-[0_0_6px_#00E89D]'
                    : 'w-2 bg-[#1B362F] hover:bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-move-gray hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 rounded-xl bg-move-mint text-[#081310] text-xs font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_8px_rgba(0,232,157,0.3)]"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onStartWorkout();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-move-orange to-move-orangeHover text-white text-xs font-bold flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-move-orange/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Começar treino</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
