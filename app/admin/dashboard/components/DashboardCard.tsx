import React from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  subtitle?: string;
  link?: string;
  isLoading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  subtitle,
  link,
  isLoading = false,
}) => {
  const CardContent = () => (
    <div className={`rounded-lg ${bgColor} p-6 shadow-md transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        <span className={`p-2 rounded-full ${bgColor} ${textColor}`}>{icon}</span>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </>
      )}
    </div>
  );

  return link ? (
    <Link href={link} className="block">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default DashboardCard;