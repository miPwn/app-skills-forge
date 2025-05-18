import React from 'react';
import { createAvatarUrl } from '../../utils/avatarHelpers';

/**
 * Reusable avatar component with configurable size
 */
const Avatar = ({ name, avatarUrl, size = 'md', className = '', withBadge = false }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };
  
  const borderClasses = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4'
  };
  
  // Use custom avatarUrl if provided, otherwise generate one
  const imageUrl = avatarUrl || createAvatarUrl(name);
  
  return (
    <div className="relative">
      <div className={`rounded-full overflow-hidden border-primary-600 bg-dark-700 ${sizeClasses[size]} ${borderClasses[size]} ${className}`}>
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {withBadge && (
        <div className="absolute -right-2 -bottom-2 bg-primary-600 text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;