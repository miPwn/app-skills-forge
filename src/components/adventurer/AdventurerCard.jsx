import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Edit, Award, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { createAvatarUrl, getRankName, getClassDescription } from '../../utils/helpers';
import SkillTree from './SkillTree';
import { CLASS_EMBLEMS } from '../../utils/constants';

const AdventurerCard = ({ adventurers }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skills');
  
  // Find the adventurer in our data
  const adventurer = adventurers.find(a => a.name === id);
  
  if (!adventurer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medieval text-primary-300 mb-4">Adventurer Not Found</h2>
        <p className="text-dark-300 mb-6">This adventurer appears to be on a secret quest. They cannot be located in the guild records.</p>
        <button 
          onClick={() => navigate('/guild-hall')}
          className="btn btn-primary"
        >
          <ArrowLeft size={16} className="mr-2" />
          Return to Guild Hall
        </button>
      </div>
    );
  }
  
  const rankName = getRankName(adventurer.primary_score);
  const classDescription = getClassDescription(adventurer.role);
  
  return (
    <div className="pb-6">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/guild-hall')}
          className="btn btn-outline-primary mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-medieval text-primary-200">Character Sheet</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Info Panel */}
        <div className="lg:col-span-1">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-dark-800 to-dark-700 flex items-center justify-center">
                <div className="text-5xl opacity-10">{CLASS_EMBLEMS[adventurer.role] || '🧩'}</div>
              </div>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-600 bg-dark-700">
                    <img 
                      src={createAvatarUrl(adventurer.name)} 
                      alt={adventurer.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -right-2 -bottom-2 bg-primary-600 text-white rounded-full p-1">
                    <BadgeCheck size={20} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-20 pb-6 px-6">
              <h2 className="text-xl font-bold text-center mb-1">{adventurer.name}</h2>
              <div className="flex justify-center items-center text-sm text-dark-300 mb-4">
                <span className="role-emblem mr-2">{CLASS_EMBLEMS[adventurer.role] || '🧩'}</span>
                <span>{adventurer.role}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary-800 to-primary-600 text-primary-100 text-sm">
                  <Star size={16} className="mr-1 text-yellow-300" />
                  <span>{rankName} (Rank {adventurer.primary_score?.toFixed(1)})</span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-dark-300 mb-4 italic">{classDescription}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-dark-400 mb-1 flex justify-between">
                      <span>Primary Mastery</span>
                      <span>{adventurer.primary_area_score.toFixed(1)}/5</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill bg-primary-500" 
                        style={{ width: `${(adventurer.primary_area_score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-dark-400 mb-1 flex justify-between">
                      <span>Secondary Mastery</span>
                      <span>{adventurer.secondary_area_score.toFixed(1)}/5</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill bg-secondary-500" 
                        style={{ width: `${(adventurer.secondary_area_score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button className="btn btn-outline-primary">
                  <Award size={16} className="mr-1" />
                  <span>View Achievements</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Skills & Bio Tabs */}
        <div className="lg:col-span-2">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="border-b border-dark-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'skills' 
                      ? 'border-b-2 border-primary-500 text-primary-400' 
                      : 'text-dark-300 hover:text-primary-300'
                  } transition-colors`}
                >
                  Skill Trees
                </button>
                <button
                  onClick={() => setActiveTab('lore')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'lore' 
                      ? 'border-b-2 border-primary-500 text-primary-400' 
                      : 'text-dark-300 hover:text-primary-300'
                  } transition-colors`}
                >
                  Character Lore
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'skills' ? (
                <div className="space-y-8">
                  {Object.entries(adventurer.skills).map(([category, skills], index) => (
                    <SkillTree 
                      key={category} 
                      category={category} 
                      skills={skills} 
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              ) : (
                <div className="parchment min-h-[400px] relative">
                  <div className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-dark-800 bg-opacity-50 rounded-full">
                      <Edit size={16} className="text-dark-900" />
                    </button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-dark-900">
                    <h1 className="text-2xl font-medieval text-center mb-4">The Legend of {adventurer.name}</h1>
                    
                    <p className="mb-4">
                      {adventurer.name}, known throughout the realms as a {adventurer.role} of great skill, has achieved
                      the rank of {rankName} through countless trials and quests.
                    </p>
                    
                    <p className="mb-4">
                      With exceptional talent in {Object.entries(adventurer.skills)
                        .flatMap(([_, skills]) => Object.entries(skills)
                          .filter(([_, skill]) => skill.score >= 4)
                          .map(([name, _]) => name)
                        )
                        .slice(0, 3)
                        .join(', ') || "various skills"}, 
                      {adventurer.name} has become a valued member of the guild, offering guidance to apprentices
                      and taking on challenges that would overwhelm lesser adventurers.
                    </p>
                    
                    <p>
                      Their journey continues as they seek to master new skills and overcome greater challenges
                      in service to the realm.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdventurerCard;