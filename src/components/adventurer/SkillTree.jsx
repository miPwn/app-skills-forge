import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SKILL_LEVELS } from '../../utils/constants';
import ProgressBar from '../shared/ProgressBar';

/**
 * SkillTree component for displaying a category of skills
 * 
 * @param {Object} props
 * @param {string} props.category - The skill category name
 * @param {Object} props.skills - Object containing skills in this category
 * @param {number} props.delay - Animation delay
 */
const SkillTree = ({ category, skills, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h3 className="text-lg font-medieval mb-3 flex items-center">
        <span className="text-primary-400 mr-2">{category}</span>
        <div className="flex-1 h-px bg-dark-700 ml-2"></div>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(skills).map(([skillName, skill], index) => (
          <SkillItem 
            key={skillName}
            name={skillName}
            skill={skill}
            index={index}
            delay={delay}
          />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Individual skill item component
 */
const SkillItem = React.memo(({ name, skill, index, delay }) => {
  // Get color based on skill level
  const getHeaderStyle = () => {
    const score = skill.score || 0;
    const roundedScore = Math.round(score);
    
    // Get color from SKILL_LEVELS
    const skillLevel = SKILL_LEVELS[roundedScore] || SKILL_LEVELS[0];
    const bgColor = skillLevel.color;
    
    // Return style with background color and appropriate opacity
    return {
      backgroundColor: bgColor,
      opacity: 0.9 // Slightly transparent for better UI
    };
  };
  
  // Function to determine text color based on background color
  const getTextColor = () => {
    const score = skill.score || 0;
    const roundedScore = Math.round(score);
    
    // For darker colors (0, 4, 5), use white text
    if (roundedScore === 0 || roundedScore >= 4) {
      return '#FFFFFF';
    }
    // For lighter colors (1, 2, 3), use dark text
    return '#333333';
  };
  
  const headerStyle = getHeaderStyle();
  const textColor = getTextColor();
  
  // Get gem color from SKILL_LEVELS
  const score = skill.score || 0;
  const roundedScore = Math.round(score);
  const gemColor = SKILL_LEVELS[roundedScore]?.color || SKILL_LEVELS[0].color;
  
  return (
    <motion.div 
      className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: delay + index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="p-3 border-b border-dark-700 flex justify-between items-center"
        style={headerStyle}
      >
        <div className="font-medium text-sm" style={{ color: textColor }}>{name}</div>
        <div
          className={`gem ${skill.score === 5 ? 'animate-glow' : ''}`}
          style={{
            backgroundColor: gemColor,
            color: textColor,
            fontWeight: 'bold',
            textShadow: '0px 0px 2px rgba(0,0,0,0.5)', /* Text shadow for better readability */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px',
            height: '24px'
          }}
        >
          {skill.score?.toFixed(1) || '0.0'}
        </div>
      </div>
      
      <div className="p-3">
        <div className="mb-2">
          <ProgressBar
            value={skill.score}
            maxValue={5}
            color="skill"
            showValue={true}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="text-dark-400">
            {SKILL_LEVELS[Math.round(skill.score)]?.title || "Unknown"}
          </div>
          
          {skill.score === 5 && (
            <div className="flex items-center text-yellow-300">
              <Zap size={12} className="mr-1" />
              <span>Mastered</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default SkillTree;