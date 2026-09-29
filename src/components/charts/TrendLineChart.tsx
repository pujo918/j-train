'use client';

import React from 'react';

interface TrendItem {
  label: string;
  score: number;
  date?: string;
}

interface TrendLineChartProps {
  data: TrendItem[];
  height?: number;
  className?: string;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  height = 140,
  className = "",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-28 flex items-center justify-center text-xs text-sumi-muted italic bg-washi rounded-xl border border-sumi-border">
        Belum ada riwayat skor latihan
      </div>
    );
  }

  const width = 450;
  const paddingX = 40;
  const paddingY = 24;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const minScore = 0;
  const maxScore = 100;

  // Single item fallback
  const safeData = data.length === 1 
    ? [{ label: 'Mulai', score: data[0].score, date: '' }, data[0]] 
    : data;

  const pts = safeData.map((item, idx) => {
    const x = paddingX + (idx / (safeData.length - 1)) * innerWidth;
    const y = paddingY + innerHeight - ((item.score - minScore) / (maxScore - minScore)) * innerHeight;
    return { ...item, x, y };
  });

  const linePath = pts.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Horizontal Threshold Guideline (70 pts threshold) */}
        <line
          x1={paddingX}
          y1={paddingY + innerHeight - (70 / 100) * innerHeight}
          x2={width - paddingX}
          y2={paddingY + innerHeight - (70 / 100) * innerHeight}
          stroke="#FCA5A5"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text
          x={width - paddingX + 5}
          y={paddingY + innerHeight - (70 / 100) * innerHeight + 3}
          fill="#DC2626"
          fontSize="9"
          fontWeight="bold"
        >
          Min 70
        </text>

        {/* 100 pts top line */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <text
          x={paddingX - 25}
          y={paddingY + 3}
          fill="#9CA3AF"
          fontSize="9"
        >
          100
        </text>

        {/* Connecting Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#B91C1C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points & Labels */}
        {pts.map((pt, idx) => (
          <g key={idx} className="group">
            {/* Value Tag Bubble */}
            <rect
              x={pt.x - 14}
              y={pt.y - 20}
              width="28"
              height="15"
              rx="4"
              fill="#B91C1C"
            />
            <text
              x={pt.x}
              y={pt.y - 10}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
            >
              {pt.score}
            </text>

            {/* Dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#B91C1C"
              strokeWidth="2.5"
            />

            {/* Label below */}
            <text
              x={pt.x}
              y={height - 4}
              textAnchor="middle"
              fill="#4B5563"
              fontSize="9"
              fontWeight="600"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
