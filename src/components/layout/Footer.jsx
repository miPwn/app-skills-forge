import React from 'react';
import { GithubIcon, Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <h3 className="font-medieval text-lg text-primary-300 mb-1">GuildForge</h3>
            <p className="text-sm text-dark-400">The Adventurer's Skill Matrix</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="flex space-x-4 text-dark-400">
              <a href="#" className="hover:text-primary-400 transition-colors flex items-center">
                <GithubIcon size={16} className="mr-1" />
                <span className="text-sm">GitHub</span>
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors flex items-center">
                <Code2 size={16} className="mr-1" />
                <span className="text-sm">Documentation</span>
              </a>
            </div>
          </div>
          
          <div className="text-sm text-dark-500 flex items-center">
            <span>Crafted with</span>
            <Heart size={14} className="mx-1 text-danger-500" />
            <span>in the realm of code</span>
          </div>
          
          <div className="mt-2 text-xs text-dark-600">
            &copy; {new Date().getFullYear()} GuildForge - All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;