import React from 'react';
import { SKILL_LEVELS } from '../../utils/constants';

/**
 * Reusable skill badge component with improved contrast
 */
const SkillBadge = React.memo(({ skill, truncate = true }) => {
  const displayName = truncate && skill.name.length > 12
    ? `${skill.name.substring(0, 10)}...`
    : skill.name;
  
  // Get color based on skill level
  const getSkillStyle = () => {
    const score = skill.score || 0;
    const roundedScore = Math.round(score);
    const skillLevel = SKILL_LEVELS[roundedScore] || SKILL_LEVELS[0];
    
    // Determine text color based on background color brightness
    const getTextColor = (bgColor) => {
      // For darker colors (0, 4, 5), use white text
      if (roundedScore === 0 || roundedScore >= 4) {
        return '#FFFFFF';
      }
      // For lighter colors (1, 2, 3), use dark text
      return '#333333';
    };
    
    return {
      backgroundColor: skillLevel.color,
      color: getTextColor(skillLevel.color)
    };
  };
  
  const style = getSkillStyle();
  
  return (
    <div
      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
      style={style}
    >
      <span>{displayName}</span>
      {skill.score !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black bg-opacity-20 text-xs font-bold">
          {skill.score.toFixed(1)}
        </span>
      )}
    </div>
  );
});

export default SkillBadge;