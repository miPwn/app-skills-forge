import React, { useState } from 'react';
import { Scroll, Table, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import GuildGrid from '../components/guild/GuildGrid';
import SkillMatrix from '../components/guild/SkillMatrix';
import { useAdventurers } from '../contexts/AdventurerContext';
import ErrorBoundary from '../components/shared/ErrorBoundary';

/**
 * Guild Hall page component
 */
const GuildHallPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'matrix'
  const { adventurers } = useAdventurers();
  
  return (
    <div>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-block bg-dark-800 rounded-full px-4 py-1 text-primary-400 text-sm mb-2">
          Guild Headquarters
        </div>
        <h1 className="text-3xl md:text-4xl font-medieval text-primary-300 mb-2">The Guild Hall</h1>
        <p className="text-dark-300 max-w-2xl mx-auto">
          Welcome to the Guild Hall, where you can view all adventurers and their skills.
          Explore individual profiles or analyze the skill matrix.
        </p>
      </motion.div>
      
      <div className="mb-6 flex justify-center">
        <div className="inline-flex bg-dark-800 rounded-md p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center px-4 py-2 rounded-md text-sm ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:text-white'
            } transition-colors`}
          >
            <Users size={16} className="mr-2" />
            <span>Adventurers</span>
          </button>
          
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center px-4 py-2 rounded-md text-sm ${
              viewMode === 'matrix'
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:text-white'
            } transition-colors`}
          >
            <Table size={16} className="mr-2" />
            <span>Skill Matrix</span>
          </button>
        </div>
      </div>
      
      <ErrorBoundary>
        {viewMode === 'grid' ? (
          <GuildGrid adventurers={adventurers} />
        ) : (
          <SkillMatrix adventurers={adventurers} />
        )}
      </ErrorBoundary>
      
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Scroll size={24} className="text-dark-500 mx-auto mb-4" />
        <p className="text-dark-400 max-w-lg mx-auto text-sm">
          The Guild Hall records are kept up to date by the Guild Scribes. 
          If you notice any discrepancies, please report them to the Command Center.
        </p>
      </motion.div>
    </div>
  );
};

export default GuildHallPage;