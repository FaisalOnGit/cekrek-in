import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const TopTemplates = () => {
  const templates = [
    {
      id: 1,
      name: 'Template 1',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
      bgColor: 'bg-purple-100'
    },
    {
      id: 2,
      name: 'Template 2',
      image: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Top Template</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-16 h-12 ${template.bgColor} rounded-lg flex items-center justify-center overflow-hidden`}>
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{template.name}</h4>
            </div>
            <div className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTemplates;