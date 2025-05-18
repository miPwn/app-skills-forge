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
  const { findAdventurerById } = useAdventurers();
  const adventurer = findAdventurerById(id);
  
  return (
    <ErrorBoundary>
      <AdventurerCard adventurerId={id} />
    </ErrorBoundary>
  );
};

export default AdventurerPage;