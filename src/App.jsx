import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GuildHallPage from './pages/GuildHallPage';
import AdventurerPage from './pages/AdventurerPage';
import HallOfLegendsPage from './pages/HallOfLegendsPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import TavernTalkPage from './pages/TavernTalkPage';
import CommandCenterPage from './components/command/CommandCenterPage';
import { AdventurerProvider } from './contexts/AdventurerContext';
import ErrorBoundary from './components/shared/ErrorBoundary';

/**
 * Main application component
 */
function App() {
  return (
    <ErrorBoundary>
      <AdventurerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="guild-hall" element={<GuildHallPage />} />
              <Route path="adventurer/:id" element={<AdventurerPage />} />
              <Route path="hall-of-legends" element={<HallOfLegendsPage />} />
              <Route path="leaderboards" element={<LeaderboardsPage />} />
              <Route path="tavern-talk" element={<TavernTalkPage />} />
              <Route path="command-center" element={<CommandCenterPage />} />
            </Route>
          </Routes>
        </Router>
      </AdventurerProvider>
    </ErrorBoundary>
  );
}

export default App;