import React, { useState, useMemo } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import AdventurerCard from './AdventurerCard';
import { useAdventurers } from '../../contexts/AdventurerContext';

/**
 * Grid display of adventurers with filtering and sorting
 */
const GuildGrid = () => {
  const { adventurers } = useAdventurers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'name', 'role'
  
  // Get unique roles for filtering
  const roles = useMemo(() => {
    return [...new Set(adventurers
      .filter(adv => adv.role !== 'Guild' && adv.role !== 'Quest Board')
      .map(adv => adv.role)
      .filter(Boolean)
    )];
  }, [adventurers]);
  
  // Filter and sort adventurers
  const filteredAdventurers = useMemo(() => {
    return adventurers
      .filter(adv => adv.role !== 'Guild' && adv.role !== 'Quest Board') // Exclude special entries
      .filter(adv => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = adv.name.toLowerCase().includes(searchLower);
        
        // Role filter
        const roleMatch = roleFilter === '' || adv.role === roleFilter;
        
        return nameMatch && roleMatch;
      })
      .sort((a, b) => {
        // Sort
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'role':
            return a.role.localeCompare(b.role);
          case 'rank':
          default:
            return b.primary_score - a.primary_score;
        }
      });
  }, [adventurers, searchTerm, roleFilter, sortBy]);
  
  return (
    <div>
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
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input pl-10 appearance-none pr-8"
              >
                <option value="">All Classes</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-400">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <SortDesc size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pl-10 appearance-none pr-8"
              >
                <option value="rank">By Rank</option>
                <option value="name">By Name</option>
                <option value="role">By Class</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-400">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdventurers.map((adventurer, index) => (
          <AdventurerCard 
            key={adventurer.name} 
            adventurer={adventurer} 
            index={index}
          />
        ))}
        
        {filteredAdventurers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medieval text-primary-300 mb-2">No Adventurers Found</h3>
            <p className="text-dark-400">Try adjusting your search or filters to find adventurers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuildGrid;