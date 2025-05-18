import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Scroll } from 'lucide-react';
import { getRankName, createAvatarUrl } from '../../utils/helpers';
import { CLASS_EMBLEMS } from '../../utils/constants';

const AdventurerCard = ({ adventurer, index }) => {
  const rankName = getRankName(adventurer.primary_score);
  
  // Get the top skills (score >= 3)
  const topSkills = [];
  Object.entries(adventurer.skills).forEach(([category, skills]) => {
    Object.entries(skills).forEach(([skillName, skill]) => {
      if (skill.score >= 3) {
        topSkills.push({ name: skillName, score: skill.score, color: skill.color });
      }
    });
  });
  
  // Sort by score descending and take top 3
  const displaySkills = topSkills
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  return (
    <motion.div
      className="card hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/adventurer/${encodeURIComponent(adventurer.name)}`} className="block">
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-dark-700 to-dark-800"></div>
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-600">
              <img 
                src={createAvatarUrl(adventurer.name)} 
                alt={adventurer.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-10 pb-4 px-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{adventurer.name}</h3>
              <div className="flex items-center text-sm text-dark-400 mt-1">
                <span className="mr-1">{CLASS_EMBLEMS[adventurer.role] || '🧩'}</span>
                <span>{adventurer.role}</span>
              </div>
            </div>
            <div className="bg-dark-700 rounded-md px-2 py-1 text-xs font-medium">
              Rank {adventurer.primary_score?.toFixed(1)}
            </div>
          </div>
          
          <div className="text-xs text-dark-400 mt-1">
            {rankName}
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-dark-400 mb-1">Primary Mastery</div>
            <div className="progress-bar">
              <div 
                className="progress-fill bg-primary-500" 
                style={{ width: `${(adventurer.primary_area_score / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {displaySkills.map(skill => (
              <div 
                key={skill.name}
                className="skill-badge"
                style={{ backgroundColor: `${skill.color}20`, color: skill.color }}
              >
                {skill.name.length > 12 ? `${skill.name.substring(0, 10)}...` : skill.name}
              </div>
            ))}
            
            {displaySkills.length === 0 && (
              <div className="text-xs text-dark-500 italic">
                No notable skills yet
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-primary-400 hover:text-primary-300">
              <Scroll size={12} className="mr-1" />
              <span>View Details</span>
            </div>
            
            <ArrowRight size={16} className="text-primary-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AdventurerCard;