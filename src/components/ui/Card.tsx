import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  as?: React.ElementType;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  as: Component = 'div',
}) => {
  const hoverClass = hover
    ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200'
    : '';
  
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <Component
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>{children}</div>
  );
};

export default Card;