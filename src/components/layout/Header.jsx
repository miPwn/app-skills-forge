import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sword, Users, Trophy, Beer, Shield, Home, Medal } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-dark-950 border-b border-dark-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2 text-xl font-medieval font-bold text-white group">
            <div className="bg-secondary-700 p-2 rounded-full group-hover:bg-secondary-600 transition-colors">
              <Sword size={24} className="text-white" />
            </div>
            <span className="hidden sm:inline-block">GuildForge</span>
          </NavLink>
          
          <nav className="flex">
            <ul className="flex space-x-1 md:space-x-2">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                  end
                >
                  <Home size={18} />
                  <span className="mt-1">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/guild-hall" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                >
                  <Users size={18} />
                  <span className="mt-1">Guild Hall</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/hall-of-legends" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                >
                  <Trophy size={18} />
                  <span className="mt-1">Legends</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/leaderboards" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                >
                  <Medal size={18} />
                  <span className="mt-1">Rankings</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tavern-talk" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                >
                  <Beer size={18} />
                  <span className="mt-1">Tavern</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/command-center" 
                  className={({ isActive }) => 
                    `flex flex-col items-center py-1 px-2 md:px-3 rounded-md text-xs md:text-sm ${
                      isActive 
                        ? 'bg-dark-800 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-primary-300'
                    } transition-colors`
                  }
                >
                  <Shield size={18} />
                  <span className="mt-1">Command</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;