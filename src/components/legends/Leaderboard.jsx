import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLASS_EMBLEMS } from '../../utils/constants';

const Leaderboard = ({ adventurers, role }) => {
  // Filter adventurers by role and sort by primary score
  const filteredAdventurers = adventurers
    .filter(adv => 
      adv.role === role && 
      adv.role !== 'Guild' && 
      adv.role !== 'Quest Board'
    )
    .sort((a, b) => b.primary_score - a.primary_score)
    .slice(0, 5);
  
  if (filteredAdventurers.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-header">
        <h3 className="font-medium flex items-center">
          <div className="text-xl mr-2">{CLASS_EMBLEMS[role] || '🧩'}</div>
          <span>{role} Masters</span>
        </h3>
      </div>
      
      <ul className="divide-y divide-dark-700">
        {filteredAdventurers.map((adv, index) => (
          <li key={adv.name} className={`relative ${index === 0 ? 'bg-dark-700' : ''}`}>
            <Link 
              to={`/adventurer/${encodeURIComponent(adv.name)}`}
              className="flex items-center p-4 hover:bg-dark-750 transition-colors"
            >
              {index === 0 && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-20 border-r-20 border-t-yellow-500 border-r-transparent"></div>
              )}
              
              <div className="mr-3 flex items-center justify-center">
                {index === 0 ? (
                  <Trophy size={24} className="text-yellow-400" />
                ) : index === 1 ? (
                  <Medal size={20} className="text-gray-300" />
                ) : index === 2 ? (
                  <Medal size={18} className="text-amber-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{adv.name}</div>
                <div className="text-xs text-dark-400">
                  {adv.primary_score >= 4 ? (
                    <div className="flex items-center">
                      <Award size={12} className="mr-1 text-yellow-400" />
                      <span>Legendary</span>
                    </div>
                  ) : (
                    <span>Rank {adv.primary_score.toFixed(1)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="text-center">
                  <div className="text-xs text-dark-400">Primary</div>
                  <div className="font-mono font-medium">{adv.primary_area_score.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-dark-400">Secondary</div>
                  <div className="font-mono font-medium">{adv.secondary_area_score.toFixed(1)}</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Leaderboard;