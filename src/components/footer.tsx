import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';

const Footer: React.FC = () => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [showContactCard, setShowContactCard] = useState(false);
  const isDark = true; // Replace with actual dark mode detection

  const handleInstagramClick = () => {
    // Implement the logic to handle Instagram click
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link
              href="https://github.com/nagetspesial"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "social-hover",
                isDark 
                  ? "bg-[#141414] hover:bg-[#1c1c1c]"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
              )}
              onMouseEnter={() => setHoveredSocial('github')}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              {/* GitHub icon content */}
            </Link>
            <Link
              href="https://instagram.com/petiranggara"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "social-hover",
                isDark 
                  ? "bg-[#141414] hover:bg-[#1c1c1c]"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
              )}
              onMouseEnter={() => setHoveredSocial('instagram')}
              onMouseLeave={() => setHoveredSocial(null)}
              onClick={handleInstagramClick}
            >
              {/* Instagram icon content */}
            </Link>
            <button
              onClick={() => setShowContactCard(!showContactCard)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "social-hover",
                isDark 
                  ? "bg-[#141414] hover:bg-[#1c1c1c]"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
              )}
            >
              {/* Contact icon content */}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 