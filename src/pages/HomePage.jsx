import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, Users, Trophy, Beer, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="py-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-medieval text-primary-300 mb-2">GuildForge</h1>
          <p className="text-xl text-dark-300">The Adventurer's Skill Matrix</p>
        </motion.div>
        
        <motion.div
          className="mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-dark-200 mb-6">
            Welcome to GuildForge, where technical skills are transformed into an epic adventure. 
            Track your team's abilities, identify knowledge gaps, and embark on quests to 
            level up your guild's collective expertise.
          </p>
          
          <div className="flex justify-center">
            <Link to="/guild-hall" className="btn btn-primary px-8 py-3">
              <Swords size={20} className="mr-2" />
              <span>Begin Your Adventure</span>
            </Link>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link 
          to="/guild-hall" 
          className="card p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary-700"
        >
          <div className="bg-primary-900 bg-opacity-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-primary-300" />
          </div>
          <h2 className="text-lg font-medieval text-center mb-2 text-primary-400">Guild Hall</h2>
          <p className="text-sm text-dark-300 text-center">
            View all adventurers and their skills in an interactive matrix.
          </p>
        </Link>
        
        <Link 
          to="/hall-of-legends" 
          className="card p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary-700"
        >
          <div className="bg-secondary-900 bg-opacity-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-secondary-300" />
          </div>
          <h2 className="text-lg font-medieval text-center mb-2 text-secondary-400">Hall of Legends</h2>
          <p className="text-sm text-dark-300 text-center">
            Discover top experts and specialists in various skill categories.
          </p>
        </Link>
        
        <Link 
          to="/tavern-talk" 
          className="card p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary-700"
        >
          <div className="bg-accent-900 bg-opacity-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Beer size={32} className="text-accent-300" />
          </div>
          <h2 className="text-lg font-medieval text-center mb-2 text-accent-400">Tavern Talk</h2>
          <p className="text-sm text-dark-300 text-center">
            Analyze skill gaps and find opportunities for team improvement.
          </p>
        </Link>
        
        <Link 
          to="/command-center" 
          className="card p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary-700"
        >
          <div className="bg-danger-900 bg-opacity-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-danger-300" />
          </div>
          <h2 className="text-lg font-medieval text-center mb-2 text-danger-400">Command Center</h2>
          <p className="text-sm text-dark-300 text-center">
            Guild leaders can edit skills, lore, and track activity.
          </p>
        </Link>
      </motion.div>
      
      <motion.div
        className="mt-16 bg-dark-800 rounded-lg p-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-medieval text-center mb-6">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-medieval text-lg mb-2">Track Skills</h3>
            <p className="text-sm text-dark-300">
              Document your team's technical skills with a fantasy-themed interface.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="font-medieval text-lg mb-2">Accept Quests</h3>
            <p className="text-sm text-dark-300">
              Identify skill gaps and transform them into learning quests.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-medieval text-lg mb-2">Level Up</h3>
            <p className="text-sm text-dark-300">
              Improve skills, gain recognition, and watch your guild grow stronger.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;