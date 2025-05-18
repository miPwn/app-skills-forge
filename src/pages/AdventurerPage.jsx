import React from 'react';
import AdventurerCard from '../components/adventurer/AdventurerCard';

const AdventurerPage = ({ adventurers }) => {
  return <AdventurerCard adventurers={adventurers} />;
};

export default AdventurerPage;