import React from 'react';
import { motion } from 'framer-motion';
import { generateActivityLog } from '../../utils/helpers';

const ActivityLog = () => {
  const activityLogs = generateActivityLog();
  
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
            {activityLogs.map((log, index) => (
              <motion.tr 
                key={index}
                className="hover:bg-dark-750"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-4 py-3 text-sm text-dark-300">
                  {log.timestamp.toLocaleString()}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;