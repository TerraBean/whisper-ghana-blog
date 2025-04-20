// app/components/editor/ToolbarButton.tsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ToolbarButtonProps {
  isActive: () => boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  buttonClass: (active: boolean) => string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  isActive,
  onClick,
  title,
  icon,
  buttonClass,
}) => {
  const { theme } = useTheme();
  const active = isActive();
  
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={buttonClass(active)}
      data-active={active}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;