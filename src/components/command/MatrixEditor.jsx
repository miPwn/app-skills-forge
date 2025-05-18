import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, MoveVertical, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAdventurers } from '../../contexts/AdventurerContext';

/**
 * Matrix Editor component for managing roles, categories, areas, and skills
 */
const MatrixEditor = ({ onSave, onClose }) => {
  const { adventurers, getSkillMatrix, updateSkillMatrix } = useAdventurers();
  const [matrix, setMatrix] = useState(null);
  const [activeTab, setActiveTab] = useState('roles');
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [moveSource, setMoveSource] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  
  // Initialize matrix data
  useEffect(() => {
    const initialMatrix = getSkillMatrix();
    setMatrix(initialMatrix);
  }, [getSkillMatrix]);
  
  if (!matrix) {
    return <div className="p-6 text-center">Loading matrix data...</div>;
  }
  
  // Handle saving changes
  const handleSave = () => {
    updateSkillMatrix(matrix);
    onSave(matrix);
  };
  
  // Add a new item
  const handleAddItem = () => {
    if (activeTab === 'roles') {
      const newRoles = [...matrix.roles, newItem];
      setMatrix({ ...matrix, roles: newRoles });
    } else if (activeTab === 'areas') {
      const newAreas = [...matrix.areas, newItem];
      setMatrix({ ...matrix, areas: newAreas });
    } else if (activeTab === 'skills') {
      const area = newItem.area || Object.keys(matrix.skills)[0];
      const newSkills = { 
        ...matrix.skills,
        [area]: {
          ...(matrix.skills[area] || {}),
          [newItem.name]: {
            score: 0,
            color: newItem.color || '#FF0000'
          }
        }
      };
      setMatrix({ ...matrix, skills: newSkills });
    }
    
    setNewItem({});
    setIsAdding(false);
  };
  
  // Update an existing item
  const handleUpdateItem = () => {
    if (activeTab === 'roles') {
      const updatedRoles = matrix.roles.map((role, index) => 
        index === editItem.index ? { ...role, ...editItem.data } : role
      );
      setMatrix({ ...matrix, roles: updatedRoles });
    } else if (activeTab === 'areas') {
      const updatedAreas = matrix.areas.map((area, index) => 
        index === editItem.index ? { ...area, ...editItem.data } : area
      );
      setMatrix({ ...matrix, areas: updatedAreas });
    } else if (activeTab === 'skills') {
      const { area, skillName, data } = editItem;
      const updatedSkills = { 
        ...matrix.skills,
        [area]: {
          ...matrix.skills[area],
          [skillName]: {
            ...matrix.skills[area][skillName],
            ...data
          }
        }
      };
      setMatrix({ ...matrix, skills: updatedSkills });
    }
    
    setEditItem(null);
    setIsEditing(false);
  };
  
  // Delete an item
  const handleDeleteItem = (index, type, area = null, skillName = null) => {
    if (type === 'role') {
      const newRoles = matrix.roles.filter((_, i) => i !== index);
      setMatrix({ ...matrix, roles: newRoles });
    } else if (type === 'area') {
      const newAreas = matrix.areas.filter((_, i) => i !== index);
      const newSkills = { ...matrix.skills };
      delete newSkills[matrix.areas[index].name];
      setMatrix({ ...matrix, areas: newAreas, skills: newSkills });
    } else if (type === 'skill') {
      const newSkills = { ...matrix.skills };
      const areaSkills = { ...newSkills[area] };
      delete areaSkills[skillName];
      newSkills[area] = areaSkills;
      setMatrix({ ...matrix, skills: newSkills });
    }
  };
  
  // Move a skill to a different area
  const handleMoveSkill = () => {
    if (!moveSource || !moveTarget) return;
    
    const { area: sourceArea, skillName } = moveSource;
    const { area: targetArea } = moveTarget;
    
    if (sourceArea === targetArea) return;
    
    const newSkills = { ...matrix.skills };
    const skill = { ...newSkills[sourceArea][skillName] };
    
    // Remove from source area
    const sourceAreaSkills = { ...newSkills[sourceArea] };
    delete sourceAreaSkills[skillName];
    newSkills[sourceArea] = sourceAreaSkills;
    
    // Add to target area
    newSkills[targetArea] = {
      ...newSkills[targetArea],
      [skillName]: skill
    };
    
    setMatrix({ ...matrix, skills: newSkills });
    setMoveSource(null);
    setMoveTarget(null);
  };
  
  // Render roles tab
  const renderRolesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medieval mb-2">Roles</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {matrix.roles.map((role, index) => (
          <div key={index} className="bg-dark-700 p-3 rounded-md flex justify-between items-center">
            <div>
              <div className="font-medium">{role.name}</div>
              <div className="text-xs text-dark-400">Primary Area: {role.primaryArea}</div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setEditItem({ index, data: { ...role } });
                  setIsEditing(true);
                }}
                className="p-1 rounded-md text-dark-400 hover:text-primary-400 hover:bg-dark-600"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteItem(index, 'role')}
                className="p-1 rounded-md text-dark-400 hover:text-danger-400 hover:bg-dark-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Add New Role</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Role Name</label>
              <input 
                type="text" 
                className="input w-full"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Primary Area</label>
              <select 
                className="input w-full"
                value={newItem.primaryArea || ''}
                onChange={(e) => setNewItem({ ...newItem, primaryArea: e.target.value })}
              >
                <option value="">Select Primary Area</option>
                {matrix.areas.map((area, index) => (
                  <option key={index} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                className="btn btn-primary"
                disabled={!newItem.name || !newItem.primaryArea}
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isEditing && editItem && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Edit Role</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Role Name</label>
              <input 
                type="text" 
                className="input w-full"
                value={editItem.data.name || ''}
                onChange={(e) => setEditItem({ 
                  ...editItem, 
                  data: { ...editItem.data, name: e.target.value } 
                })}
              />
            </div>
            <div>
              <label className="label">Primary Area</label>
              <select 
                className="input w-full"
                value={editItem.data.primaryArea || ''}
                onChange={(e) => setEditItem({ 
                  ...editItem, 
                  data: { ...editItem.data, primaryArea: e.target.value } 
                })}
              >
                <option value="">Select Primary Area</option>
                {matrix.areas.map((area, index) => (
                  <option key={index} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => {
                  setEditItem(null);
                  setIsEditing(false);
                }}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateItem}
                className="btn btn-primary"
                disabled={!editItem.data.name || !editItem.data.primaryArea}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!isAdding && !isEditing && (
        <button 
          onClick={() => {
            setNewItem({});
            setIsAdding(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          <span>Add New Role</span>
        </button>
      )}
    </div>
  );
  
  // Render areas tab
  const renderAreasTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medieval mb-2">Skill Areas</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {matrix.areas.map((area, index) => (
          <div key={index} className="bg-dark-700 p-3 rounded-md flex justify-between items-center">
            <div>
              <div className="font-medium">
                {area.name}
                {area.isVirtual && (
                  <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                    Virtual
                  </span>
                )}
              </div>
              <div className="text-xs text-dark-400">
                {Object.keys(matrix.skills[area.name] || {}).length} skills
                {area.isVirtual && " (combined from other areas)"}
              </div>
            </div>
            <div className="flex space-x-2">
              {!area.isVirtual && (
                <>
                  <button
                    onClick={() => {
                      setEditItem({ index, data: { ...area } });
                      setIsEditing(true);
                    }}
                    className="p-1 rounded-md text-dark-400 hover:text-primary-400 hover:bg-dark-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index, 'area')}
                    className="p-1 rounded-md text-dark-400 hover:text-danger-400 hover:bg-dark-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Add New Area</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Area Name</label>
              <input 
                type="text" 
                className="input w-full"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                className="btn btn-primary"
                disabled={!newItem.name}
              >
                Add Area
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isEditing && editItem && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Edit Area</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Area Name</label>
              <input 
                type="text" 
                className="input w-full"
                value={editItem.data.name || ''}
                onChange={(e) => setEditItem({ 
                  ...editItem, 
                  data: { ...editItem.data, name: e.target.value } 
                })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => {
                  setEditItem(null);
                  setIsEditing(false);
                }}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateItem}
                className="btn btn-primary"
                disabled={!editItem.data.name}
              >
                Update Area
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!isAdding && !isEditing && (
        <button 
          onClick={() => {
            setNewItem({});
            setIsAdding(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          <span>Add New Area</span>
        </button>
      )}
    </div>
  );
  
  // Render skills tab
  const renderSkillsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medieval mb-2">Skills</h3>
      
      {matrix.areas.map((area) => (
        <div key={area.name} className="mb-6">
          <h4 className="text-md font-medieval mb-2 flex items-center">
            <span className="text-primary-400 mr-2">
              {area.name}
              {area.isVirtual && (
                <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                  Virtual
                </span>
              )}
            </span>
            <div className="flex-1 h-px bg-dark-700 ml-2"></div>
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(matrix.skills[area.name] || {}).map(([skillName, skill]) => (
              <div key={skillName} className="bg-dark-700 p-3 rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium">{skillName}</div>
                  <div className="text-xs text-dark-400">
                    Default Score: {skill.score}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!area.isVirtual && (
                    <>
                      <button
                        onClick={() => {
                          setMoveSource({ area: area.name, skillName });
                          setMoveTarget(null);
                        }}
                        className={`p-1 rounded-md ${
                          moveSource && moveSource.area === area.name && moveSource.skillName === skillName
                            ? 'bg-primary-600 text-white'
                            : 'text-dark-400 hover:text-primary-400 hover:bg-dark-600'
                        }`}
                      >
                        <MoveVertical size={16} />
                      </button>
                      {moveSource && moveSource.area !== area.name && (
                        <button
                          onClick={() => {
                            setMoveTarget({ area: area.name });
                            setTimeout(handleMoveSkill, 0);
                          }}
                          className="p-1 rounded-md bg-primary-600 text-white"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditItem({
                            area: area.name,
                            skillName,
                            data: { ...skill }
                          });
                          setIsEditing(true);
                        }}
                        className="p-1 rounded-md text-dark-400 hover:text-primary-400 hover:bg-dark-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(null, 'skill', area.name, skillName)}
                        className="p-1 rounded-md text-dark-400 hover:text-danger-400 hover:bg-dark-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {Object.keys(matrix.skills[area.name] || {}).length === 0 && (
            <div className="text-dark-400 text-sm italic p-2">
              No skills in this area yet.
            </div>
          )}
        </div>
      ))}
      
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Add New Skill</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Skill Name</label>
              <input 
                type="text" 
                className="input w-full"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Area</label>
              <select 
                className="input w-full"
                value={newItem.area || ''}
                onChange={(e) => setNewItem({ ...newItem, area: e.target.value })}
              >
                <option value="">Select Area</option>
                {matrix.areas.filter(area => !area.isVirtual).map((area, index) => (
                  <option key={index} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Default Score</label>
              <input 
                type="number" 
                min="0"
                max="5"
                className="input w-full"
                value={newItem.score || 0}
                onChange={(e) => setNewItem({ 
                  ...newItem, 
                  score: parseInt(e.target.value) || 0 
                })}
              />
            </div>
            <div>
              <label className="label">Color (Hex)</label>
              <input 
                type="text" 
                className="input w-full"
                value={newItem.color || '#FF0000'}
                onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                className="btn btn-primary"
                disabled={!newItem.name || !newItem.area}
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isEditing && editItem && (
        <div className="bg-dark-700 p-4 rounded-md mt-4">
          <h4 className="font-medieval mb-3">Edit Skill</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Default Score</label>
              <input 
                type="number" 
                min="0"
                max="5"
                className="input w-full"
                value={editItem.data.score || 0}
                onChange={(e) => setEditItem({ 
                  ...editItem, 
                  data: { 
                    ...editItem.data, 
                    score: parseInt(e.target.value) || 0 
                  } 
                })}
              />
            </div>
            <div>
              <label className="label">Color (Hex)</label>
              <input 
                type="text" 
                className="input w-full"
                value={editItem.data.color || '#FF0000'}
                onChange={(e) => setEditItem({ 
                  ...editItem, 
                  data: { ...editItem.data, color: e.target.value } 
                })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => {
                  setEditItem(null);
                  setIsEditing(false);
                }}
                className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateItem}
                className="btn btn-primary"
              >
                Update Skill
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!isAdding && !isEditing && (
        <button 
          onClick={() => {
            setNewItem({});
            setIsAdding(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          <span>Add New Skill</span>
        </button>
      )}
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medieval text-primary-300">Skill Matrix Editor</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleSave}
            className="btn btn-primary"
          >
            <Save size={16} className="mr-2" />
            <span>Save Changes</span>
          </button>
          <button 
            onClick={onClose}
            className="btn bg-dark-600 text-dark-300 hover:bg-dark-500"
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="border-b border-dark-700 mb-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'roles' 
                ? 'border-b-2 border-primary-500 text-primary-400' 
                : 'text-dark-300 hover:text-primary-300'
            } transition-colors`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'areas' 
                ? 'border-b-2 border-primary-500 text-primary-400' 
                : 'text-dark-300 hover:text-primary-300'
            } transition-colors`}
          >
            Skill Areas
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'skills' 
                ? 'border-b-2 border-primary-500 text-primary-400' 
                : 'text-dark-300 hover:text-primary-300'
            } transition-colors`}
          >
            Skills
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'roles' && renderRolesTab()}
        {activeTab === 'areas' && renderAreasTab()}
        {activeTab === 'skills' && renderSkillsTab()}
      </div>
    </div>
  );
};

export default MatrixEditor;