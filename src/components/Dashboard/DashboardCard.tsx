import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, link }) => {
  const cardContent = (
    <div className={`card border-l-4 ${color} hover:shadow-lg transition-shadow`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-opacity-20 mr-4" style={{ backgroundColor: `var(--${color.split('-')[0]})` }}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link} className="block">{cardContent}</Link>;
  }

  return cardContent;
};

export default DashboardCard;