import React from 'react';
import { UserProfile } from '../types/exercise';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  profile: UserProfile;
}

export const StreakCard: React.FC<StreakCardProps> = ({ profile }) => {
  const diffToRecord = Math.max(1, profile.streakRecord - profile.streakDays);

  return (
    <div className="w-full bg-[#132A24] border border-[#1E3E34] rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-move-orange/15 border border-move-orange/30 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 text-move-orange animate-pulse" />
        </div>
        <div>
          <div className="text-sm sm:text-base font-extrabold text-white">
            Sequência de {profile.streakDays} dias
          </div>
          <div className="text-xs text-move-gray font-medium mt-0.5">
            {profile.streakDays >= profile.streakRecord
              ? 'Novo recorde pessoal atingido! 🎉'
              : `Mais ${diffToRecord} para o recorde`}
          </div>
        </div>
      </div>

      {/* Streak Number Badge */}
      <div className="text-2xl sm:text-3xl font-black text-move-orange px-2 font-mono">
        {profile.streakDays}
      </div>
    </div>
  );
};
