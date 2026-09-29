'use client';

import React from 'react';

interface PerformanceAreaChartProps {
  dataPoints?: number[];
  height?: number;
  className?: string;
}

export const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({
  dataPoints = [65, 72, 70, 85, 82, 90, 95],
  height = 100,
  className = "",
}) => {
  if (dataPoints.length === 0) return null;

  const width = 400;
  const maxVal = 100;
  const minVal = 40;

  // Convert points to SVG coordinates
  const pts = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 20) - 10;
    return { x, y, val };
  });

  // Create smooth bezier curve string
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  // Area path (closed at the bottom)
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Crimson to transparent gradient */}
          <linearGradient id="crimsonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#DC2626" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area */}
        <path d={areaD} fill="url(#crimsonGradient)" />

        {/* Smooth Top Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#B91C1C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points dots */}
        {pts.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#FFFFFF"
              stroke="#B91C1C"
              strokeWidth="2"
              className="transition-transform hover:scale-150"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
