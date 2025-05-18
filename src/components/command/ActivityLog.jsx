import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

// Local storage key
const ACTIVITY_LOG_KEY = 'guildforge_activity_logs';

// Generate mock activity logs
const generateMockLogs = () => {
  const now = new Date();
  
  return [
    {
      id: 'log-1',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      action: "Updated lore for Nazir Ahmed",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      id: 'log-2',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      action: "Updated skills for Leroy Tomlin",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      id: 'log-3',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      action: "Logged into command center",
      user: "Guild Leader",
      ipAddress: "192.168.1.1"
    },
    {
      id: 'log-4',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      action: "Generated lore for Akash Bumiya",
      user: "Guild Scribe",
      ipAddress: "192.168.1.2"
    },
    {
      id: 'log-5',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      action: "Added new adventurer: Chris Nash",
      user: "Guild Master",
      ipAddress: "192.168.1.3"
    }
  ];
};

// Log an activity
const logActivity = (action, user = 'Guild Leader', ipAddress = '127.0.0.1') => {
  try {
    // Get existing logs
    const savedLogs = localStorage.getItem(ACTIVITY_LOG_KEY);
    let logs = [];
    
    if (savedLogs) {
      logs = JSON.parse(savedLogs);
    }
    
    // Add new log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      user,
      ipAddress
    };
    
    logs.unshift(newLog); // Add to beginning
    
    // Keep only the latest 100 logs
    if (logs.length > 100) {
      logs = logs.slice(0, 100);
    }
    
    // Save to localStorage
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
    
    return newLog;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = () => {
      try {
        setLoading(true);
        
        // Try to load from localStorage
        const savedLogs = localStorage.getItem(ACTIVITY_LOG_KEY);
        let logs = [];
        
        if (savedLogs) {
          logs = JSON.parse(savedLogs);
        }
        
        // If no logs, generate mock logs
        if (!logs || logs.length === 0) {
          logs = generateMockLogs();
          localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
        }
        
        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setActivityLogs(logs);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    
    // Set up a refresh interval
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="card p-6 text-center">
        <Loader size={24} className="text-primary-500 mx-auto mb-4 animate-spin" />
        <h3 className="font-medieval">Loading Activity Logs...</h3>
      </div>
    );
  }
  
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="font-medieval">Recent Guild Activities</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-700">
          <thead>
            <tr className="bg-dark-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {activityLogs.length > 0 ? (
              activityLogs.map((log, index) => (
                <motion.tr 
                  key={log.id || index}
                  className="hover:bg-dark-750"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-4 py-3 text-sm text-dark-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.user}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-dark-400">
                    {log.ipAddress}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-dark-400">
                  No activity logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export the component and the logActivity function
export { logActivity };
export default ActivityLog;