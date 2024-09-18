import React from 'react';

type BadgeProps = {
  content: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'|'right-side';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({
  content,
  position = 'top-right',
  size = 'medium',
  color = 'bg-red-500',
  children,
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2';
      case 'top-right':
        return 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
        return 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2';
      case 'bottom-right':
        return 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2';
      case 'right-side':
        return 'top-1/2 left-full ml-2 transform -translate-y-1/2 ';
      default:
        return 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'w-3 h-3 text-xs';
      case 'large':
        return 'w-6 h-6 text-sm';
      default:
        return 'w-4 h-4 text-xs';
    }
  };

  return (
    <div className="relative inline-block">
      {children}
      <span
        className={`absolute ${getPositionStyles()} ${getSizeStyles()} ${color} text-white rounded-full flex items-center justify-center`}
      >
        {content}
      </span>
    </div>
  );
};
