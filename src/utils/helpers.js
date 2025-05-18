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
 * Gets the color for a skill score
 * @param {number} score - The skill score (0-5)
 * @returns {string} - The corresponding color 
 */
export const getSkillColor = (score) => {
  switch (score) {
    case 0: return "#FF0000"; // Red
    case 1: return "#FF4500"; // Dark Orange
    case 2: return "#FFA500"; // Orange
    case 3: return "#FFFF00"; // Yellow
    case 4: return "#ADFF2F"; // Green-Yellow
    case 5: return "#008000"; // Green
    default: return "#808080"; // Gray for unknown
  }
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

/**
 * Generates a random title based on the adventurer's role
 * @param {string} role - The adventurer's role
 * @returns {string} - A randomly selected title
 */
export const generateTitle = (role, titles) => {
  if (!role || !titles[role]) return "Wandering Adventurer";
  
  const roleTitles = titles[role];
  return roleTitles[Math.floor(Math.random() * roleTitles.length)];
};

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

/**
 * Generates lore for an adventurer based on their skills and role
 * @param {Object} adventurer - The adventurer object
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
 * Creates a mock activity log for the command center
 * @returns {Array} - Array of activity log entries
 */
export const generateActivityLog = () => {
  const now = new Date();
  
  return [
    {
      timestamp: new Date(now.getTime() - 5 * 60 * 1000),
      action: "Updated lore for Nazir Ahmed",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      timestamp: new Date(now.getTime() - 15 * 60 * 1000),
      action: "Updated skills for Leroy Tomlin",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      timestamp: new Date(now.getTime() - 60 * 60 * 1000),
      action: "Logged into command center",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      action: "Generated lore for Akash Bumiya",
      user: "Guild Scribe",
      ipAddress: "192.168.1.2"
    },
    {
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      action: "Added new adventurer: Chris Nash",
      user: "Guild Master",
      ipAddress: "192.168.1.3"
    }
  ];
};