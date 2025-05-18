import React from 'react';
import { useParams } from 'react-router-dom';
import AdventurerCard from '../components/adventurer/AdventurerCard';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { useAdventurers } from '../contexts/AdventurerContext';

/**
 * Adventurer profile page component
 */
const AdventurerPage = () => {
  const { id } = useParams();
  const { adventurers, findAdventurerById } = useAdventurers();
  
  // Try to find by ID first
  const adventurer = findAdventurerById(id);
  
  console.log('AdventurerPage - ID:', id);
  console.log('AdventurerPage - Found by ID:', adventurer);
  console.log('AdventurerPage - All adventurers:', adventurers);
  
  if (!adventurer) {
    console.log('Adventurer not found, trying to find by name or ID match');
    // If not found by exact ID, try to find by partial match or name
    const foundAdventurer = adventurers.find(adv =>
      (adv.id && id && adv.id.includes(id)) ||
      (adv.name && id && adv.name.toLowerCase().includes(id.toLowerCase()))
    );
    
    if (foundAdventurer) {
      console.log('Found by alternative match:', foundAdventurer);
      return (
        <ErrorBoundary>
          <AdventurerCard adventurerId={foundAdventurer.id} />
        </ErrorBoundary>
      );
    }
  }
  
  return (
    <ErrorBoundary>
      <AdventurerCard adventurerId={id} />
    </ErrorBoundary>
  );
};

export default AdventurerPage;