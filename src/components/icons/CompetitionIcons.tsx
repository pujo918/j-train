import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * 1. SHODOU (書道) - Traditional Japanese Calligraphy Brush (Fude)
 * Angled fude brush with dark crimson/wood handle, white ferrule collar,
 * flame-tapered bristle, and sumi ink tip with dark crisp outline.
 */
export const ShodouIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Angled brush from top-right down to bottom-left */}
    <g transform="rotate(-45 32 32)">
      {/* Bamboo/Wood Handle */}
      <rect
        x="30"
        y="6"
        width="4.5"
        height="30"
        rx="2"
        fill="#9E2A36"
        stroke="#241A1C"
        strokeWidth="1.8"
      />
      {/* Ferrule (White/Silver collar) */}
      <rect
        x="29"
        y="36"
        width="6.5"
        height="5"
        rx="1"
        fill="#FFFFFF"
        stroke="#241A1C"
        strokeWidth="1.8"
      />
      {/* Brush Hair / Bristles Body (Crimson tone matching mockup) */}
      <path
        d="M29 41 C27 45, 27 50, 32 58 C37 50, 37 45, 35.5 41 Z"
        fill="#C9525C"
        stroke="#241A1C"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Deep Sumi Black Ink Tip */}
      <path
        d="M30 50 C29 53, 30.5 56, 32 58 C33.5 56, 35 53, 34 50 Z"
        fill="#241A1C"
      />
    </g>
  </svg>
);

/**
 * 2. KANJI (漢字) - Red Japanese Character Book / Dictionary
 * Exactly matches mockup: A closed Japanese volume with deep maroon spine on left,
 * warm coral-rose front cover with 4 bold Kanji characters (『文葉』/『文字』),
 * white pages visible at bottom with page groove line, and crisp dark outlines.
 */
export const KanjiIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Subtle ground shadow */}
    <rect x="15" y="55" width="34" height="2" rx="1" fill="#E5E7EB" />

    {/* Japanese Book Spine (Left strip - Deep Maroon) */}
    <rect
      x="14"
      y="9"
      width="8"
      height="40"
      rx="1.5"
      fill="#7C282F"
    />

    {/* Main Front Cover (Warm Coral-Rose Crimson) */}
    <rect
      x="22"
      y="9"
      width="28"
      height="40"
      rx="1.5"
      fill="#D26771"
    />

    {/* Spine & Cover Divider Line */}
    <line
      x1="22"
      y1="9"
      x2="22"
      y2="49"
      stroke="#241A1C"
      strokeWidth="2"
    />

    {/* 4 Kanji Characters directly on cover: 『文葉』 / 『文字』 */}
    {/* Top Row: 文 葉 */}
    <text
      x="29"
      y="24"
      textAnchor="middle"
      fontSize="10.5"
      fontWeight="900"
      fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
      fill="#241A1C"
    >
      文
    </text>
    <text
      x="43"
      y="24"
      textAnchor="middle"
      fontSize="10.5"
      fontWeight="900"
      fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
      fill="#241A1C"
    >
      葉
    </text>

    {/* Bottom Row: 文 字 */}
    <text
      x="29"
      y="40"
      textAnchor="middle"
      fontSize="10.5"
      fontWeight="900"
      fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
      fill="#241A1C"
    >
      文
    </text>
    <text
      x="43"
      y="40"
      textAnchor="middle"
      fontSize="10.5"
      fontWeight="900"
      fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
      fill="#241A1C"
    >
      字
    </text>

    {/* White Paper Pages Block at Bottom */}
    <rect
      x="14"
      y="49"
      width="36"
      height="7"
      rx="1"
      fill="#FFFFFF"
      stroke="#241A1C"
      strokeWidth="2"
    />
    {/* Horizontal page groove line */}
    <line
      x1="18"
      y1="52.5"
      x2="46"
      y2="52.5"
      stroke="#241A1C"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Outer boundary stroke for cover */}
    <rect
      x="14"
      y="9"
      width="36"
      height="40"
      rx="2"
      fill="none"
      stroke="#241A1C"
      strokeWidth="2"
    />
  </svg>
);

/**
 * 3. KIKIKAKITORI (聞き書き) - Studio Crimson Headphones
 * Headband with top padding cushion, crimson oval earcups with pinkish bevel,
 * dark outlines matching the mockup.
 */
