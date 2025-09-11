import React from 'react';
import { Heart, Star, FileText } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    {
      icon: Heart,
      label: 'Total Sales',
      value: '25,000,000',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Star,
      label: 'Customers',
      value: '2000+',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500'
    },
    {
      icon: FileText,
      label: 'Templates',
      value: '190+',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;