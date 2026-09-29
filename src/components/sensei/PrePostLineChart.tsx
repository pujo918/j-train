'use client';

import React from 'react';

interface PrePostLineChartProps {
  scores: { label: string; score: number }[];
  height?: number;
}

export const PrePostLineChart: React.FC<PrePostLineChartProps> = ({
  scores,
  height = 140,
}) => {
  if (!scores || scores.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-sumi-muted italic bg-washi rounded-xl border border-sumi-border">
        Belum ada riwayat pre-test vs post-test
      </div>
    );
  }

  const width = 340;
  const paddingLeft = 32;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 26;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const minScore = 0;
  const maxScore = 100;

  // Calculate coordinates
  const points = scores.map((pt, idx) => {
    const x = paddingLeft + (idx / Math.max(1, scores.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((pt.score - minScore) / (maxScore - minScore)) * innerHeight;
    return { ...pt, x, y };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Area Path for Gradient
  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${paddingTop + innerHeight}
    L ${points[0].x} ${paddingTop + innerHeight}
    Z
  `;

  // Y-axis ticks: 0, 20, 40, 60, 80, 100
  const yTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="crimsonAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Y-axis Grid Lines and Ticks */}
        {yTicks.map((val) => {
          const y = paddingTop + innerHeight - ((val - minScore) / (maxScore - minScore)) * innerHeight;
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={val === 80 ? '#FCA5A5' : '#E5E7EB'}
                strokeDasharray={val === 80 ? '3 3' : 'none'}
                strokeWidth={val === 80 ? 1 : 0.7}
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                textAnchor="end"
                fill={val === 80 ? '#B91C1C' : '#9CA3AF'}
                fontSize="8"
                fontWeight={val === 80 ? 'bold' : 'normal'}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#crimsonAreaGradient)" />

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="#B91C1C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((pt, idx) => (
          <g key={idx} className="transition-transform hover:scale-110">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#FFFFFF"
              stroke="#B91C1C"
              strokeWidth="2.5"
            />
            {/* Score Bubble on last point */}
            {idx === points.length - 1 && (
              <g>
                <rect
                  x={pt.x - 14}
                  y={pt.y - 18}
                  width="28"
                  height="13"
                  rx="3"
                  fill="#B91C1C"
                />
                <text
                  x={pt.x}
                  y={pt.y - 9}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.score}
                </text>
              </g>
            )}
            {/* Label below */}
            <text
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              fill="#4B5563"
              fontSize="8"
              fontWeight={idx === 0 || idx === points.length - 1 ? 'bold' : '500'}
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
