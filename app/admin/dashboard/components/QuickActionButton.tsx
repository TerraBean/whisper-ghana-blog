import React from 'react';
import Link from 'next/link';

interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
  link: string;
  bgColor: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon,
  link,
  bgColor,
}) => {
  return (
    <Link 
      href={link} 
      className={`flex items-center justify-center ${bgColor} text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
    >
      <span className="mr-2">{icon}</span>
      <span className="font-medium">{title}</span>
    </Link>
  );
};

export default QuickActionButton;