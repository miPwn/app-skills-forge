import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateLore } from '../../utils/helpers';
import { ROLE_TITLES, LORE_PROMPTS } from '../../utils/constants';

const LoreEditor = ({ adventurer, onSave }) => {
  const [lore, setLore] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState(
    LORE_PROMPTS[Math.floor(Math.random() * LORE_PROMPTS.length)]
  );
  
  const handleGenerateLore = () => {
    setIsGenerating(true);
    
    // In a real app, this might use AI to generate lore
    setTimeout(() => {
      const generatedLore = generateLore(adventurer, ROLE_TITLES);
      setLore(generatedLore);
      setIsGenerating(false);
      
      // Generate a new prompt
      setRandomPrompt(LORE_PROMPTS[Math.floor(Math.random() * LORE_PROMPTS.length)]);
    }, 1500);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medieval text-primary-300">Character Lore</h3>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleGenerateLore}
            disabled={isGenerating}
            className={`btn ${isGenerating ? 'bg-dark-600 cursor-wait' : 'btn-secondary'}`}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                <span>Weaving tale...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                <span>Generate Lore</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => onSave(lore)}
            disabled={!lore || isGenerating}
            className="btn btn-primary"
          >
            <Save size={16} className="mr-2" />
            <span>Save</span>
          </button>
        </div>
      </div>
      
      <div className="card-parchment mb-4">
        <div className="p-4 bg-dark-300 bg-opacity-20 border-b border-dark-400 flex items-center">
          <span className="text-dark-800 text-sm italic">
            {randomPrompt}
          </span>
        </div>
        
        <textarea
          value={lore}
          onChange={(e) => setLore(e.target.value)}
          className="w-full h-64 p-4 bg-transparent text-dark-900 focus:outline-none resize-none font-fantasy"
          placeholder="Write the adventurer's tale here... or generate one automatically."
        />
      </div>
      
      <motion.div
        className="rounded-md p-4 bg-dark-300 bg-opacity-20 text-dark-700 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-medium mb-1">Lore Writing Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Include references to the adventurer's strongest skills</li>
          <li>Mention their class role in the guild</li>
          <li>Add some personal character traits or backstory</li>
          <li>Write in a fantasy style with medieval terminology</li>
          <li>Keep it between 100-300 words for best readability</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default LoreEditor;