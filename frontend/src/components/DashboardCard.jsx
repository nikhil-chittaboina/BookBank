import React from 'react';
import { BookOpen, TrendingUp, Users, DollarSign } from 'lucide-react';

const iconMap = {
  'Total Books': { Icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'Borrowed': { Icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  'Active Users': { Icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  'Total Fines': { Icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100' },
};

const DashboardCard = ({ title, value, unit = '' }) => {
  const { Icon, color, bg } = iconMap[title] || { Icon: BookOpen, color: 'text-gray-600', bg: 'bg-gray-100' };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`p-2 rounded-full ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900">
        {value}
        {unit && <span className="text-xl font-normal ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-400 mt-2">
        <span className={`${color} font-semibold`}>+5%</span> vs last month
      </div>
    </div>
  );
};

export default DashboardCard;