
import React from 'react';
import { Hash } from 'lucide-react';

type NewsSource = 'reddit' | 'reddit2';

interface SourceTabsProps {
  activeSource: NewsSource;
  onSourceChange: (source: NewsSource) => void;
}

export const SourceTabs: React.FC<SourceTabsProps> = ({ 
  activeSource, 
  onSourceChange 
}) => {
  const tabs = [
    {
      id: 'reddit' as NewsSource,
      label: '[REDDIT_FEEDS_1]',
      icon: Hash
    },
    {
      id: 'reddit2' as NewsSource,
      label: '[REDDIT_FEEDS_2]',
      icon: Hash
    }
  ];

  const handleKeyDown = (event: React.KeyboardEvent, source: NewsSource) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSourceChange(source);
    }
  };

  return (
    <div className="w-full px-4 py-3">
      <div 
        className="w-full flex space-x-4"
        role="tablist"
        aria-label="News source navigation"
      >
        {tabs.map((tab) => {
          const isActive = activeSource === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`
                flex items-center gap-2 px-4 py-2 border rounded-none font-mono text-sm
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400
                ${isActive 
                  ? 'bg-green-900/20 text-green-300 border-green-300 shadow-green-400/20 shadow-lg' 
                  : 'bg-black text-green-400 border-green-500 hover:border-green-300 hover:bg-green-900/10'
                }
              `}
              onClick={() => onSourceChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
            >
              <Icon className="w-4 h-4" />
              <div className="font-bold">{tab.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
