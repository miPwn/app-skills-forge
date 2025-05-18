/**
 * @typedef {Object} Skill
 * @property {number} score - Skill score (0-5)
 * @property {string} color - Color representing the skill level
 */

/**
 * @typedef {Object.<string, Skill>} SkillCategory
 * Object with skill names as keys and Skill objects as values
 */

/**
 * @typedef {Object} Adventurer
 * @property {string} name - Adventurer's name
 * @property {string} role - Adventurer's role/class
 * @property {number} primary_score - Guild rank score
 * @property {number} primary_area_score - Score in primary skill area
 * @property {number} secondary_area_score - Score in secondary skill areas
 * @property {Object.<string, SkillCategory>} skills - Skills organized by categories
 */

/**
 * @typedef {Object} User
 * @property {string} username - Username for authentication
 * @property {string} role - User role (admin, member, etc.)
 * @property {boolean} isAuthenticated - Authentication status
 */

/**
 * @typedef {Object} ActivityLog
 * @property {Date} timestamp - When the activity occurred
 * @property {string} action - Description of the action
 * @property {string} user - User who performed the action
 * @property {string} ipAddress - IP address of the user
 */

/**
 * @typedef {Object} SkillGap
 * @property {string} category - Skill category
 * @property {string} skill - Skill name
 * @property {number} averageScore - Average score across the team
 */

/**
 * @typedef {Object} Expert
 * @property {string} name - Expert's name
 * @property {string} role - Expert's role
 * @property {number} score - Expert's score in the skill
 */

export default {};