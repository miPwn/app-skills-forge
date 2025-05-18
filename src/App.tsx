import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GuildHallPage from './pages/GuildHallPage';
import AdventurerPage from './pages/AdventurerPage';
import HallOfLegendsPage from './pages/HallOfLegendsPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import TavernTalkPage from './pages/TavernTalkPage';
import CommandCenterPage from './pages/CommandCenterPage';
import { skillData } from './data/skill-data';
import { calculatePrimaryAreaScore, calculateSecondaryAreaScore, calculatePrimaryScore } from './utils/helpers';

function App() {
  const [adventurers, setAdventurers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Initialize data
    const enhancedData = skillData.map(adventurer => {
      // If scores are missing, calculate them
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
        primary_score,
        avatarUrl: adventurer.avatarUrl || null // Support for custom avatars
      };
    });
    
    setAdventurers(enhancedData);
    setLoading(false);
  }, []);
  
  const handleUpdateAdventurer = (updatedAdventurer) => {
    // Calculate new scores
    const primary_area_score = calculatePrimaryAreaScore(updatedAdventurer);
    const secondary_area_score = calculateSecondaryAreaScore(updatedAdventurer);
    const primary_score = calculatePrimaryScore({
      ...updatedAdventurer,
      primary_area_score,
      secondary_area_score
    });
    
    const enhanced = {
      ...updatedAdventurer,
      primary_area_score,
      secondary_area_score,
      primary_score
    };
    
    // Update the adventurer in the array
    setAdventurers(prev => 
      prev.map(adv => adv.name === enhanced.name ? enhanced : adv)
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-slow">⚔️</div>
          <h2 className="text-2xl font-medieval text-primary-300 mb-2">Assembling the Guild...</h2>
          <p className="text-dark-400">Gathering adventurers and their skills</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="guild-hall" element={<GuildHallPage adventurers={adventurers} />} />
          <Route path="adventurer/:id" element={<AdventurerPage adventurers={adventurers} />} />
          <Route path="hall-of-legends" element={<HallOfLegendsPage adventurers={adventurers} />} />
          <Route path="leaderboards" element={<LeaderboardsPage adventurers={adventurers} />} />
          <Route path="tavern-talk" element={<TavernTalkPage adventurers={adventurers} />} />
          <Route path="command-center" element={
            <CommandCenterPage 
              adventurers={adventurers} 
              onUpdateAdventurer={handleUpdateAdventurer} 
            />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;