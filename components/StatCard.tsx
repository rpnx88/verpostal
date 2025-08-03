import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-slate-800/50 p-5 rounded-xl shadow-lg flex items-center gap-5 transition-transform duration-300 hover:transform hover:-translate-y-1">
      <div className="flex-shrink-0 bg-slate-700/50 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-white truncate" title={value}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
