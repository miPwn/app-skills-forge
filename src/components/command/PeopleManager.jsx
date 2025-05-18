import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Upload, AlertCircle, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdventurers } from '../../contexts/AdventurerContext';
import { logActivity } from './ActivityLog';

/**
 * Component for managing people in the Command Center
 */
const PeopleManager = () => {
  const { adventurers, addAdventurer, removeAdventurer, getSkillMatrix } = useAdventurers();
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Front End', skills: {} });
  const [skillMatrix, setSkillMatrix] = useState(null);
  
  // Load skill matrix data
  useEffect(() => {
    const matrix = getSkillMatrix();
    setSkillMatrix(matrix);
  }, [getSkillMatrix]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [personToRemove, setPersonToRemove] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [error, setError] = useState(null);

  // Available roles
  const roles = ['Front End', 'Back End', 'Full Stack', 'DevOps', 'QA'];

  // Handle input change for new person
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerson(prev => ({ ...prev, [name]: value }));
  };

  // Initialize empty skills structure based on skill matrix
  const initializeEmptySkills = (role) => {
    if (!skillMatrix) return {};
    
    const skills = {};
    
    // Determine which areas to include based on role
    let areasToInclude = [];
    
    if (role === 'Full Stack') {
      // Full Stack includes all areas
      areasToInclude = skillMatrix.areas.map(area => area.name);
    } else {
      // Get primary area for the role
      const roleInfo = skillMatrix.roles.find(r => r.name === role);
      const primaryArea = roleInfo ? roleInfo.primaryArea : null;
      
      // Always include Fundamental area
      areasToInclude = ['Fundamental'];
      
      // Add primary area if it exists
      if (primaryArea && primaryArea !== 'Fundamental') {
        areasToInclude.push(primaryArea);
      }
      
      // Add other areas that might be relevant
      areasToInclude.push('Others');
    }
    
    // Initialize skills for each area
    areasToInclude.forEach(areaName => {
      if (skillMatrix.skills[areaName]) {
        skills[areaName] = {};
        
        // Initialize each skill with score 0 and red color
        Object.keys(skillMatrix.skills[areaName]).forEach(skillName => {
          skills[areaName][skillName] = {
            score: 0,
            color: '#FF0000' // Always use red color for zero score
          };
        });
      }
    });
    
    return skills;
  };

  // Handle adding a new person
  const handleAddPerson = () => {
    if (!newPerson.name.trim()) {
      setError('Name is required');
      return;
    }

    // Check if person already exists
    const exists = adventurers.some(adv =>
      adv.name.toLowerCase() === newPerson.name.toLowerCase()
    );

    if (exists) {
      setError('A person with this name already exists');
      return;
    }

    // Initialize skills based on role
    const initializedSkills = initializeEmptySkills(newPerson.role);

    // Create a new person with initialized skills
    const personToAdd = {
      ...newPerson,
      skills: initializedSkills,
      lore: '',
      primary_area_score: 0,
      secondary_area_score: 0,
      primary_score: 0
    };

    addAdventurer(personToAdd);
    logActivity(`Added new person: ${newPerson.name}`);
    
    // Reset form
    setNewPerson({ name: '', role: 'Front End', skills: {} });
    setShowAddForm(false);
    setError(null);
  };

  // Handle removing a person
  const handleRemovePerson = (person) => {
    setPersonToRemove(person);
    setShowRemoveConfirm(true);
  };

  // Confirm removal of a person
  const confirmRemovePerson = () => {
    if (personToRemove) {
      removeAdventurer(personToRemove.id);
      logActivity(`Removed person: ${personToRemove.name}`);
      setShowRemoveConfirm(false);
      setPersonToRemove(null);
    }
  };

  // Import people from people.json
  const handleImportPeople = async () => {
    try {
      setImportStatus('loading');
      
      // Use a hardcoded array of people instead of fetching from a file
      const peopleData = [
        {
          "name": "John Doe",
          "role": "Full Stack",
          "skills": {}
        },
        {
          "name": "Jane Smith",
          "role": "Front End",
          "skills": {}
        },
        {
          "name": "Bob Johnson",
          "role": "Back End",
          "skills": {}
        }
      ];
      
      // Remove all current people except Guild and Quest Board
      const filteredAdventurers = adventurers.filter(
        adv => adv.role === 'Guild' || adv.role === 'Quest Board'
      );
      
      // Add each person from the JSON file
      for (const person of peopleData) {
        // Check if person already exists
        const exists = filteredAdventurers.some(adv =>
          adv.name.toLowerCase() === person.name.toLowerCase()
        );
        
        if (!exists) {
          // Convert flat skills structure to hierarchical structure if needed
          let structuredSkills = {};
          
          if (person.skills && !person.skills.Fundamental) {
            // The skills in people.json are flat, we need to structure them
            const matrix = getSkillMatrix();
            
            // Initialize empty skills structure
            matrix.areas.forEach(area => {
              if (!area.isVirtual) {
                structuredSkills[area.name] = {};
              }
            });
            
            // Populate skills from the flat structure
            Object.entries(person.skills).forEach(([skillName, skillData]) => {
              // Find which area this skill belongs to
              let foundArea = null;
              
              for (const areaName of Object.keys(matrix.skills)) {
                if (matrix.skills[areaName][skillName]) {
                  foundArea = areaName;
                  break;
                }
              }
              
              if (foundArea) {
                const score = skillData.score || 0;
                structuredSkills[foundArea][skillName] = {
                  score: score,
                  color: score === 0 ? '#FF0000' : getColorForScore(score)
                };
              }
            });
          } else {
            // Skills are already structured
            structuredSkills = person.skills || {};
          }
          
          addAdventurer({
            name: person.name,
            role: person.role,
            skills: structuredSkills,
            lore: '',
            primary_area_score: 0,
            secondary_area_score: 0,
            primary_score: 0
          });
        }
      }
      
      logActivity('Imported people from people.json');
      
      // Helper function to get color based on score
      function getColorForScore(score) {
        switch(score) {
          case 0: return '#FF0000'; // Red
          case 1: return '#FF4500'; // OrangeRed
          case 2: return '#FFA500'; // Orange
          case 3: return '#FFFF00'; // Yellow
          case 4: return '#ADFF2F'; // GreenYellow
          case 5: return '#00FF00'; // Green
          default: return '#FF0000'; // Default red
        }
      }
      setImportStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error importing people:', error);
      setImportStatus('error');
      setError(error.message);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus(null);
        setError(null);
      }, 3000);
    }
  };

  // Filter out Guild and Quest Board
  const filteredAdventurers = adventurers.filter(
    adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="font-medieval">People Manager</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-sm"
            title="Add new person"
          >
            <UserPlus size={16} className="mr-1" />
            <span>Add Person</span>
          </button>
          <button
            onClick={handleImportPeople}
            className={`btn ${importStatus === 'loading' ? 'btn-dark' : 'btn-success'} btn-sm`}
            disabled={importStatus === 'loading'}
            title="Import people from people.json"
          >
            {importStatus === 'loading' ? (
              <span className="animate-spin mr-1">⟳</span>
            ) : (
              <Upload size={16} className="mr-1" />
            )}
            <span>Import from JSON</span>
          </button>
        </div>
      </div>

      {/* Status messages */}
      {importStatus === 'success' && (
        <motion.div 
          className="m-4 p-3 bg-success-800 bg-opacity-20 border border-success-700 rounded-md text-success-400 text-sm flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check size={16} className="mr-2" />
          <span>Successfully imported people from people.json</span>
        </motion.div>
      )}

      {importStatus === 'error' && (
        <motion.div 
          className="m-4 p-3 bg-danger-800 bg-opacity-20 border border-danger-700 rounded-md text-danger-400 text-sm flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={16} className="mr-2" />
          <span>{error || 'Error importing people from people.json'}</span>
        </motion.div>
      )}

      {/* Add person form */}
      {showAddForm && (
        <motion.div 
          className="m-4 p-4 bg-dark-750 rounded-md border border-dark-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medieval">Add New Person</h3>
            <button 
              onClick={() => {
                setShowAddForm(false);
                setError(null);
              }}
              className="text-dark-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md text-danger-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newPerson.name}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={newPerson.role}
                onChange={handleInputChange}
                className="input w-full"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddPerson}
              className="btn btn-primary"
            >
              <UserPlus size={16} className="mr-2" />
              <span>Add Person</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* People list */}
      <div className="p-4">
        <h3 className="text-lg font-medieval mb-3">Current People ({filteredAdventurers.length})</h3>
        
        <div className="overflow-y-auto max-h-[40vh]">
          <table className="w-full">
            <thead className="bg-dark-750">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdventurers.map((person, index) => (
                <tr 
                  key={person.id} 
                  className={`border-b border-dark-700 ${index % 2 === 0 ? 'bg-dark-800' : ''}`}
                >
                  <td className="p-2">{person.name}</td>
                  <td className="p-2">{person.role}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleRemovePerson(person)}
                      className="btn btn-danger btn-sm"
                      title="Remove person"
                    >
                      <UserMinus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remove confirmation modal */}
      {showRemoveConfirm && personToRemove && (
        <div className="fixed inset-0 bg-dark-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-dark-800 rounded-lg shadow-xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-medieval text-danger-400 mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove <span className="font-bold">{personToRemove.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setPersonToRemove(null);
                }}
                className="btn btn-dark"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemovePerson}
                className="btn btn-danger"
              >
                <UserMinus size={16} className="mr-2" />
                <span>Remove</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PeopleManager;