export const KikikakitoriIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Headphone Arch / Black Band */}
    <path
      d="M17 36 C17 17, 47 17, 47 36"
      stroke="#241A1C"
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Padded Top Cushion (Crimson) */}
    <path
      d="M23 22 C27 17, 37 17, 41 22"
      stroke="#9E2A36"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Cushion Highlight Line */}
    <path
      d="M24 22 C27 18, 37 18, 40 22"
      stroke="#E0858F"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Left Earcup */}
    <g>
      {/* Top hinge connector pin */}
      <rect x="15" y="27" width="4" height="3" fill="#241A1C" rx="1" />
      {/* Main outer shell */}
      <rect
        x="11"
        y="29"
        width="12"
        height="23"
        rx="6"
        fill="#C9525C"
        stroke="#241A1C"
        strokeWidth="2"
      />
      {/* Bevel highlight */}
      <path
        d="M13 32 C13 30, 15 30, 15 32 L15 49 C15 51, 13 51, 13 49 Z"
        fill="#E0858F"
      />
    </g>

    {/* Right Earcup */}
    <g>
      {/* Top hinge connector pin */}
      <rect x="45" y="27" width="4" height="3" fill="#241A1C" rx="1" />
      {/* Main outer shell */}
      <rect
        x="41"
        y="29"
        width="12"
        height="23"
        rx="6"
        fill="#C9525C"
        stroke="#241A1C"
        strokeWidth="2"
      />
      {/* Bevel highlight */}
      <path
        d="M51 32 C51 30, 49 30, 49 32 L49 49 C49 51, 51 51, 51 49 Z"
        fill="#E0858F"
      />
    </g>
  </svg>
);

/**
 * 4. SEIYU (声優) - Retro Microphone with Speech Bubble
 * Capsule microphone on desktop stand with horizontal grille slits and
 * coral speech bubble containing three dots '...' matching mockup.
 */
export const SeiyuIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Microphone Stand Base */}
    <ellipse cx="28" cy="56" rx="9" ry="3.5" fill="#241A1C" />
    {/* Vertical Stem */}
    <line x1="28" y1="46" x2="28" y2="54" stroke="#241A1C" strokeWidth="2.5" strokeLinecap="round" />

    {/* U-Shaped Cradle */}
    <path
      d="M19 32 C19 46, 37 46, 37 32"
      fill="none"
      stroke="#241A1C"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Capsule Body */}
    <rect
      x="21.5"
      y="16"
      width="13"
      height="25"
      rx="6.5"
      fill="#C9525C"
      stroke="#241A1C"
      strokeWidth="2"
    />

    {/* Horizontal Grille Mesh Lines */}
    <line x1="24" y1="22" x2="32" y2="22" stroke="#241A1C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="23" y1="27" x2="33" y2="27" stroke="#241A1C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="23" y1="32" x2="33" y2="32" stroke="#241A1C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="24" y1="37" x2="32" y2="37" stroke="#241A1C" strokeWidth="1.8" strokeLinecap="round" />

    {/* Top Right Speech Bubble with Three Dots */}
    <ellipse cx="46" cy="18" rx="11" ry="8" fill="#E0858F" stroke="#241A1C" strokeWidth="1.8" />
    <path
      d="M38 23 L35 27 L41 24 Z"
      fill="#E0858F"
      stroke="#241A1C"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="41.5" cy="18" r="1.3" fill="#241A1C" />
    <circle cx="46" cy="18" r="1.3" fill="#241A1C" />
    <circle cx="50.5" cy="18" r="1.3" fill="#241A1C" />
  </svg>
);

/**
 * 5. RODOKU (朗読) - Open Book with Speaker Waves
 * Open book with 4 horizontal text lines per page, crimson cover back,
 * and small speaker emitting sound waves above the spine.
 */
export const RodokuIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Open Book Back Cover (Crimson rim) */}
    <path
      d="M13 28 L32 33 L51 28 L51 49 C45 52, 38 52, 32 50 C26 52, 19 52, 13 49 Z"
      fill="#9E2A36"
      stroke="#241A1C"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Left Open Page (White) */}
    <path
      d="M16 27 C22 29, 27 29, 32 31 L32 48 C27 46, 22 46, 16 44 Z"
      fill="#FFFFFF"
      stroke="#241A1C"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Right Open Page (White) */}
    <path
      d="M48 27 C42 29, 37 29, 32 31 L32 48 C37 46, 42 46, 48 44 Z"
      fill="#FFFFFF"
      stroke="#241A1C"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Text lines on left page */}
    <line x1="19" y1="32" x2="29" y2="34" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="19" y1="36" x2="29" y2="38" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="19" y1="40" x2="28" y2="42" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />

    {/* Text lines on right page */}
    <line x1="35" y1="34" x2="45" y2="32" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="35" y1="38" x2="45" y2="36" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="36" y1="42" x2="45" y2="40" stroke="#241A1C" strokeWidth="1.4" strokeLinecap="round" />

    {/* Speaker with sound waves floating above book */}
    <path
      d="M26 15 L29 15 L33 11 L33 23 L29 19 L26 19 Z"
      fill="#9E2A36"
      stroke="#241A1C"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M36 14 C37.5 15.5, 37.5 18.5, 36 20"
      stroke="#241A1C"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M39 12 C41.5 14.5, 41.5 19.5, 39 22"
      stroke="#241A1C"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * 6. CERDAS CERMAT (知識クイズ) - Student Buzzing with Question Mark Speech Bubble
 * Student silhouette raising hand in crimson with dark outline, and round
 * speech bubble above with a bold '?' question mark.
 */
