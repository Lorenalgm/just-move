import React from 'react';
import { UserProfile } from '../types/exercise';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  const weekProgressPercent = Math.min(100, Math.round((profile.weekSessions / profile.weekTarget) * 100));

  return (
    <div className="w-full flex flex-col gap-4 pt-1">
      {/* Simulated Mobile Status Bar (9:41, wifi, battery) */}
      <div className="flex items-center justify-between text-move-gray text-xs px-1 font-semibold opacity-80">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Just Move
          </h1>
          <p className="text-xs sm:text-sm text-move-gray font-medium mt-0.5">
            Nível {profile.level} - {profile.levelTitle}
          </p>
        </div>

        {/* Total Points Badge */}
        <div className="text-right">
          <div className="text-[11px] font-semibold text-move-gray">
            Total de pontos
          </div>
          <div className="text-xl sm:text-2xl font-black text-move-orange tracking-tight">
            {profile.totalPoints.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Meta da semana */}
      <div className="bg-[#122620] border border-[#1E3B33] rounded-2xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-move-gray">Meta da semana</span>
          <span className="text-white font-bold">
            {profile.weekSessions} / {profile.weekTarget} sessões
          </span>
        </div>
        <div className="w-full bg-[#0B1A15] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-move-orange to-move-orangeLight rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,107,44,0.5)]"
            style={{ width: `${weekProgressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
