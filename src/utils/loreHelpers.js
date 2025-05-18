import { getRankName } from './rankHelpers';

/**
 * Gets a class description based on role
 * @param {string} role - The adventurer's role
 * @returns {string} - Description of the class
 */
export const getClassDescription = (role) => {
  const descriptions = {
    "Front End": "Artisans who craft the visible realms that users interact with, wielding HTML, CSS, and JavaScript to create magical experiences.",
    "Back End": "Masters of the hidden realms, they command servers and databases to power the digital world from behind the scenes.",
    "Full Stack": "Versatile mages who have mastered both the visible and hidden arts, capable of crafting complete digital experiences.",
    "Dev Ops": "Keepers of infrastructure and deployment rituals, they ensure the smooth operation of digital realms.",
    "AQA": "Guardians of quality who test the fabric of applications to find weaknesses before they can cause harm.",
    "QA": "Guardians of quality who test the fabric of applications to find weaknesses before they can cause harm.",
    "Guild": "Keepers of knowledge who maintain records of all members and their collective skills.",
    "Quest Board": "Indicators of challenges that the guild must overcome to strengthen its collective knowledge."
  };
  
  return descriptions[role] || "Wanderers who seek to master various digital arts.";
};

/**
 * Generates a random title based on the adventurer's role
 * @param {string} role - The adventurer's role
 * @param {Object} titles - Object containing titles for each role
 * @returns {string} - A randomly selected title
 */
export const generateTitle = (role, titles) => {
  if (!role || !titles[role]) return "Wandering Adventurer";
  
  const roleTitles = titles[role];
  return roleTitles[Math.floor(Math.random() * roleTitles.length)];
};

/**
 * Generates lore for an adventurer based on their skills and role
 * @param {Object} adventurer - The adventurer object
 * @param {Object} roleTitles - Object containing titles for each role
 * @returns {string} - Generated lore text
 */
export const generateLore = (adventurer, roleTitles) => {
  if (!adventurer) return "";
  
  const name = adventurer.name || "The Nameless One";
  const role = adventurer.role || "Wanderer";
  const title = generateTitle(role, roleTitles);
  
  // Find top skills (score >= 3)
  const topSkills = [];
  Object.entries(adventurer.skills).forEach(([category, skills]) => {
    Object.entries(skills).forEach(([skillName, skill]) => {
      if (skill.score >= 3) {
        topSkills.push({ name: skillName, score: skill.score });
      }
    });
  });
  
  // Sort by score descending and take top 3
  const featuredSkills = topSkills
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(skill => skill.name);
  
  const primaryScore = adventurer.primary_score || 0;
  const rankName = getRankName(primaryScore);
  
  // Generate backstory intro based on role
  const backstoryIntros = {
    "Front End": [
      `began as an apprentice in the Guild of Visual Arts`,
      `discovered their talent for crafting beautiful interfaces at a young age`,
      `studied under the great screen weavers of the Eastern Kingdoms`
    ],
    "Back End": [
      `mastered the arcane arts of server manipulation in the hidden monasteries`,
      `was taught the secrets of data flow by the Database Druids`,
      `forged their first algorithm in the depths of the Code Caverns`
    ],
    "Full Stack": [
      `trained in both the visible and hidden arts of the digital realm`,
      `studied the ancient tomes of Front and Back magical traditions`,
      `was blessed by the Code Spirits with versatility beyond measure`
    ],
    "Dev Ops": [
      `learned to command the clouds from the Mountain Sages`,
      `was entrusted with the sacred deployment rituals`,
      `apprenticed with the Keepers of Infrastructure`
    ],
    "AQA": [
      `developed vision beyond sight to detect the smallest of flaws`,
      `joined the Order of Quality at a young age`,
      `was known for their uncanny ability to find weaknesses in any system`
    ],
    "QA": [
      `developed vision beyond sight to detect the smallest of flaws`,
      `joined the Order of Quality at a young age`,
      `was known for their uncanny ability to find weaknesses in any system`
    ]
  };
  
  const backstory = backstoryIntros[role] ? 
    backstoryIntros[role][Math.floor(Math.random() * backstoryIntros[role].length)] :
    `journeyed far and wide gathering knowledge of many skills`;
  
  // Generate achievement text based on top skills
  let achievements = "";
  if (featuredSkills.length > 0) {
    achievements = "Their most renowned feats include ";
    
    featuredSkills.forEach((skill, index) => {
      const featTemplates = [
        `mastering the art of ${skill}`,
        `becoming a legendary figure in the realm of ${skill}`,
        `pioneering new techniques in ${skill}`
      ];
      
      const feat = featTemplates[Math.floor(Math.random() * featTemplates.length)];
      
      if (index === 0) {
        achievements += feat;
      } else if (index === featuredSkills.length - 1) {
        achievements += ` and ${feat}.`;
      } else {
        achievements += `, ${feat}`;
      }
    });
  } else {
    achievements = "They are still early in their journey, with legendary feats yet to be written.";
  }
  
  // Assemble the lore
  return `# The Legend of ${name}

${name}, known throughout the realms as "${title}," ${backstory}. 

As a distinguished member of the ${role} class and a ${rankName} of the Guild, they have earned renown for their technical prowess and dedication to their craft.

${achievements}

With a Guild Rank of ${adventurer.primary_score?.toFixed(1) || "unknown"}, they continue to hone their skills while sharing knowledge with apprentices who seek their guidance.

Currently, they serve the Guild by taking on challenges that would overwhelm lesser adventurers, always seeking to expand their mastery of the digital arcane.`;
};

export default {
  getClassDescription,
  generateTitle,
  generateLore
};