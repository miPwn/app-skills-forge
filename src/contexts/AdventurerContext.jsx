import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { skillData } from '../data/skill-data';
import { calculatePrimaryScore, calculatePrimaryAreaScore, calculateSecondaryAreaScore } from '../utils/rankHelpers';

// Create the context
const AdventurerContext = createContext();

// Local storage keys
const STORAGE_KEY = 'guildforge_adventurers';
const MATRIX_STORAGE_KEY = 'guildforge_skill_matrix';

/**
 * Provider component for adventurer data
 */
export const AdventurerProvider = ({ children }) => {
  const [adventurers, setAdventurers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data from localStorage or fallback to skillData
  useEffect(() => {
    const initializeData = () => {
      try {
        setLoading(true);
        
        // Try to load from localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        let initialData = [];
        
        if (savedData) {
          try {
            initialData = JSON.parse(savedData);
            console.log('Loaded data from localStorage:', initialData.length, 'adventurers');
          } catch (e) {
            console.error('Error parsing saved adventurers:', e);
            initialData = [];
          }
        }
        
        // If no data in localStorage, use skillData
        if (!initialData || initialData.length === 0) {
          console.log('Initializing with sample data');
          
          // Process the sample data
          initialData = skillData.map((adventurer, index) => {
            // Calculate scores if missing
            const primary_area_score = adventurer.primary_area_score || calculatePrimaryAreaScore(adventurer);
            const secondary_area_score = adventurer.secondary_area_score || calculateSecondaryAreaScore(adventurer);
            const primary_score = adventurer.primary_score || calculatePrimaryScore({
              ...adventurer,
              primary_area_score,
              secondary_area_score
            });
            
            return {
              id: `adv-${index + 1}`, // Generate an ID
              name: adventurer.name,
              role: adventurer.role,
              primary_area_score,
              secondary_area_score,
              primary_score,
              avatarUrl: adventurer.avatarUrl || null,
              skills: adventurer.skills,
              lore: ''
            };
          });
          
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
        
        setAdventurers(initialData);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load adventurers. Please try again later.');
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // Save to localStorage whenever adventurers change
  useEffect(() => {
    if (!loading && adventurers.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adventurers));
      } catch (e) {
        console.error('Error saving adventurers to localStorage:', e);
      }
    }
  }, [adventurers, loading]);

  // Process adventurers to ensure they have all required scores
  const processedAdventurers = useMemo(() => {
    return adventurers.map(adventurer => {
      // Skip if already processed
      if (adventurer.primary_score && adventurer.primary_area_score && adventurer.secondary_area_score) {
        return adventurer;
      }
      
      // Calculate missing scores
      const primary_area_score = adventurer.primary_area_score || calculatePrimaryAreaScore(adventurer);
      const secondary_area_score = adventurer.secondary_area_score || calculateSecondaryAreaScore(adventurer);
      const primary_score = adventurer.primary_score || calculatePrimaryScore({
        ...adventurer,
        primary_area_score,
        secondary_area_score
      });
      
      return {
        ...adventurer,
        primary_area_score,
        secondary_area_score,
        primary_score
      };
    });
  }, [adventurers]);

  // Add a new adventurer
  const addAdventurer = (newAdventurer) => {
    const id = `adv-${Date.now()}`;
    const adventurerWithId = { ...newAdventurer, id };
    
    setAdventurers(prev => [...prev, adventurerWithId]);
    return adventurerWithId;
  };

  // Update an existing adventurer
  const updateAdventurer = (id, updatedData) => {
    setAdventurers(prev => 
      prev.map(adv => adv.id === id ? { ...adv, ...updatedData } : adv)
    );
    
    // Return the updated adventurer
    return adventurers.find(adv => adv.id === id);
  };

  // Remove an adventurer
  const removeAdventurer = (id) => {
    setAdventurers(prev => prev.filter(adv => adv.id !== id));
    return true;
  };

  // Find an adventurer by ID
  const findAdventurerById = (id) => {
    return processedAdventurers.find(adv => adv.id === id);
  };

  // Find an adventurer by name
  const findAdventurer = (name) => {
    return processedAdventurers.find(adv => adv.name === name);
  };

  // Get adventurers by role
  const getAdventurersByRole = (role) => {
    return processedAdventurers.filter(adv => adv.role === role);
  };

  // Sort adventurers by primary score
  const getTopAdventurers = (limit = 10) => {
    return [...processedAdventurers]
      .filter(adv => adv.role !== 'Guild' && adv.role !== 'Quest Board')
      .sort((a, b) => b.primary_score - a.primary_score)
      .slice(0, limit);
  };

  // Reset to initial data
  const resetToInitial = () => {
    // Process the sample data
    const initialData = skillData.map((adventurer, index) => {
      // Calculate scores if missing
      const primary_area_score = adventurer.primary_area_score || calculatePrimaryAreaScore(adventurer);
      const secondary_area_score = adventurer.secondary_area_score || calculateSecondaryAreaScore(adventurer);
      const primary_score = adventurer.primary_score || calculatePrimaryScore({
        ...adventurer,
        primary_area_score,
        secondary_area_score
      });
      
      return {
        id: `adv-${index + 1}`, // Generate an ID
        name: adventurer.name,
        role: adventurer.role,
        primary_area_score,
        secondary_area_score,
        primary_score,
        avatarUrl: adventurer.avatarUrl || null,
        skills: adventurer.skills,
        lore: ''
      };
    });
    
    setAdventurers(initialData);
    return true;
  };

  // Get the skill matrix data
  const getSkillMatrix = () => {
    try {
      // Try to load from localStorage
      const savedMatrix = localStorage.getItem(MATRIX_STORAGE_KEY);
      
      if (savedMatrix) {
        return JSON.parse(savedMatrix);
      }
      
      // If no data in localStorage, create from adventurers data
      const roles = [...new Set(adventurers.map(adv => adv.role))].map(role => {
        let primaryArea;
        
        switch(role) {
          case 'Front End':
            primaryArea = 'Front-end';
            break;
          case 'Back End':
            primaryArea = 'Back-end';
            break;
          case 'Full Stack':
            primaryArea = 'Full Stack'; // Special case for Full Stack
            break;
          case 'DevOps':
            primaryArea = 'Cloud & DevOps';
            break;
          case 'QA':
            primaryArea = 'AQA';
            break;
          default:
            primaryArea = 'Fundamental';
        }
        
        return {
          name: role,
          primaryArea
        };
      });
      
      // Add a special "Full Stack" area that combines Front-end and Back-end
      const areas = [
        { name: 'Fundamental' },
        { name: 'Front-end' },
        { name: 'Back-end' },
        { name: 'Full Stack', isVirtual: true }, // Virtual area for Full Stack
        { name: 'AQA' },
        { name: 'Cloud & DevOps' },
        { name: 'Others' }
      ];
      
      // Extract all skills from all adventurers
      const skills = {};
      
      // Initialize skills object with empty objects for each area
      areas.forEach(area => {
        if (!area.isVirtual) { // Skip virtual areas
          skills[area.name] = {};
        }
      });
      
      // Populate skills from adventurers
      adventurers.forEach(adventurer => {
        Object.entries(adventurer.skills).forEach(([areaName, areaSkills]) => {
          if (!skills[areaName]) {
            skills[areaName] = {};
          }
          
          Object.entries(areaSkills).forEach(([skillName, skillData]) => {
            if (!skills[areaName][skillName]) {
              skills[areaName][skillName] = {
                score: skillData.score,
                color: skillData.color
              };
            }
          });
        });
      });
      
      // Create the Full Stack virtual area by combining Front-end and Back-end skills
      skills['Full Stack'] = {
        ...skills['Front-end'],
        ...skills['Back-end']
      };
      
      // Populate skills from adventurers
      adventurers.forEach(adventurer => {
        Object.entries(adventurer.skills).forEach(([areaName, areaSkills]) => {
          Object.entries(areaSkills).forEach(([skillName, skillData]) => {
            if (!skills[areaName][skillName]) {
              skills[areaName][skillName] = {
                score: skillData.score,
                color: skillData.color
              };
            }
          });
        });
      });
      
      const matrix = { roles, areas, skills };
      
      // Save to localStorage
      localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(matrix));
      
      return matrix;
    } catch (err) {
      console.error('Error getting skill matrix:', err);
      return { roles: [], areas: [], skills: {} };
    }
  };
  
  // Update the skill matrix
  const updateSkillMatrix = (newMatrix) => {
    try {
      // Save to localStorage
      localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(newMatrix));
      
      // Update adventurers with the new matrix data
      const updatedAdventurers = adventurers.map(adventurer => {
        const updatedSkills = { ...adventurer.skills };
        
        // Update each area and skill based on the new matrix
        Object.entries(newMatrix.skills).forEach(([areaName, areaSkills]) => {
          if (!updatedSkills[areaName]) {
            updatedSkills[areaName] = {};
          }
          
          // Keep existing skills that are still in the matrix
          const updatedAreaSkills = {};
          
          Object.entries(areaSkills).forEach(([skillName, skillData]) => {
            // If the adventurer already has this skill, keep their score
            if (updatedSkills[areaName][skillName]) {
              updatedAreaSkills[skillName] = updatedSkills[areaName][skillName];
            } else {
              // Otherwise, add the skill with default score
              updatedAreaSkills[skillName] = {
                score: 0,
                color: skillData.color
              };
            }
          });
          
          updatedSkills[areaName] = updatedAreaSkills;
        });
        
        return {
          ...adventurer,
          skills: updatedSkills
        };
      });
      
      setAdventurers(updatedAdventurers);
      return true;
    } catch (err) {
      console.error('Error updating skill matrix:', err);
      return false;
    }
  };

  // Context value
  const value = {
    adventurers: processedAdventurers,
    loading,
    error,
    addAdventurer,
    updateAdventurer,
    removeAdventurer,
    findAdventurerById,
    findAdventurer,
    getAdventurersByRole,
    getTopAdventurers,
    resetToInitial,
    getSkillMatrix,
    updateSkillMatrix
  };

  return (
    <AdventurerContext.Provider value={value}>
      {children}
    </AdventurerContext.Provider>
  );
};

/**
 * Custom hook to use the adventurer context
 */
export const useAdventurers = () => {
  const context = useContext(AdventurerContext);
  if (context === undefined) {
    throw new Error('useAdventurers must be used within an AdventurerProvider');
  }
  return context;
};

export default AdventurerContext;