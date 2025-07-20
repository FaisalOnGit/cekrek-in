import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ReportsChart = () => {
  const data = [
    { month: 'Jan', value: 4 },
    { month: 'Feb', value: 3 },
    { month: 'Mar', value: 6 },
    { month: 'Apr', value: 4 },
    { month: 'May', value: 5 },
    { month: 'June', value: 7 },
    { month: 'Ags', value: 3 },
    { month: 'Sept', value: 5 },
    { month: 'Oct', value: 6 },
    { month: 'Nov', value: 8 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Reports Performance</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          {[10, 8, 6, 4, 2, 0].map(val => (
            <span key={val}>{val}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Line chart */}
            <polyline
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((d, i) => 
                `${(i * 400) / (data.length - 1)},${200 - (d.value / maxValue) * 160}`
              ).join(' ')}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i * 400) / (data.length - 1)}
                cy={200 - (d.value / maxValue) * 160}
                r="4"
                fill="#8B5CF6"
                className="drop-shadow-sm"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#8B5CF6'}} />
                <stop offset="100%" style={{stopColor: '#EC4899'}} />
              </linearGradient>
            </defs>
          </svg>

          {/* Sale indicator */}
          <div className="absolute top-16 left-48 bg-gray-800 text-white px-3 py-1 rounded text-xs">
            Sale<br />2,678
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-4 ml-8 text-xs text-gray-400">
          {data.map(d => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsChart;