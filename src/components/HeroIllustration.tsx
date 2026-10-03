import React from 'react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Just Move
        </h1>
        <p className="text-move-gray text-base md:text-lg lg:text-xl font-medium mt-2 max-w-sm">
          Exercícios guiados pela câmera do celular.
        </p>
      </div>

      {/* Stylized Humanoid Avatar with Skeleton Tracking matching user's illustration */}
      <div className="relative w-64 h-96 flex items-center justify-center">
        <svg
          viewBox="0 0 240 380"
          className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle floor contact shadow */}
          <ellipse cx="120" cy="365" rx="55" ry="12" fill="#06100D" opacity="0.8" />

          {/* Legs */}
          {/* Left leg pants */}
          <rect x="94" y="220" width="22" height="135" rx="8" fill="#2C3E50" />
          {/* Right leg pants */}
          <rect x="124" y="220" width="22" height="135" rx="8" fill="#2C3E50" />

          {/* Shoes */}
          <ellipse cx="104" cy="358" rx="14" ry="7" fill="#E2E8F0" />
          <ellipse cx="136" cy="358" rx="14" ry="7" fill="#E2E8F0" />

          {/* Torso / Orange Shirt */}
          <path
            d="M 80 150 L 92 145 L 148 145 L 160 150 L 155 230 L 85 230 Z"
            fill="#FF6B2C"
          />
          {/* Shirt details */}
          <rect x="108" y="172" width="24" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />

          {/* Neck & Head */}
          <rect x="114" y="125" width="12" height="22" rx="4" fill="#8D5538" />
          {/* Head */}
          <circle cx="120" cy="115" r="28" fill="#8D5538" />
          {/* Hair */}
          <path
            d="M 96 112 C 96 90 144 90 144 112 C 144 100 134 94 120 94 C 106 94 96 100 96 112 Z"
            fill="#261A15"
          />
          {/* Cute Face Smile */}
          <circle cx="112" cy="115" r="2.5" fill="#261A15" />
          <circle cx="128" cy="115" r="2.5" fill="#261A15" />
          <path
            d="M 115 124 Q 120 128 125 124"
            stroke="#261A15"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Arms (Orange short sleeves + skin arms) */}
          {/* Left sleeve & arm */}
          <path d="M 80 150 L 68 180 L 82 188 L 92 155 Z" fill="#FF6B2C" />
          <path d="M 70 180 L 62 230 L 73 232 L 80 186 Z" fill="#8D5538" />
          <circle cx="68" cy="235" r="7" fill="#8D5538" />

          {/* Right sleeve & arm */}
          <path d="M 160 150 L 172 180 L 158 188 L 148 155 Z" fill="#FF6B2C" />
          <path d="M 170 180 L 178 230 L 167 232 L 160 186 Z" fill="#8D5538" />
          <circle cx="172" cy="235" r="7" fill="#8D5538" />

          {/* SKELETON OVERLAY (Neon Green #00E89D matching mockup!) */}
          {/* Head Ring */}
          <circle
            cx="120"
            cy="115"
            r="38"
            stroke="#00E89D"
            strokeWidth="3.5"
            fill="rgba(0, 232, 157, 0.08)"
            className="drop-shadow-[0_0_8px_#00E89D]"
          />

          {/* Shoulder line */}
          <line x1="78" y1="150" x2="162" y2="150" stroke="#00E89D" strokeWidth="3" />

          {/* Spine & Torso box */}
          <line x1="120" y1="150" x2="120" y2="225" stroke="#00E89D" strokeWidth="3" />
          <line x1="88" y1="225" x2="152" y2="225" stroke="#00E89D" strokeWidth="3" />
          <line x1="78" y1="150" x2="88" y2="225" stroke="#00E89D" strokeWidth="2.5" />
          <line x1="162" y1="150" x2="152" y2="225" stroke="#00E89D" strokeWidth="2.5" />

          {/* Left Arm Skeleton */}
          <line x1="78" y1="150" x2="72" y2="188" stroke="#00E89D" strokeWidth="3" />
          <line x1="72" y1="188" x2="68" y2="235" stroke="#00E89D" strokeWidth="3" />

          {/* Right Arm Skeleton */}
          <line x1="162" y1="150" x2="168" y2="188" stroke="#00E89D" strokeWidth="3" />
          <line x1="168" y1="188" x2="172" y2="235" stroke="#00E89D" strokeWidth="3" />

          {/* Left Leg Skeleton */}
          <line x1="104" y1="225" x2="104" y2="285" stroke="#00E89D" strokeWidth="3" />
          <line x1="104" y1="285" x2="104" y2="355" stroke="#00E89D" strokeWidth="3" />

          {/* Right Leg Skeleton */}
          <line x1="136" y1="225" x2="136" y2="285" stroke="#00E89D" strokeWidth="3" />
          <line x1="136" y1="285" x2="136" y2="355" stroke="#00E89D" strokeWidth="3" />

          {/* Joint Nodes */}
          {[
            { cx: 78, cy: 150 },
            { cx: 162, cy: 150 },
            { cx: 72, cy: 188 },
            { cx: 168, cy: 188 },
            { cx: 68, cy: 235 },
            { cx: 172, cy: 235 },
            { cx: 104, cy: 225 },
            { cx: 136, cy: 225 },
            { cx: 104, cy: 285 },
            { cx: 136, cy: 285 },
            { cx: 104, cy: 355 },
            { cx: 136, cy: 355 },
          ].map((pt, i) => (
            <circle
              key={i}
              cx={pt.cx}
              cy={pt.cy}
              r="5"
              fill="#06120F"
              stroke="#00E89D"
              strokeWidth="2.5"
            />
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#132A24] border border-[#214339] text-xs font-semibold text-move-mint">
        <span className="w-2 h-2 rounded-full bg-move-mint animate-ping" />
        <span>Rastreamento articular de alta precisão</span>
      </div>
    </div>
  );
};
