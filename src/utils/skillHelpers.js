import { SKILL_LEVELS } from './constants';

/**
 * Gets the color for a skill score
 * @param {number} score - The skill score (0-5)
 * @returns {string} - The corresponding color 
 */
export const getSkillColor = (score) => {
  return SKILL_LEVELS[score]?.color || "#808080"; // Gray for unknown
};

/**
 * Identifies skill gaps (scores <= 1) from a team's average
 * @param {Array} adventurers - The list of all adventurers
 * @returns {Object} - Object with categories and skills that have gaps
 */
export const identifySkillGaps = (adventurers) => {
  // Filter out special entries like team average
  const realAdventurers = adventurers.filter(adv => 
    adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );
  
  if (realAdventurers.length === 0) return {};
  
  const gaps = {};
  const skillCounts = {};
  const skillSums = {};
  
  // Gather all skills and their scores
  realAdventurers.forEach(adventurer => {
    Object.entries(adventurer.skills).forEach(([category, skills]) => {
      if (!gaps[category]) {
        gaps[category] = {};
        skillCounts[category] = {};
        skillSums[category] = {};
      }
      
      Object.entries(skills).forEach(([skillName, skill]) => {
        if (!skillCounts[category][skillName]) {
          skillCounts[category][skillName] = 0;
          skillSums[category][skillName] = 0;
        }
        
        skillCounts[category][skillName]++;
        skillSums[category][skillName] += skill.score;
      });
    });
  });
  
  // Calculate averages and identify gaps
  Object.entries(skillSums).forEach(([category, skills]) => {
    Object.entries(skills).forEach(([skillName, sum]) => {
      const count = skillCounts[category][skillName];
      const average = sum / count;
      
      // Consider it a gap if average is <= 1
      if (average <= 1) {
        if (!gaps[category]) gaps[category] = {};
        gaps[category][skillName] = average;
      }
    });
  });
  
  return gaps;
};

/**
 * Finds top experts (score >= 4) for each skill
 * @param {Array} adventurers - The list of all adventurers
 * @returns {Object} - Object with categories, skills, and experts
 */
export const findTopExperts = (adventurers) => {
  // Filter out special entries
  const realAdventurers = adventurers.filter(adv => 
    adv.role !== 'Guild' && adv.role !== 'Quest Board'
  );
  
  if (realAdventurers.length === 0) return {};
  
  const experts = {};
  
  // Identify experts for each skill
  realAdventurers.forEach(adventurer => {
    Object.entries(adventurer.skills).forEach(([category, skills]) => {
      if (!experts[category]) {
        experts[category] = {};
      }
      
      Object.entries(skills).forEach(([skillName, skill]) => {
        // Expert level is 4 or 5
        if (skill.score >= 4) {
          if (!experts[category][skillName]) {
            experts[category][skillName] = [];
          }
          
          experts[category][skillName].push({
            name: adventurer.name,
            role: adventurer.role,
            score: skill.score
          });
        }
      });
    });
  });
  
  // Sort experts by score for each skill
  Object.entries(experts).forEach(([category, skills]) => {
    Object.entries(skills).forEach(([skillName, skillExperts]) => {
      experts[category][skillName] = skillExperts.sort((a, b) => b.score - a.score);
    });
  });
  
  return experts;
};

export default {
  getSkillColor,
  identifySkillGaps,
  findTopExperts
};