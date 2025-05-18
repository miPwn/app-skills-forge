/**
 * Creates a fantasy avatar URL based on the adventurer's name
 * @param {string} name - The adventurer's name
 * @returns {string} - URL for the avatar
 */
export const createAvatarUrl = (name) => {
  // Use the name as a seed for a consistent avatar
  const seed = encodeURIComponent(name || "unknown");
  // Using a more modern and reliable avatar service
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

export default {
  createAvatarUrl
};