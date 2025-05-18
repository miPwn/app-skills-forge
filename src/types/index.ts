/**
 * Skill level definition
 */
export interface SkillLevel {
  title: string;
  description: string;
  color: string;
}

/**
 * Skill definition
 */
export interface Skill {
  score: number;
  color: string;
}

/**
 * Skills by category
 */
export interface SkillCategory {
  [skillName: string]: Skill;
}

/**
 * Skills by category
 */
export interface Skills {
  [category: string]: SkillCategory;
}

/**
 * Adventurer definition
 */
export interface Adventurer {
  name: string;
  role: string;
  primary_score: number;
  primary_area_score: number;
  secondary_area_score: number;
  skills: Skills;
}

/**
 * Expert definition
 */
export interface Expert {
  name: string;
  role: string;
  score: number;
}

/**
 * Experts by skill
 */
export interface SkillExperts {
  [skillName: string]: Expert[];
}

/**
 * Experts by category
 */
export interface CategoryExperts {
  [category: string]: SkillExperts;
}

/**
 * Skill gaps by category
 */
export interface SkillGaps {
  [category: string]: {
    [skillName: string]: number;
  };
}

/**
 * Activity log entry
 */
export interface ActivityLogEntry {
  timestamp: Date;
  action: string;
  user: string;
  ipAddress: string;
}

/**
 * Role titles
 */
export interface RoleTitles {
  [role: string]: string[];
}

/**
 * Class emblems
 */
export interface ClassEmblems {
  [role: string]: string;
}