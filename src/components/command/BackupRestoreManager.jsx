import React, { useState } from 'react';
import { Download, Upload, AlertCircle, Check, Loader, Database } from 'lucide-react';
import { useAdventurers } from '../../contexts/AdventurerContext';
import { logActivity } from './ActivityLog';

/**
 * Component for backing up and restoring all application data
 */
const BackupRestoreManager = () => {
  const { adventurers, getSkillMatrix, updateSkillMatrix } = useAdventurers();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Export all data to a JSON file
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      
      // Get the skill matrix data
      const skillMatrix = getSkillMatrix();
      
      // Create a backup object with all data
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        adventurers,
        skillMatrix
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(backupData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `guildforge_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      logActivity('Exported backup of all guild data', 'Guild Master');
      setExportSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Import data from a JSON file
  const handleImport = async (event) => {
    try {
      setIsImporting(true);
      setImportError(null);
      setImportSuccess(false);
      
      const file = event.target.files[0];
      if (!file) {
        setImportError('No file selected');
        return;
      }
      
      // Read the file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Parse the JSON data
          const importedData = JSON.parse(e.target.result);
          
          // Validate the data structure
          if (!importedData.adventurers || !importedData.skillMatrix) {
            setImportError('Invalid backup file format');
            return;
          }
          
          // Clear existing data in localStorage
          localStorage.removeItem('guildforge_adventurers');
          localStorage.removeItem('guildforge_skill_matrix');
          
          // Store the imported data
          localStorage.setItem('guildforge_adventurers', JSON.stringify(importedData.adventurers));
          localStorage.setItem('guildforge_skill_matrix', JSON.stringify(importedData.skillMatrix));
          
          logActivity('Imported backup data', 'Guild Master');
          setImportSuccess(true);
          
          // Reload the page to apply changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (error) {
          console.error('Error processing import file:', error);
          setImportError('Error processing the backup file');
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        setImportError('Error reading the file');
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
      setImportError('An unexpected error occurred');
      setIsImporting(false);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-medieval flex items-center">
          <Database size={20} className="mr-2 text-primary-400" />
          <span>Backup & Restore</span>
        </h2>
      </div>
      
      <div className="p-6">
        <p className="text-dark-300 mb-6">
          Export all guild data to a backup file or restore from a previous backup.
          This includes all adventurers, their skills, lore, and the skill matrix.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="bg-dark-750 rounded-lg p-4">
            <h3 className="text-lg font-medieval text-primary-300 mb-3">Export Data</h3>
            <p className="text-dark-400 text-sm mb-4">
              Download a backup file containing all guild data. Store this file safely to restore your data later if needed.
            </p>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn btn-primary w-full"
            >
              {isExporting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  <span>Export Backup</span>
                </>
              )}
            </button>
            
            {exportSuccess && (
              <div className="mt-3 p-2 bg-success-900 bg-opacity-20 border border-success-800 rounded-md text-success-400 text-sm flex items-center">
                <Check size={16} className="mr-2" />
                <span>Backup exported successfully!</span>
              </div>
            )}
          </div>
          
          {/* Import Section */}
          <div className="bg-dark-750 rounded-lg p-4">
            <h3 className="text-lg font-medieval text-danger-300 mb-3">Restore Data</h3>
            <p className="text-dark-400 text-sm mb-4">
              <strong className="text-danger-400">Warning:</strong> Restoring from a backup will replace all current data. This action cannot be undone.
            </p>
            
            <label className="btn btn-danger w-full cursor-pointer">
              {isImporting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  <span>Import Backup</span>
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
              />
            </label>
            
            {importError && (
              <div className="mt-3 p-2 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md text-danger-400 text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                <span>{importError}</span>
              </div>
            )}
            
            {importSuccess && (
              <div className="mt-3 p-2 bg-success-900 bg-opacity-20 border border-success-800 rounded-md text-success-400 text-sm flex items-center">
                <Check size={16} className="mr-2" />
                <span>Backup imported successfully! Reloading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestoreManager;