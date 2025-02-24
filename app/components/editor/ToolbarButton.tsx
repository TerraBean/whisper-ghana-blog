// app/components/editor/ToolbarButton.tsx

import React from 'react';

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
  return (
    <button
      onClick={onClick}
      className={buttonClass(isActive())}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;