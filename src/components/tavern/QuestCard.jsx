import React from 'react';
import { Scroll, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestCard = ({ skill, score, category }) => {
  // Generate a quest based on the skill and score
  const questTitle = `Master the arts of ${skill}`;
  
  const questDescriptions = {
    0: `The guild lacks knowledge in ${skill}. We need adventurers willing to embark on a journey to learn this skill from scratch.`,
    1: `Our guild has minimal exposure to ${skill}. We seek brave souls to deepen our understanding and bring back knowledge.`
  };
  
  const questDescription = questDescriptions[Math.min(Math.floor(score), 1)];
  
  const difficultyLabels = {
    0: 'Epic',
    1: 'Hard'
  };
  
  const difficulty = difficultyLabels[Math.min(Math.floor(score), 1)];
  
  const rewards = [
    'Guild Recognition',
    'Knowledge Sharing Bonus',
    'Skill Tree Advancement'
  ];
  
  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-gradient-to-r from-danger-900 to-danger-800 py-2 px-4 text-xs font-medium text-white flex justify-between items-center">
        <span>{category}</span>
        <span>Avg Score: {score.toFixed(1)}</span>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medieval text-lg text-primary-300">{questTitle}</h3>
          <div className="px-2 py-1 bg-danger-900 text-danger-200 text-xs rounded-full">
            {difficulty}
          </div>
        </div>
        
        <p className="text-sm text-dark-300 mb-4">
          {questDescription}
        </p>
        
        <div className="mb-4">
          <h4 className="text-xs uppercase text-dark-400 mb-2">Rewards</h4>
          <ul className="text-sm space-y-1">
            {rewards.map((reward, index) => (
              <li key={index} className="flex items-center">
                <span className="text-xs mr-2">•</span>
                <span className="text-dark-300">{reward}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button className="btn btn-danger w-full">
          <Scroll size={16} className="mr-2" />
          <span>Accept Quest</span>
          <ArrowRight size={16} className="ml-auto" />
        </button>
      </div>
    </motion.div>
  );
};

export default QuestCard;