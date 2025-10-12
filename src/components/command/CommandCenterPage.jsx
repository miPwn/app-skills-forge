import React, { useState } from 'react';
import { Shield, X, Check, Users, Edit, RefreshCw, Loader, Grid, Database, UserPlus, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityLog, { logActivity } from './ActivityLog';
import LoreEditor from './LoreEditor';
import SkillEditor from './SkillEditor';
import ProfileImageEditor from './ProfileImageEditor';
import MatrixEditor from './MatrixEditor';
import PeopleManager from './PeopleManager';
import BackupRestoreManager from './BackupRestoreManager';
import PeopleImporter from './PeopleImporter';
import PeopleExporter from './PeopleExporter';
import { ADMIN_PASSWORD } from '../../utils/constants';
import { useAdventurers } from '../../contexts/AdventurerContext';
import ErrorBoundary from '../shared/ErrorBoundary';

/**
 * Command Center page component for admin functions
 */
const CommandCenterPage = () => {
  const { adventurers, updateAdventurer, resetToInitial, loading, getSkillMatrix, updateSkillMatrix } = useAdventurers();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedAdventurer, setSelectedAdventurer] = useState(null);
  const [activeTab, setActiveTab] = useState('lore'); // 'lore', 'skills', or 'image'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isMatrixEditorOpen, setIsMatrixEditorOpen] = useState(false);
  const [showPeopleManager, setShowPeopleManager] = useState(false);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password && ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      logActivity('Logged into command center');
    } else {
      setAuthError('Incorrect passphrase. Access denied!');
    }
  };
  
  const handleSaveImage = async (imageUrl) => {
    if (!selectedAdventurer) return;
    
    const updatedAdventurer = {
      ...selectedAdventurer,
      avatarUrl: imageUrl
    };
    
    updateAdventurer(selectedAdventurer.id, updatedAdventurer);
    setSelectedAdventurer({...selectedAdventurer, avatarUrl: imageUrl});
    logActivity(`Updated profile image for ${selectedAdventurer.name}`);
    showSaveSuccess();
  };
  
  const handleSaveLore = async (lore) => {
    if (!selectedAdventurer) return;
    
    const updatedAdventurer = {
      ...selectedAdventurer,
      lore
    };
    
    updateAdventurer(selectedAdventurer.id, updatedAdventurer);
    setSelectedAdventurer({...selectedAdventurer, lore});
    logActivity(`Updated lore for ${selectedAdventurer.name}`);
    showSaveSuccess();
  };
  
  const handleSaveSkills = async (updatedSkills) => {
    if (!selectedAdventurer) return;
    
    const updatedAdventurer = {
      ...selectedAdventurer,
      skills: updatedSkills
    };
    
    updateAdventurer(selectedAdventurer.id, updatedAdventurer);
    setSelectedAdventurer({...selectedAdventurer, skills: updatedSkills});
    logActivity(`Updated skills for ${selectedAdventurer.name}`);
    showSaveSuccess();
  };
  
  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleMatrixSave = (matrix) => {
    logActivity('Updated skill matrix', 'Guild Master');
    showSaveSuccess();
    setIsMatrixEditorOpen(false);
  };

  const handleReset = async () => {
    if (resetConfirm) {
      setIsResetting(true);
      try {
        // Clear localStorage first to ensure we're not using cached data
        localStorage.removeItem('guildforge_adventurers');
        
        // Then reset to initial data
        const success = resetToInitial();
        
        if (success) {
          setResetConfirm(false);
          logActivity('Reset database to initial data', 'Guild Master');
          showSaveSuccess();
          setSelectedAdventurer(null);
          
          // Force a page reload to ensure everything is refreshed
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('Error resetting data:', error);
      } finally {
        setIsResetting(false);
      }
    } else {
      setResetConfirm(true);
      setTimeout(() => {
        setResetConfirm(false);
      }, 5000);
    }
  };
  
  const filteredAdventurers = adventurers.filter(
    adv => adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );
  
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div 
          className="card max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <Shield size={48} className="text-danger-500 mx-auto mb-4" />
              <h1 className="text-2xl font-medieval text-danger-400 mb-2">Command Center</h1>
              <p className="text-dark-300 text-sm">
                Only guild leaders may access this area. Please enter the sacred passphrase.
              </p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="label">Sacred Passphrase</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter the passphrase..."
                />
              </div>
              
              {authError && (
                <div className="mb-4 p-3 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md text-danger-400 text-sm">
                  {authError}
                </div>
              )}
              
              <button type="submit" className="btn btn-danger w-full">
                <Shield size={16} className="mr-2" />
                <span>Enter Command Center</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Loader size={48} className="text-primary-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-medieval text-primary-300 mb-2">Loading Guild Data...</h2>
          <p className="text-dark-400">Retrieving adventurers and their skills</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-block bg-dark-800 rounded-full px-4 py-1 text-danger-400 text-sm mb-2">
          Restricted Access
        </div>
        <h1 className="text-3xl md:text-4xl font-medieval text-danger-300 mb-2">Guild Command Center</h1>
        <p className="text-dark-300 max-w-2xl mx-auto">
          Welcome, Guild Leader. From here you can manage adventurers, edit their skills and lore,
          and view guild activity logs.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setIsMatrixEditorOpen(true)}
            className="btn btn-primary"
          >
            <Grid size={16} className="mr-2" />
            <span>Edit Skill Matrix</span>
          </button>
          
          <button
            onClick={() => setShowPeopleManager(true)}
            className="btn btn-success"
          >
            <UserPlus size={16} className="mr-2" />
            <span>Manage People</span>
          </button>
          
          <button
            onClick={() => window.location.href = '#backup-restore'}
            className="btn btn-warning"
          >
            <Save size={16} className="mr-2" />
            <span>Backup & Restore</span>
          </button>
        </div>
      </motion.div>
      
      {saveSuccess && (
        <motion.div 
          className="fixed top-4 right-4 z-50 bg-success-800 text-success-100 px-4 py-2 rounded-md flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Check size={16} className="mr-2" />
          <span>Changes saved successfully!</span>
        </motion.div>
      )}
      
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card-header flex justify-between items-center">
                <h2 className="font-medieval flex items-center">
                  <Users size={20} className="mr-2 text-danger-400" />
                  <span>Adventurers</span>
                </h2>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    isResetting ? 'bg-dark-600 text-dark-500' :
                    resetConfirm
                      ? 'bg-danger-600 text-white font-bold'
                      : 'bg-danger-700 text-white hover:bg-danger-600'
                  } transition-colors`}
                  title="Reset to initial data"
                >
                  {isResetting ? (
                    <Loader size={20} className="animate-spin mr-2" />
                  ) : (
                    <RefreshCw size={20} className="mr-2" />
                  )}
                  <span className="font-bold">Reset Data</span>
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh]">
                {filteredAdventurers.map((adv, index) => (
                  <button
                    key={adv.id}
                    onClick={() => {
                      setSelectedAdventurer(adv);
                      setActiveTab('lore');
                    }}
                    className={`w-full text-left p-4 flex items-center hover:bg-dark-750 transition-colors ${
                      selectedAdventurer?.id === adv.id ? 'bg-dark-700' : 
                      index % 2 === 0 ? 'bg-dark-800' : ''
                    } border-b border-dark-700`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{adv.name}</div>
                      <div className="text-xs text-dark-400">{adv.role}</div>
                    </div>
                    <Edit size={16} className="text-dark-500" />
                  </button>
                ))}
              </div>
              
              {resetConfirm && (
                <div className="p-4 bg-danger-900 bg-opacity-30 border-t border-danger-800 text-danger-300 text-center">
                  <p className="font-bold mb-2 text-lg">Are you sure?</p>
                  <p className="mb-3">This will reset all skills and lore to their initial state.</p>
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="btn bg-danger-600 text-white hover:bg-danger-700 font-bold"
                  >
                    {isResetting ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        <span>Confirm Reset</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedAdventurer ? (
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="card-header flex justify-between items-center">
                  <h2 className="font-medieval">Managing: {selectedAdventurer.name}</h2>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab('lore')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeTab === 'lore'
                          ? 'bg-danger-700 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      } transition-colors`}
                    >
                      Lore
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeTab === 'skills'
                          ? 'bg-danger-700 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      } transition-colors`}
                    >
                      Skills
                    </button>
                    <button
                      onClick={() => setActiveTab('image')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeTab === 'image'
                          ? 'bg-danger-700 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      } transition-colors`}
                    >
                      Image
                    </button>
                    <button
                      onClick={() => setSelectedAdventurer(null)}
                      className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {activeTab === 'lore' ? (
                    <LoreEditor 
                      adventurer={selectedAdventurer} 
                      onSave={handleSaveLore}
                    />
                  ) : activeTab === 'skills' ? (
                    <SkillEditor 
                      adventurer={selectedAdventurer} 
                      onSave={handleSaveSkills}
                    />
                  ) : (
                    <ProfileImageEditor
                      adventurer={selectedAdventurer}
                      onSave={handleSaveImage}
                    />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="card flex items-center justify-center p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div>
                  <Shield size={48} className="text-dark-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medieval text-dark-300 mb-2">Select an Adventurer</h3>
                  <p className="text-dark-400 text-sm">
                    Choose an adventurer from the list to edit their details.
                  </p>
                </div>
              </motion.div>
            )}
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ActivityLog />
            </motion.div>
            
            <motion.div
              id="backup-restore"
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <BackupRestoreManager />
            </motion.div>
            
            <motion.div
              id="people-importer"
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <PeopleImporter />
            </motion.div>
            
            <motion.div
              id="people-exporter"
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <PeopleExporter />
            </motion.div>
          </div>
        </div>
      </ErrorBoundary>
      
      {isMatrixEditorOpen && (
        <div className="fixed inset-0 bg-dark-900 bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <MatrixEditor
              onSave={handleMatrixSave}
              onClose={() => setIsMatrixEditorOpen(false)}
            />
          </div>
        </div>
      )}
      
      {showPeopleManager && (
        <div className="fixed inset-0 bg-dark-900 bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-xl font-medieval text-success-300">People Manager</h2>
              <button
                onClick={() => setShowPeopleManager(false)}
                className="p-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <PeopleManager />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandCenterPage;