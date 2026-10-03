import React from 'react';
import { UserProfile } from '../types/exercise';
import { Flame, Trophy, Smartphone, Monitor, BookOpen, Home, Activity } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  activeTab: 'home' | 'dashboard';
  onSelectTab: (tab: 'home' | 'dashboard') => void;
  onOpenTutorial: () => void;
  deviceMode: 'web' | 'mobile';
  onToggleDeviceMode: (mode: 'web' | 'mobile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  onSelectTab,
  onOpenTutorial,
  deviceMode,
  onToggleDeviceMode,
}) => {
  return (
    <header className="w-full bg-[#091512]/90 backdrop-blur-xl border-b border-[#1A3830] sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-move-orange to-amber-500 p-0.5 shadow-[0_0_15px_rgba(255,107,44,0.35)] group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[10px] bg-[#0A1613] flex items-center justify-center">
                <span className="text-base font-black text-move-orange">JM</span>
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                Just Move
              </span>
              <span className="text-[11px] text-move-gray font-medium">
                Exercícios guiados por câmera
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-move-mint/15 text-move-mint border border-move-mint/30 shadow-[0_0_12px_rgba(0,232,157,0.15)]'
                  : 'text-move-gray hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-move-mint/15 text-move-mint border border-move-mint/30 shadow-[0_0_12px_rgba(0,232,157,0.15)]'
                  : 'text-move-gray hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Treinos & Métricas</span>
            </button>

            <button
              onClick={onOpenTutorial}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-move-gray hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Como Funciona (Tutorial)</span>
            </button>
          </nav>
        </div>

        {/* Right Stats & View Mode Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* User Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#122A23] border border-[#1E4338] text-xs font-bold text-white shadow-sm">
            <Flame className="w-4 h-4 text-move-orange animate-pulse" />
            <span>{profile.streakDays} dias</span>
          </div>

          {/* User Total Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#122A23] border border-[#1E4338] text-xs font-bold text-move-orange shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{profile.totalPoints.toLocaleString('pt-BR')} pts</span>
          </div>

          {/* Mode Switcher (Web Desktop vs Celular Mobile) */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-[#0D1E19] border border-[#1C3A32]">
            <button
              onClick={() => onToggleDeviceMode('web')}
              title="Modo Navegador Web (Layout Completo)"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                deviceMode === 'web'
                  ? 'bg-move-mint text-[#081310] shadow-[0_0_8px_rgba(0,232,157,0.4)]'
                  : 'text-move-gray hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web</span>
            </button>

            <button
              onClick={() => onToggleDeviceMode('mobile')}
              title="Modo Mobile (Simulação de Celular)"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-move-orange text-white shadow-[0_0_8px_rgba(255,107,44,0.4)]'
                  : 'text-move-gray hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