export const CerdasCermatIcon: React.FC<IconProps> = ({ size = 42, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    {...props}
  >
    {/* Student Head */}
    <circle cx="26" cy="38" r="6" fill="#C9525C" stroke="#241A1C" strokeWidth="2" />

    {/* Student Torso & Raised Arm */}
    <path
      d="M15 54 C15 46, 21 44, 26 44 C28.5 44, 30.5 44.5, 32 45 L41 41 C42.5 40.5, 44 42, 43 43.5 L36 49 C35.5 50.5, 35 52, 35 54 Z"
      fill="#C9525C"
      stroke="#241A1C"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Round Speech Bubble at Top-Right */}
    <circle cx="44" cy="20" r="12" fill="#C9525C" stroke="#241A1C" strokeWidth="2" />
    <path
      d="M36 28 L33 32 L39 29 Z"
      fill="#C9525C"
      stroke="#241A1C"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Question mark '?' inside bubble */}
    <text
      x="44"
      y="25"
      textAnchor="middle"
      fontSize="16"
      fontWeight="900"
      fontFamily="sans-serif"
      fill="#241A1C"
    >
      ?
    </text>
  </svg>
);

/**
 * Crimson Finish Flag for Countdown Card
 */
export const CrimsonFinishFlagIcon: React.FC<IconProps> = ({ size = 38, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Flagpole */}
    <line x1="14" y1="6" x2="14" y2="42" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
    {/* Finial (pole topper) */}
    <circle cx="14" cy="5.5" r="2.5" fill="#B91C1C" />
    {/* Base stand */}
    <path d="M9 42 H19" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Waving Finish Flag */}
    <path
      d="M14 8 C21 6 25 12 34 9 C37 8 38 8 38 8 L36 24 C31 26 25 20 18 23 C16 24 14 25 14 25 Z"
      fill="#B91C1C"
      stroke="#7F1D1D"
      strokeWidth="1.5"
    />
    {/* Golden Sun Accent on Flag */}
    <circle cx="25" cy="16" r="4" fill="#FAF7F2" opacity="0.9" />
  </svg>
);

/**
 * Torii & Sakura Background Pattern Watermarks
 */
export const JapaneseWatermarkPattern = () => (
  <svg
    className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-[0.065] select-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="torii-sakura-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
      {/* 1. Torii Gate ⛩ */}
      <g transform="translate(20, 20) scale(0.65)" fill="#8B1E1E">
        <path d="M0 6 C12 3 28 3 40 6 L40 9 C28 6 12 6 0 9 Z" />
        <rect x="4" y="11" width="32" height="3" />
        <rect x="8" y="14" width="3" height="24" />
        <rect x="29" y="14" width="3" height="24" />
        <rect x="5" y="19" width="30" height="2.5" />
        <rect x="18.5" y="11" width="3" height="8" />
      </g>

      {/* 2. Sakura Cherry Blossom Flower 🌸 */}
      <g transform="translate(85, 75) scale(0.55)" fill="#B91C1C">
        <ellipse cx="20" cy="12" rx="4" ry="7" />
        <ellipse cx="28" cy="18" rx="7" ry="4" transform="rotate(30 28 18)" />
        <ellipse cx="25" cy="27" rx="7" ry="4" transform="rotate(105 25 27)" />
        <ellipse cx="15" cy="27" rx="7" ry="4" transform="rotate(75 15 27)" />
        <ellipse cx="12" cy="18" rx="7" ry="4" transform="rotate(-30 12 18)" />
        <circle cx="20" cy="20" r="3" fill="#FAF7F2" />
        <circle cx="20" cy="20" r="1.5" fill="#8B1E1E" />
      </g>

      {/* 3. Small Petals floating */}
      <path d="M75 25 Q77 22 80 25 Q78 28 75 25 Z" fill="#8B1E1E" transform="rotate(20 75 25)" />
      <path d="M25 90 Q27 87 30 90 Q28 93 25 90 Z" fill="#8B1E1E" transform="rotate(-35 25 90)" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#torii-sakura-pattern)" />
  </svg>
);
