import React, { useState, useRef } from 'react';
import { UserPlus, Loader, Check, AlertCircle, Upload } from 'lucide-react';
import { useAdventurers } from '../../contexts/AdventurerContext';
import { logActivity } from './ActivityLog';

/**
 * Component for importing people from a JSON file in the format of people.json
 */
const PeopleImporter = () => {
  const { adventurers, setAdventurers, getSkillMatrix } = useAdventurers();
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle file selection and import
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      setImportError(null);
      setImportSuccess(false);
      
      // Read the file content
      const fileContent = await readFileAsText(file);
      const peopleData = JSON.parse(fileContent);
      
      if (!Array.isArray(peopleData)) {
        throw new Error('Invalid file format. Expected an array of people.');
      }
      
      // Filter out Guild and Quest Board from current adventurers
      const filteredAdventurers = adventurers.filter(
        adv => adv.role === 'Guild' || adv.role === 'Quest Board'
      );
      
      // Process each person from the imported data
      const matrix = getSkillMatrix();
      const processedPeople = peopleData.map(person => {
        // Ensure the person has the required fields
        if (!person.name || !person.role || !person.skills) {
          console.warn(`Skipping person with missing required fields: ${JSON.stringify(person)}`);
          return null;
        }
        
        // Convert flat skills structure to hierarchical structure if needed
        let structuredSkills = {};
        
        if (person.skills && !person.skills.Fundamental) {
          // The skills in people.json are flat, we need to structure them
          
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
                color: getColorForScore(score)
              };
            }
          });
        } else {
          // Skills are already structured
          structuredSkills = person.skills || {};
        }
        
        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9), // Generate a unique ID
          name: person.name,
          role: person.role,
          skills: structuredSkills,
          lore: person.lore || '',
          primary_area_score: person.primary_area_score || 0,
          secondary_area_score: person.secondary_area_score || 0,
          primary_score: person.primary_score || 0,
          avatarUrl: person.avatarUrl || ''
        };
      }).filter(Boolean); // Remove any null entries
      
      // Combine filtered adventurers with processed people
      const newAdventurers = [...filteredAdventurers, ...processedPeople];
      
      // Save to localStorage
      localStorage.setItem('guildforge_adventurers', JSON.stringify(newAdventurers));
      
      // Update state
      setAdventurers(newAdventurers);
      
      logActivity(`Imported ${processedPeople.length} people from uploaded file`, 'Guild Master');
      setImportSuccess(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error importing people:', error);
      setImportError(`Error importing people: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  // Helper function to read file content
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  // Helper function to get color based on score
  const getColorForScore = (score) => {
    switch(score) {
      case 0: return '#FF0000'; // Red
      case 1: return '#FF4500'; // OrangeRed
      case 2: return '#FFA500'; // Orange
      case 3: return '#FFFF00'; // Yellow
      case 4: return '#ADFF2F'; // GreenYellow
      case 5: return '#00FF00'; // Green
      default: return '#FF0000'; // Default red
    }
  };
  
  // Trigger file input click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-medieval flex items-center">
          <UserPlus size={20} className="mr-2 text-success-400" />
          <span>Import People</span>
        </h2>
      </div>
      
      <div className="p-6">
        <p className="text-dark-300 mb-6">
          Upload a JSON file in the format of people.json to import adventurers.
          This will preserve Guild and Quest Board data but replace all other adventurers.
        </p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="btn btn-success w-full"
        >
          {isImporting ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              <span>Importing People...</span>
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              <span>Upload People JSON File</span>
            </>
          )}
        </button>
        
        {importError && (
          <div className="mt-3 p-2 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md text-danger-400 text-sm flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{importError}</span>
          </div>
        )}
        
        {importSuccess && (
          <div className="mt-3 p-2 bg-success-900 bg-opacity-20 border border-success-800 rounded-md text-success-400 text-sm flex items-center">
            <Check size={16} className="mr-2" />
            <span>People imported successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleImporter;