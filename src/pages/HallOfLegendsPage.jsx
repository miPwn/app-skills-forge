import React, { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import ExpertPanel from '../components/legends/ExpertPanel';
import { useAdventurers } from '../contexts/AdventurerContext';
import ErrorBoundary from '../components/shared/ErrorBoundary';

/**
 * Hall of Legends page component
 */
const HallOfLegendsPage = () => {
  const { adventurers } = useAdventurers();
  const [selectedCategory, setSelectedCategory] = useState('Fundamental');
  
  // Get unique categories from the first real adventurer
  const categories = useMemo(() => {
    const firstRealAdventurer = adventurers.find(
      adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
    );
    
    return firstRealAdventurer ? Object.keys(firstRealAdventurer.skills) : [];
  }, [adventurers]);
  
  return (
    <div>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-block bg-dark-800 rounded-full px-4 py-1 text-secondary-400 text-sm mb-2">
          Guild Recognition
        </div>
        <h1 className="text-3xl md:text-4xl font-medieval text-secondary-300 mb-2">Hall of Legends</h1>
        <p className="text-dark-300 max-w-2xl mx-auto">
          Behold the most skilled adventurers in the guild! Here we honor those who have
          achieved mastery in their chosen disciplines.
        </p>
      </motion.div>
      
      <ErrorBoundary>
        <div className="mb-8">
          <h2 className="text-2xl font-medieval text-center mb-6 flex items-center justify-center">
            <Trophy size={24} className="text-yellow-400 mr-2" />
            <span>Experts & Gurus</span>
          </h2>
          
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm ${
                  selectedCategory === category
                    ? 'bg-secondary-600 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <ExpertPanel 
            category={selectedCategory}
          />
        </div>
      </ErrorBoundary>
      
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <p className="text-dark-400 max-w-lg mx-auto text-sm italic">
          "Fame is but a breath of wind that blows now here, now there, and changes name because it changes quarter."
          <br />— Guild Proverb
        </p>
      </motion.div>
    </div>
  );
};

export default HallOfLegendsPage;