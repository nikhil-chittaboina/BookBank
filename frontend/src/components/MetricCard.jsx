import React from 'react';
import { BookOpen, Users, LayoutList, Clock } from 'lucide-react';

const iconMap = {
  'Books Available': { Icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Active Members': { Icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  'Categories': { Icon: LayoutList, color: 'text-purple-600', bg: 'bg-purple-50' },
  'Online Access': { Icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const MetricCard = ({ value, label }) => {
  const { Icon, color, bg } = iconMap[label] || { Icon: BookOpen, color: 'text-gray-600', bg: 'bg-gray-100' };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
      <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${bg}`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default MetricCard;