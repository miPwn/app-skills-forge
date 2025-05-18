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

/**
 * Formats a timestamp for display in the activity log
 * @param {Date} timestamp - The timestamp to format
 * @returns {string} - Formatted timestamp string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Format as date
  return timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default {
  generateActivityLog,
  formatTimestamp
};