import React, { useState } from 'react';
import { Table } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SkillMatrix = ({ adventurers }) => {
  const [selectedCategory, setSelectedCategory] = useState('Fundamental');
  
  // Filter out special entries
  const filteredAdventurers = adventurers.filter(
    adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );
  
  // Get all skill categories
  const categories = Object.keys(filteredAdventurers[0]?.skills || {});
  
  // Get all unique skills for the selected category
  const uniqueSkills = new Set();
  filteredAdventurers.forEach(adv => {
    const categorySkills = adv.skills[selectedCategory];
    if (categorySkills) {
      Object.keys(categorySkills).forEach(skill => uniqueSkills.add(skill));
    }
  });
  
  const skills = Array.from(uniqueSkills);
  
  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medieval flex items-center">
            <Table size={18} className="mr-2 text-primary-400" />
            <span>Skill Matrix</span>
          </h3>
          
          <div className="text-sm text-dark-400">
            {skills.length} skills in {filteredAdventurers.length} adventurers
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedCategory === category
                  ? 'bg-primary-700 text-white'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-800">
              <th className="px-4 py-3 text-left text-dark-300 font-medium text-sm border-b border-dark-700">
                Adventurer
              </th>
              {skills.map(skill => (
                <th 
                  key={skill} 
                  className="px-2 py-3 text-center text-dark-300 font-medium text-sm border-b border-dark-700"
                  title={skill}
                >
                  <div className="w-20 truncate">{skill}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAdventurers.map((adv, index) => (
              <tr 
                key={adv.name} 
                className={`hover:bg-dark-750 ${index % 2 === 0 ? 'bg-dark-850' : ''}`}
              >
                <td className="px-4 py-3 border-b border-dark-700">
                  <Link 
                    to={`/adventurer/${encodeURIComponent(adv.name)}`}
                    className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {adv.name}
                  </Link>
                  <div className="text-xs text-dark-400">{adv.role}</div>
                </td>
                
                {skills.map(skill => {
                  const skillData = adv.skills[selectedCategory]?.[skill];
                  return (
                    <td 
                      key={skill} 
                      className="px-2 py-3 text-center border-b border-dark-700"
                    >
                      {skillData ? (
                        <div className="flex justify-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                            style={{ backgroundColor: skillData.color }}
                            title={`${skill}: ${skillData.score}`}
                          >
                            {skillData.score}
                          </div>
                        </div>
                      ) : (
                        <span className="text-dark-600">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-dark-700 text-center text-xs text-dark-500">
        <p>Skill scores range from 0 (never used) to 5 (guru)</p>
      </div>
    </motion.div>
  );
};

export default SkillMatrix;