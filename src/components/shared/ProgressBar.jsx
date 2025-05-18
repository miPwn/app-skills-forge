import React from 'react';
import { SKILL_LEVELS } from '../../utils/constants';

/**
 * Reusable progress bar component with improved contrast
 */
const ProgressBar = React.memo(({
  value,
  maxValue = 5,
  color = 'skill',
  showValue = false,
  label = '',
  className = ''
}) => {
  const percentage = (value / maxValue) * 100;
  
  // Check if color is a hex color
  const isHexColor = color && color.startsWith('#');
  
  // Get color based on skill level for better visual feedback
  const getBarColor = () => {
    // If using skill-based coloring
    if (color === 'skill') {
      const roundedValue = Math.round(value);
      return SKILL_LEVELS[roundedValue]?.color || SKILL_LEVELS[0].color;
    }
    
    // If a hex color is provided
    if (isHexColor) {
      return color;
    }
    
    // For other named colors, return null to use class-based coloring
    return null;
  };
  
  // Determine text color based on value for better contrast
  const getTextColor = () => {
    if (color === 'skill') {
      const roundedValue = Math.round(value);
      // For darker colors (0, 4, 5), use white text
      if (roundedValue === 0 || roundedValue >= 4) {
        return 'text-white';
      }
      // For lighter colors (1, 2, 3), use dark text
      return 'text-dark-900';
    } else {
      // Default contrast logic for non-skill colors
      if (value >= 3.5) return 'text-white';
      return 'text-dark-900';
    }
  };
  
  const barColor = getBarColor();
  const textColorClass = getTextColor();
  
  return (
    <div className={`${className}`}>
      {(label || showValue) && (
        <div className="text-xs text-dark-400 mb-1 flex justify-between">
          {label && <span>{label}</span>}
          {showValue && <span>{value.toFixed(1)}/{maxValue}</span>}
        </div>
      )}
      
      <div className="h-6 bg-dark-700 rounded-md overflow-hidden relative">
        <div
          className={`h-full rounded-md transition-all duration-300 ${!barColor ? `bg-${color}-500` : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor || undefined
          }}
        ></div>
        
        {/* Value label inside the progress bar for better visibility */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${textColorClass}`} style={{ textShadow: '0px 0px 3px rgba(0,0,0,0.7)' }}>
              {value.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProgressBar;