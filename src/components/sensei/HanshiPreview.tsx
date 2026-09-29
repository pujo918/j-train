'use client';

import React from 'react';

interface HanshiPreviewProps {
  kanji?: string;
  subText?: string;
  stampText?: string;
  className?: string;
  onClick?: () => void;
  showGrid?: boolean;
}

export const HanshiPreview: React.FC<HanshiPreviewProps> = ({
  kanji = "道",
  subText = "楷書・基本",
  stampText = "松",
  className = "",
  onClick,
  showGrid = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-[#FAF5E9] border-2 border-[#D1C7B7] rounded-lg overflow-hidden shadow-inner cursor-pointer group transition-transform hover:scale-102 ${className}`}
      style={{
        backgroundImage: `radial-gradient(#E8DFD0 0.8px, transparent 0.8px), radial-gradient(#E8DFD0 0.8px, #FAF5E9 0.8px)`,
        backgroundSize: `16px 16px`,
        backgroundPosition: `0 0, 8px 8px`
      }}
      title="Klik untuk memperbesar lembar hanshi (Lightbox)"
    >
      {/* Hanshi Grid Guidelines (Traditional Japanese Calligraphy 4-Quadrant lines) */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 130">
          <line x1="50" y1="0" x2="50" y2="130" stroke="#C2B6A3" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#C2B6A3" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="0" y1="0" x2="100" y2="130" stroke="#DDD2C1" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="100" y1="0" x2="0" y2="130" stroke="#DDD2C1" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      )}

      {/* Main Calligraphy Kanji Character */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-serif select-none text-[#18181B] font-black tracking-normal leading-none"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
            fontSize: '52px',
            textShadow: '0 0 1px rgba(0,0,0,0.4)',
          }}
        >
          {kanji}
        </span>
      </div>

      {/* Side metadata script (e.g. Dewi Lestari / MAN 1 Pasuruan) */}
      <div className="absolute top-2 left-1.5 text-[7px] text-[#52525B] font-serif leading-tight select-none writing-vertical">
        <span className="block font-bold">高一</span>
        <span className="block">満一</span>
      </div>

      {/* Traditional Red Hanko Seal (Inkan) */}
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-[#B91C1C] border border-[#991B1B] rounded-xs flex items-center justify-center shadow-xs">
        <span className="text-[8px] font-black text-white leading-none font-serif select-none">
          {stampText}
        </span>
      </div>

      {/* Hover Lightbox Indicator Overlay */}
      <div className="absolute inset-0 bg-sumi/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-[9px] bg-white/95 text-sumi font-bold px-1.5 py-0.5 rounded shadow-xs">
          Zoom 🔍
        </span>
      </div>
    </div>
  );
};
