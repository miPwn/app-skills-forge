import pb from './pocketbase';

/**
 * Service for interacting with the activity_logs collection in PocketBase
 */
class ActivityLogService {
  /**
   * Get all activity logs
   * @param {number} limit - Maximum number of logs to return
   * @returns {Promise<Array>} - Array of activity logs
   */
  async getAll(limit = 10) {
    try {
      const records = await pb.collection('activity_logs').getList(1, limit, {
        sort: '-timestamp'
      });
      
      return records.items;
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return [];
    }
  }
  
  /**
   * Create a new activity log
   * @param {Object} log - The activity log to create
   * @returns {Promise<Object|null>} - The created log or null if failed
   */
  async create(log) {
    try {
      // Ensure timestamp is set
      const logWithTimestamp = {
        ...log,
        timestamp: log.timestamp || new Date().toISOString()
      };
      
      const record = await pb.collection('activity_logs').create(logWithTimestamp);
      return record;
    } catch (error) {
      console.error('Error creating activity log:', error);
      return null;
    }
  }
  
  /**
   * Generate a mock activity log for testing
   * @returns {Promise<Array>} - Array of mock activity logs
   */
  async generateMockLogs() {
    try {
      const now = new Date();
      
      const mockLogs = [
        {
          timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
          action: "Updated lore for Nazir Ahmed",
          user: "Guild Leader",
          ipAddress: "192.168.1.1"
        },
        {
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          action: "Updated skills for Leroy Tomlin",
          user: "Guild Leader",
          ipAddress: "192.168.1.1"
        },
        {
          timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
          action: "Logged into command center",
          user: "Guild Leader",
          ipAddress: "192.168.1.1"
        },
        {
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          action: "Generated lore for Akash Bumiya",
          user: "Guild Scribe",
          ipAddress: "192.168.1.2"
        },
        {
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          action: "Added new adventurer: Chris Nash",
          user: "Guild Master",
          ipAddress: "192.168.1.3"
        }
      ];
      
      // Check if there are any existing logs
      const existingLogs = await this.getAll(1);
      
      if (existingLogs.length === 0) {
        // Insert mock logs
        for (const log of mockLogs) {
          await this.create(log);
        }
      }
      
      return await this.getAll();
    } catch (error) {
      console.error('Error generating mock logs:', error);
      return [];
    }
  }
  
  /**
   * Log an activity
   * @param {string} action - The action performed
   * @param {string} user - The user who performed the action
   * @param {string} ipAddress - The IP address of the user
   * @returns {Promise<Object|null>} - The created log or null if failed
   */
  async logActivity(action, user = 'Guild Leader', ipAddress = '127.0.0.1') {
    return await this.create({
      timestamp: new Date().toISOString(),
      action,
      user,
      ipAddress
    });
  }
}

export default new ActivityLogService();