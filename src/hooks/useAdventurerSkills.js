import { useMemo } from 'react';

/**
 * Custom hook to extract and sort top skills from an adventurer
 * 
 * @param {Object} adventurer - The adventurer object with skills
 * @param {number} minScore - Minimum score to consider (default: 3)
 * @param {number} limit - Maximum number of skills to return (default: 3)
 * @returns {Array} - Array of top skills sorted by score
 */
export const useAdventurerSkills = (adventurer, minScore = 3, limit = 3) => {
  return useMemo(() => {
    if (!adventurer || !adventurer.skills) {
      return [];
    }
    
    // Get skills with score >= minScore
    const topSkills = [];
    Object.entries(adventurer.skills).forEach(([category, skills]) => {
      Object.entries(skills).forEach(([skillName, skill]) => {
        if (skill.score >= minScore) {
          topSkills.push({ 
            name: skillName, 
            score: skill.score, 
            color: skill.color,
            category
          });
        }
      });
    });
    
    // Sort by score descending and take top 'limit'
    return topSkills
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [adventurer, minScore, limit]);
};

export default useAdventurerSkills;