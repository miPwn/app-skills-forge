import pb from './pocketbase';
import { skillData } from '../data/skill-data';
import { calculatePrimaryAreaScore, calculateSecondaryAreaScore, calculatePrimaryScore } from '../utils/rankHelpers';

/**
 * Service for interacting with the adventurers collection in PocketBase
 */
class AdventurerService {
  /**
   * Initialize the database with sample data if it's empty
   */
  async initializeDatabase() {
    try {
      // Check if the adventurers collection is empty
      const records = await pb.collection('adventurers').getList(1, 1);
      
      if (records.totalItems === 0) {
        console.log('Initializing database with sample data...');
        
        // Process the sample data
        const enhancedData = skillData.map(adventurer => {
          // Calculate scores if missing
          const primary_area_score = adventurer.primary_area_score || calculatePrimaryAreaScore(adventurer);
          const secondary_area_score = adventurer.secondary_area_score || calculateSecondaryAreaScore(adventurer);
          const primary_score = adventurer.primary_score || calculatePrimaryScore({
            ...adventurer,
            primary_area_score,
            secondary_area_score
          });
          
          return {
            name: adventurer.name,
            role: adventurer.role,
            primary_area_score,
            secondary_area_score,
            primary_score,
            avatarUrl: adventurer.avatarUrl || null,
            skills: adventurer.skills,
            lore: ''
          };
        });
        
        // Insert the sample data
        for (const adventurer of enhancedData) {
          await pb.collection('adventurers').create(adventurer);
        }
        
        console.log('Database initialized with sample data.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  /**
   * Get all adventurers
   * @returns {Promise<Array>} - Array of adventurers
   */
  async getAll() {
    try {
      const records = await pb.collection('adventurers').getFullList({
        sort: '-primary_score'
      });
      
      return records;
    } catch (error) {
      console.error('Error getting adventurers:', error);
      return [];
    }
  }
  
  /**
   * Get an adventurer by ID
   * @param {string} id - The adventurer's ID
   * @returns {Promise<Object|null>} - The adventurer or null if not found
   */
  async getById(id) {
    try {
      const record = await pb.collection('adventurers').getOne(id);
      return record;
    } catch (error) {
      console.error(`Error getting adventurer with ID ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Get an adventurer by name
   * @param {string} name - The adventurer's name
   * @returns {Promise<Object|null>} - The adventurer or null if not found
   */
  async getByName(name) {
    try {
      const records = await pb.collection('adventurers').getList(1, 1, {
        filter: `name = "${name}"`
      });
      
      if (records.items.length > 0) {
        return records.items[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting adventurer ${name}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new adventurer
   * @param {Object} adventurer - The adventurer to create
   * @returns {Promise<Object|null>} - The created adventurer or null if failed
   */
  async create(adventurer) {
    try {
      const record = await pb.collection('adventurers').create(adventurer);
      return record;
    } catch (error) {
      console.error('Error creating adventurer:', error);
      return null;
    }
  }
  
  /**
   * Update an adventurer
   * @param {string} id - The adventurer's ID
   * @param {Object} data - The data to update
   * @returns {Promise<Object|null>} - The updated adventurer or null if failed
   */
  async update(id, data) {
    try {
      const record = await pb.collection('adventurers').update(id, data);
      return record;
    } catch (error) {
      console.error(`Error updating adventurer ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Delete an adventurer
   * @param {string} id - The adventurer's ID
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  async delete(id) {
    try {
      await pb.collection('adventurers').delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting adventurer ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Reset the database to the initial sample data
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  async resetToInitial() {
    try {
      // Delete all existing records
      const records = await pb.collection('adventurers').getFullList();
      
      for (const record of records) {
        await pb.collection('adventurers').delete(record.id);
      }
      
      // Re-initialize the database
      await this.initializeDatabase();
      
      return true;
    } catch (error) {
      console.error('Error resetting database:', error);
      return false;
    }
  }
}

export default new AdventurerService();