import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Save, GripVertical, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SKILL_LEVELS } from '../../utils/constants';
import { getSkillColor } from '../../utils/helpers';

const SkillEditor = ({ adventurer, onSave }) => {
  const [editedSkills, setEditedSkills] = useState({...adventurer.skills});
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Fundamental');
  const [showNewSkillForm, setShowNewSkillForm] = useState(false);
  
  const handleSkillChange = (category, skillName, newScore) => {
    setEditedSkills(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skillName]: {
          score: newScore,
          color: getSkillColor(newScore)
        }
      }
    }));
  };
  
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;
    
    // If dropped in the same category, do nothing
    if (sourceCategory === destCategory) {
      return;
    }
    
    // Get the skill name from the draggableId
    const skillName = result.draggableId;
    
    // Get the skill data from the source category
    const skillData = editedSkills[sourceCategory][skillName];
    
    // Create a new skills object
    const newSkills = {...editedSkills};
    
    // Add the skill to the destination category
    newSkills[destCategory] = {
      ...newSkills[destCategory],
      [skillName]: skillData
    };
    
    // Remove the skill from the source category
    const { [skillName]: removed, ...remainingSkills } = newSkills[sourceCategory];
    newSkills[sourceCategory] = remainingSkills;
    
    // Update the state
    setEditedSkills(newSkills);
  };
  
  const handleAddNewSkill = () => {
    if (!newSkillName.trim()) return;
    
    // Create a new skills object
    const newSkills = {...editedSkills};
    
    // Ensure the category exists
    if (!newSkills[newSkillCategory]) {
      newSkills[newSkillCategory] = {};
    }
    
    // Add the new skill to the category
    newSkills[newSkillCategory][newSkillName] = {
      score: 0,
      color: getSkillColor(0)
    };
    
    // Update the state
    setEditedSkills(newSkills);
    setNewSkillName('');
    setShowNewSkillForm(false);
  };
  
  const handleSave = () => {
    onSave({
      ...adventurer,
      skills: editedSkills
    });
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medieval text-primary-300">Skill Editor</h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewSkillForm(!showNewSkillForm)}
              className="btn btn-outline-primary"
            >
              <Plus size={16} className="mr-2" />
              <span>Add Skill</span>
            </button>
            
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              <Save size={16} className="mr-2" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
        
        {showNewSkillForm && (
          <div className="card mb-6 p-4">
            <h4 className="font-medieval mb-3">Add New Skill</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm text-dark-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter skill name"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-dark-400 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.keys(editedSkills).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleAddNewSkill}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-8">
          {Object.entries(editedSkills).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              className="card"
            >
              <div className="card-header">
                <h4 className="font-medieval">{category}</h4>
              </div>
              
              <Droppable droppableId={category}>
                {(provided) => (
                  <div
                    className="p-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(skills).map(([skillName, skill], skillIndex) => (
                        <Draggable key={skillName} draggableId={skillName} index={skillIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-dark-700 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-grab text-dark-400 hover:text-primary-400"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                  <span className="font-medium">{skillName}</span>
                                </div>
                                <div
                                  className={`gem ${skill.score === 5 ? 'animate-glow' : ''}`}
                                  style={{
                                    backgroundColor: skill.color,
                                    color: skill.score === 0 || skill.score >= 4 ? '#FFFFFF' : '#333333', /* Adaptive text color */
                                    textShadow: '0px 0px 2px rgba(0,0,0,0.5)', /* Text shadow for better readability */
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '24px',
                                    height: '24px'
                                  }}
                                >
                                  {skill.score.toFixed(1)}
                                </div>
                              </div>
                              
                              <div className="relative pt-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="5"
                                  step="1"
                                  value={skill.score}
                                  onChange={(e) => handleSkillChange(category, skillName, parseInt(e.target.value))}
                                  className="w-full h-2 appearance-none rounded bg-dark-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, ${SKILL_LEVELS[0].color}, ${SKILL_LEVELS[1].color}, ${SKILL_LEVELS[2].color}, ${SKILL_LEVELS[3].color}, ${SKILL_LEVELS[4].color}, ${SKILL_LEVELS[5].color})`,
                                    backgroundSize: `100% 100%`,
                                    backgroundRepeat: 'no-repeat'
                                  }}
                                />
                                
                                <div className="flex justify-between text-xs text-dark-400 mt-1">
                                  <span>{SKILL_LEVELS[skill.score]?.title || "Unknown"}</span>
                                  
                                  {skill.score === 5 && (
                                    <div className="flex items-center text-yellow-300">
                                      <Zap size={12} className="mr-1" />
                                      <span>Mastered</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default SkillEditor;