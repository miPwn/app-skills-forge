import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Scroll } from 'lucide-react';
import { getRankName } from '../../utils/rankHelpers';
import { CLASS_EMBLEMS } from '../../utils/constants';
import Avatar from '../shared/Avatar';
import SkillBadge from '../shared/SkillBadge';
import ProgressBar from '../shared/ProgressBar';
import useAdventurerSkills from '../../hooks/useAdventurerSkills';

/**
 * AdventurerCard component for the guild grid view
 */
const AdventurerCard = ({ adventurer, index }) => {
  const rankName = getRankName(adventurer.primary_score);
  const displaySkills = useAdventurerSkills(adventurer, 3, 3);
  
  return (
    <motion.div
      className="card hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/adventurer/${encodeURIComponent(adventurer.id)}`} className="block">
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-dark-700 to-dark-800"></div>
          <div className="absolute -bottom-8 left-4">
            <Avatar 
              name={adventurer.name} 
              avatarUrl={adventurer.avatarUrl}
              size="sm" 
              className="border-primary-600" 
            />
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
            <ProgressBar
              value={adventurer.primary_area_score}
              maxValue={5}
              label="Primary Mastery"
              color="skill"
              showValue={true}
            />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {displaySkills.map(skill => (
              <SkillBadge key={skill.name} skill={skill} truncate={true} />
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