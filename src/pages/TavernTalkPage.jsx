import React, { useState, useEffect } from 'react';
import { Beer, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import SkillGapChart from '../components/tavern/SkillGapChart';
import QuestCard from '../components/tavern/QuestCard';
import { identifySkillGaps } from '../utils/helpers';

const TavernTalkPage = ({ adventurers }) => {
  const [selectedCategory, setSelectedCategory] = useState('Fundamental');
  const [skillAverages, setSkillAverages] = useState({});
  const [skillGaps, setSkillGaps] = useState({});
  
  useEffect(() => {
    // Calculate average skill scores
    const averages = {};
    const realAdventurers = adventurers.filter(
      adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
    );
    
    const skillSums = {};
    const skillCounts = {};
    
    // Gather all skills and their scores
    realAdventurers.forEach(adventurer => {
      Object.entries(adventurer.skills).forEach(([category, skills]) => {
        if (!averages[category]) {
          averages[category] = {};
          skillSums[category] = {};
          skillCounts[category] = {};
        }
        
        Object.entries(skills).forEach(([skillName, skill]) => {
          if (!skillSums[category][skillName]) {
            skillSums[category][skillName] = 0;
            skillCounts[category][skillName] = 0;
          }
          
          skillSums[category][skillName] += skill.score;
          skillCounts[category][skillName]++;
        });
      });
    });
    
    // Calculate averages
    Object.entries(skillSums).forEach(([category, skills]) => {
      Object.entries(skills).forEach(([skillName, sum]) => {
        const count = skillCounts[category][skillName];
        averages[category][skillName] = sum / count;
      });
    });
    
    setSkillAverages(averages);
    
    // Identify gaps (scores <= 1)
    const gaps = identifySkillGaps(adventurers);
    setSkillGaps(gaps);
  }, [adventurers]);
  
  // Get unique categories from the first real adventurer
  const firstRealAdventurer = adventurers.find(
    adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );
  
  const categories = firstRealAdventurer ? Object.keys(firstRealAdventurer.skills) : [];
  
  // Get skill gaps for the current category
  const currentGaps = skillGaps[selectedCategory] || {};
  const hasGaps = Object.keys(currentGaps).length > 0;
  
  return (
    <div>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-block bg-dark-800 rounded-full px-4 py-1 text-accent-400 text-sm mb-2">
          Guild Knowledge
        </div>
        <h1 className="text-3xl md:text-4xl font-medieval text-accent-300 mb-2">Tavern Talk</h1>
        <p className="text-dark-300 max-w-2xl mx-auto">
          Gather 'round, adventurers! Here we analyze our guild's collective wisdom,
          identify our knowledge gaps, and plan quests to strengthen our skills.
        </p>
      </motion.div>
      
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedCategory === category
                ? 'bg-accent-600 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            } transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-header">
              <h2 className="font-medieval flex items-center">
                <BarChart3 size={20} className="mr-2 text-accent-400" />
                <span>{selectedCategory} Skills Analysis</span>
              </h2>
            </div>
            
            <div className="p-4">
              <SkillGapChart 
                skillAverages={skillAverages} 
                selectedCategory={selectedCategory}
              />
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="card-header">
              <h2 className="font-medieval flex items-center">
                <Beer size={20} className="mr-2 text-accent-400" />
                <span>Quest Board</span>
              </h2>
            </div>
            
            <div className="p-4">
              {hasGaps ? (
                <div className="space-y-4">
                  {Object.entries(currentGaps).map(([skill, score]) => (
                    <QuestCard 
                      key={skill} 
                      skill={skill} 
                      score={score} 
                      category={selectedCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-lg font-medieval text-accent-300 mb-2">No Quests Needed!</h3>
                  <p className="text-dark-400 text-sm">
                    The guild has sufficient knowledge in all {selectedCategory} skills.
                    Check other categories for potential quests.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <p className="text-dark-400 max-w-lg mx-auto text-sm italic">
          "A guild that learns together, levels up together."
          <br />— Tavern Wisdom
        </p>
      </motion.div>
    </div>
  );
};

export default TavernTalkPage;