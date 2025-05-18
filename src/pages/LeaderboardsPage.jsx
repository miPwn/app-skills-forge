import React, { useState, useMemo } from 'react';
import { Medal, Trophy, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CLASS_EMBLEMS } from '../utils/constants';
import { useAdventurers } from '../contexts/AdventurerContext';
import { createAvatarUrl } from '../utils/avatarHelpers';
import ErrorBoundary from '../components/shared/ErrorBoundary';

/**
 * Leaderboards page component
 */
const LeaderboardsPage = () => {
  const { adventurers } = useAdventurers();
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get unique roles
  const roles = useMemo(() => {
    return ['All', ...new Set(adventurers
      .filter(adv => adv.role !== 'Guild' && adv.role !== 'Quest Board')
      .map(adv => adv.role)
    )];
  }, [adventurers]);
  
  // Filter out special entries and sort by primary score
  const filteredAdventurers = useMemo(() => {
    return adventurers
      .filter(adv => 
        adv.role !== 'Guild' && 
        adv.role !== 'Quest Board' &&
        (selectedRole === 'All' || adv.role === selectedRole) &&
        adv.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.primary_score - a.primary_score);
  }, [adventurers, selectedRole, searchTerm]);
  
  return (
    <div>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-block bg-dark-800 rounded-full px-4 py-1 text-primary-400 text-sm mb-2">
          Guild Rankings
        </div>
        <h1 className="text-3xl md:text-4xl font-medieval text-primary-300 mb-2">Global Leaderboards</h1>
        <p className="text-dark-300 max-w-2xl mx-auto">
          Witness the mightiest adventurers in the realm! These rankings showcase those who have
          achieved greatness through their mastery of skills.
        </p>
      </motion.div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search adventurers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input pl-10 appearance-none pr-8"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role === 'All' ? 'All Classes' : role}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-400">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <ErrorBoundary>
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-header">
            <h2 className="font-medieval flex items-center">
              <Trophy size={20} className="mr-2 text-yellow-400" />
              <span>Global Rankings</span>
            </h2>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Adventurer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Primary
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Secondary
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredAdventurers.map((adv, index) => (
                  <motion.tr 
                    key={adv.id}
                    className={`${index % 2 === 0 ? 'bg-dark-850' : ''} hover:bg-dark-750`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-700">
                        {index === 0 ? (
                          <Trophy size={16} className="text-yellow-400" />
                        ) : index === 1 ? (
                          <Medal size={16} className="text-gray-300" />
                        ) : index === 2 ? (
                          <Medal size={16} className="text-amber-600" />
                        ) : (
                          <span className="text-sm text-dark-400">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link 
                        to={`/adventurer/${encodeURIComponent(adv.id)}`}
                        className="flex items-center group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dark-600 mr-3">
                          <img 
                            src={adv.avatarUrl || createAvatarUrl(adv.name)}
                            alt={adv.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = createAvatarUrl(adv.name);
                            }}
                          />
                        </div>
                        <span className="font-medium group-hover:text-primary-400 transition-colors">
                          {adv.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{CLASS_EMBLEMS[adv.role] || '🧩'}</span>
                        <span className="text-sm">{adv.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900 text-primary-300">
                        {adv.primary_area_score.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-900 text-secondary-300">
                        {adv.secondary_area_score.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-medium">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-900 text-accent-300">
                        {adv.primary_score.toFixed(1)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                
                {filteredAdventurers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-dark-400">
                      <Trophy size={32} className="mx-auto mb-4 text-dark-500" />
                      <p className="font-medieval text-lg mb-1">No Adventurers Found</p>
                      <p className="text-sm">Adjust your search or filters to find adventurers.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </ErrorBoundary>
      
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Medal size={24} className="text-dark-500 mx-auto mb-4" />
        <p className="text-dark-400 max-w-lg mx-auto text-sm italic">
          "Glory is not in never falling, but in rising every time we fall."
          <br />— Ancient Guild Wisdom
        </p>
      </motion.div>
    </div>
  );
};

export default LeaderboardsPage;