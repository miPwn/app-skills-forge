import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Save } from 'lucide-react';
import { SKILL_LEVELS } from '../../utils/constants';
import { getSkillColor } from '../../utils/helpers';

const SkillEditor = ({ adventurer, onSave }) => {
  const [editedSkills, setEditedSkills] = useState({...adventurer.skills});
  
  const handleSkillChange = (category, skillName, newScore) => {
    setEditedSkills(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skillName]: {
          score: newScore,
          color: getSkillColor(newScore)
        }
      }
    }));
  };
  
  const handleSave = () => {
    onSave({
      ...adventurer,
      skills: editedSkills
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medieval text-primary-300">Skill Editor</h3>
        
        <button 
          onClick={handleSave}
          className="btn btn-primary"
        >
          <Save size={16} className="mr-2" />
          <span>Save Changes</span>
        </button>
      </div>
      
      <div className="space-y-8">
        {Object.entries(editedSkills).map(([category, skills], categoryIndex) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            className="card"
          >
            <div className="card-header">
              <h4 className="font-medieval">{category}</h4>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(skills).map(([skillName, skill], skillIndex) => (
                  <div key={skillName} className="bg-dark-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skillName}</span>
                      <div 
                        className={`gem ${skill.score === 5 ? 'animate-glow' : ''}`}
                        style={{ backgroundColor: skill.color }}
                      >
                        {skill.score}
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={skill.score}
                        onChange={(e) => handleSkillChange(category, skillName, parseInt(e.target.value))}
                        className="w-full h-2 appearance-none rounded bg-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${skill.color}, ${skill.color})`,
                          backgroundSize: `${(skill.score / 5) * 100}% 100%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      
                      <div className="flex justify-between text-xs text-dark-400 mt-1">
                        <span>{SKILL_LEVELS[skill.score]?.title || "Unknown"}</span>
                        
                        {skill.score === 5 && (
                          <div className="flex items-center text-yellow-300">
                            <Zap size={12} className="mr-1" />
                            <span>Mastered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillEditor;