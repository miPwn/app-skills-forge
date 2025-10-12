import React, { useState } from 'react';
import { Download, Loader, Check, AlertCircle } from 'lucide-react';
import { useAdventurers } from '../../contexts/AdventurerContext';
import { logActivity } from './ActivityLog';

/**
 * Component for exporting people to a JSON file in the format of people.json
 */
const PeopleExporter = () => {
  const { adventurers } = useAdventurers();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);
  
  // Export people to a JSON file
  const handleExportPeople = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      setExportSuccess(false);
      
      // Filter out Guild and Quest Board
      const filteredAdventurers = adventurers.filter(
        adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
      );
      
      // Convert hierarchical skills structure to flat structure
      const exportData = filteredAdventurers.map(person => {
        // Create a flat skills object
        const flatSkills = {};
        
        // Process each skill area
        Object.entries(person.skills).forEach(([areaName, areaSkills]) => {
          // Add each skill to the flat structure
          Object.entries(areaSkills).forEach(([skillName, skillData]) => {
            flatSkills[skillName] = {
              score: skillData.score || 0
            };
          });
        });
        
        // Return the person with flat skills structure
        return {
          name: person.name,
          role: person.role,
          skills: flatSkills
        };
      });
      
      // Create a Blob with the JSON data
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'people.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      logActivity('Exported people to JSON file', 'Guild Master');
      setExportSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error exporting people:', error);
      setExportError(`Error exporting people: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-medieval flex items-center">
          <Download size={20} className="mr-2 text-primary-400" />
          <span>Export People</span>
        </h2>
      </div>
      
      <div className="p-6">
        <p className="text-dark-300 mb-6">
          Export all current adventurers to a JSON file in the format of people.json.
          This file can be used for backup or to import into another instance.
        </p>
        
        <button
          onClick={handleExportPeople}
          disabled={isExporting}
          className="btn btn-primary w-full"
        >
          {isExporting ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              <span>Exporting People...</span>
            </>
          ) : (
            <>
              <Download size={16} className="mr-2" />
              <span>Export People to JSON</span>
            </>
          )}
        </button>
        
        {exportError && (
          <div className="mt-3 p-2 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md text-danger-400 text-sm flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{exportError}</span>
          </div>
        )}
        
        {exportSuccess && (
          <div className="mt-3 p-2 bg-success-900 bg-opacity-20 border border-success-800 rounded-md text-success-400 text-sm flex items-center">
            <Check size={16} className="mr-2" />
            <span>People exported successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleExporter;