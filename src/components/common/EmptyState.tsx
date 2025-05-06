import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon,
  actionText,
  onAction
}) => {
  return (
    <div className="card flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;