import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const AnalyticsChart = () => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percentage = 80;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#f3f4f6"
              strokeWidth="16"
              fill="none"
            />
            
            {/* Progress circle - Sale */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#3B82F6"
              strokeWidth="16"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Progress circle - Distribute */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#F59E0B"
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (20 / 100) * circumference}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              transform="rotate(288 100 100)"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">80%</span>
            <span className="text-sm text-gray-600">Transactions</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Sale</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Distribute</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;