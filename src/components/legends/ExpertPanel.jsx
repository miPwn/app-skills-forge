import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { findTopExperts } from '../../utils/helpers';

const ExpertPanel = ({ adventurers, category }) => {
  const experts = findTopExperts(adventurers);
  const categoryExperts = experts[category] || {};
  
  // Get skills with experts
  const skillsWithExperts = Object.keys(categoryExperts).filter(
    skill => categoryExperts[skill]?.length > 0
  );
  
  if (skillsWithExperts.length === 0) {
    return (
      <div className="card p-6 text-center">
        <Trophy size={32} className="text-dark-500 mx-auto mb-4" />
        <h3 className="text-lg font-medieval text-primary-300 mb-2">No Experts Found</h3>
        <p className="text-dark-400 text-sm">
          There are no adventurers who have achieved expert level (4+) in this category yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skillsWithExperts.map((skill, index) => (
        <motion.div 
          key={skill}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="card-header">
            <h3 className="font-medium flex items-center">
              <Trophy size={16} className="text-yellow-400 mr-2" />
              <span>{skill}</span>
            </h3>
          </div>
          
          <ul className="divide-y divide-dark-700">
            {categoryExperts[skill].map(expert => (
              <li key={expert.name} className="p-4 hover:bg-dark-750 transition-colors">
                <Link 
                  to={`/adventurer/${encodeURIComponent(expert.name)}`}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium hover:text-primary-400 transition-colors">
                      {expert.name}
                    </div>
                    <div className="text-xs text-dark-400">{expert.role}</div>
                  </div>
                  
                  <div className="flex items-center">
                    {expert.score === 5 ? (
                      <div className="flex items-center text-xs px-2 py-1 bg-success-900 text-success-200 rounded-full">
                        <Award size={12} className="mr-1 text-yellow-400" />
                        <span>Guru</span>
                      </div>
                    ) : (
                      <div className="text-xs px-2 py-1 bg-primary-900 text-primary-200 rounded-full">
                        Expert
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};

export default ExpertPanel;