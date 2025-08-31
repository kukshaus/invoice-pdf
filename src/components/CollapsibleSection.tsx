'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isCollapsed,
  onToggle,
  children,
  actionButton,
  className = "p-6"
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <h2 
        className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {icon}
          {title}
        </div>
        <div className="flex items-center gap-2">
          {actionButton}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </div>
      </h2>
      
      {!isCollapsed && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};
