import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SKILL_LEVELS } from '../../utils/constants';

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
          <motion.div 
            key={skillName}
            className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-3 border-b border-dark-700 flex justify-between items-center" style={{ backgroundColor: `${skill.color}20` }}>
              <div className="font-medium text-sm">{skillName}</div>
              <div 
                className={`gem ${skill.score === 5 ? 'animate-glow' : ''}`}
                style={{ backgroundColor: skill.color }}
              >
                {skill.score}
              </div>
            </div>
            
            <div className="p-3">
              <div className="mb-2">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(skill.score / 5) * 100}%`,
                      backgroundColor: skill.color
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="text-dark-400">
                  {SKILL_LEVELS[skill.score]?.title || "Unknown"}
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
        ))}
      </div>
    </motion.div>
  );
};

export default SkillTree;