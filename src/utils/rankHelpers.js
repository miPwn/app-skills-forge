/**
 * Gets a rank name based on primary score
 * @param {number} score - The primary score
 * @returns {string} - The corresponding rank name
 */
export const getRankName = (score) => {
  if (score >= 4.5) return "Grandmaster";
  if (score >= 3.5) return "Master";
  if (score >= 2.5) return "Adept";
  if (score >= 1.5) return "Journeyman";
  if (score >= 0.5) return "Apprentice";
  return "Novice";
};

/**
 * Calculates the primary score (guild rank) based on role and experience
 * @param {Object} adventurer - The adventurer object
 * @returns {number} - The calculated primary score
 */
export const calculatePrimaryScore = (adventurer) => {
  if (!adventurer) return 0;
  
  const primaryAreaScore = adventurer.primary_area_score || calculatePrimaryAreaScore(adventurer);
  const secondaryAreaScore = adventurer.secondary_area_score || calculateSecondaryAreaScore(adventurer);
  
  // Primary score is weighted average: 70% primary area, 30% secondary area
  const primaryScore = (primaryAreaScore * 0.7) + (secondaryAreaScore * 0.3);
  return parseFloat(primaryScore.toFixed(2));
};

/**
 * Calculates the primary area score based on the adventurer's role
 * @param {Object} adventurer - The adventurer object with skills and role
 * @returns {number} - The calculated primary area score
 */
export const calculatePrimaryAreaScore = (adventurer) => {
  if (!adventurer || !adventurer.skills) return 0;
  
  // Get the fundamental skills
  const fundamentalSkills = Object.values(adventurer.skills.Fundamental || {}).map(skill => skill.score);
  
  // Get role-specific skills
  let roleSkills = [];
  
  switch (adventurer.role) {
    case 'Front End':
      roleSkills = Object.values(adventurer.skills['Front-end'] || {}).map(skill => skill.score);
      break;
    case 'Back End':
      roleSkills = Object.values(adventurer.skills['Back-end'] || {}).map(skill => skill.score);
      break;
    case 'Full Stack':
      const frontEndSkills = Object.values(adventurer.skills['Front-end'] || {}).map(skill => skill.score);
      const backEndSkills = Object.values(adventurer.skills['Back-end'] || {}).map(skill => skill.score);
      roleSkills = [...frontEndSkills, ...backEndSkills];
      break;
    case 'AQA':
    case 'QA':
      roleSkills = Object.values(adventurer.skills['AQA'] || {}).map(skill => skill.score);
      break;
    case 'Dev Ops':
      roleSkills = Object.values(adventurer.skills['Cloud & DevOps'] || {}).map(skill => skill.score);
      break;
    default:
      roleSkills = [];
  }
  
  // Calculate the average
  const allSkills = [...fundamentalSkills, ...roleSkills];
  if (allSkills.length === 0) return 0;
  
  const sum = allSkills.reduce((total, score) => total + score, 0);
  return parseFloat((sum / allSkills.length).toFixed(2));
};

/**
 * Calculates the secondary area score based on all skills
 * @param {Object} adventurer - The adventurer object with skills
 * @returns {number} - The calculated secondary area score
 */
export const calculateSecondaryAreaScore = (adventurer) => {
  if (!adventurer || !adventurer.skills) return 0;
  
  let allSkills = [];
  
  // Gather all skills from all categories
  Object.values(adventurer.skills).forEach(category => {
    allSkills = [...allSkills, ...Object.values(category).map(skill => skill.score)];
  });
  
  if (allSkills.length === 0) return 0;
  
  const sum = allSkills.reduce((total, score) => total + score, 0);
  return parseFloat((sum / allSkills.length).toFixed(2));
};

export default {
  getRankName,
  calculatePrimaryScore,
  calculatePrimaryAreaScore,
  calculateSecondaryAreaScore
};