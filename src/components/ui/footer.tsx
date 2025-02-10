import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from './card';
import { Input } from './input';
import { Button } from './button';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/theme-provider';
import React from 'react';

interface GitHubProfile {
  avatar_url: string;
  name: string;
  login: string;
}

interface InstagramProfile {
  username: string;
  account_type: string;
  media_count: number;
  id: string;
  profile_picture?: string;
}

interface SocialCardProps {
  name: string;
  username: string;
  avatar: string;
  isVisible: boolean;
  isLoading?: boolean;
}

function SocialCard({ name, username, avatar, isVisible, isLoading }: SocialCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-14 left-0 w-[180px] z-50">
      <Card className={cn(
        "border-0 overflow-hidden",
        isDark 
          ? "bg-[#141414] shadow-lg rounded-[4px]" 
          : "bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-lg"
      )}>
        <div className="p-2 flex items-center gap-2">
          {isLoading ? (
            <div className={cn(
              "w-7 h-7 rounded-full flex-shrink-0 animate-pulse",
              isDark ? "bg-neutral-800" : "bg-blue-50"
            )} />
          ) : (
            <img 
              src={avatar} 
              alt={name} 
              className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-black/5"
            />
          )}
          <div className="flex flex-col min-w-0 py-0.5">
            {isLoading ? (
              <>
                <div className={cn(
                  "w-16 h-3 rounded animate-pulse",
                  isDark ? "bg-neutral-800" : "bg-blue-50"
                )} />
                <div className={cn(
                  "w-12 h-2.5 rounded animate-pulse mt-1",
                  isDark ? "bg-neutral-800" : "bg-blue-50"
                )} />
              </>
            ) : (
              <>
                <span className={cn(
                  "text-[13px] font-medium leading-none",
                  isDark ? "text-white" : "text-slate-800"
                )}>{name}</span>
                <span className={cn(
                  "text-[11px] leading-none mt-1",
                  isDark ? "text-neutral-400" : "text-slate-500"
                )}>{username}</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function LocalTime() {
  const [time, setTime] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const offset = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offset) / 60);
      const offsetMinutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';
      
      const formattedOffset = offsetMinutes === 0 
        ? `GMT${sign}${offsetHours}`
        : `GMT${sign}${offsetHours}:${offsetMinutes.toString().padStart(2, '0')}`;
      
      setTimezone(formattedOffset);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[18px] font-medium tracking-wide">
      <span className={cn(
        isDark ? "text-neutral-500" : "text-slate-400"
      )}>{timezone}</span>{' '}
      <span className={cn(
        "font-semibold",
        isDark ? "text-white" : "text-slate-800"
      )}>{time}</span>
    </span>
  );
}

function ContactCard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "absolute z-50 origin-bottom-left",
      isMobile 
        ? "fixed inset-x-4 bottom-20" 
        : "bottom-16 left-0 w-[400px]"
    )}>
      <Card className={cn(
        "border-0 overflow-hidden",
        isDark 
          ? "bg-[#1c1c1c] shadow-2xl rounded-lg" 
          : "bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] rounded-xl"
      )}>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Input 
              placeholder="name" 
              className={cn(
                "w-full h-10 text-base",
                isDark 
                  ? "bg-[#2c2c2c] border-0 rounded-md text-neutral-200 placeholder:text-neutral-500" 
                  : "bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              )}
            />
            <Input 
              placeholder="reply@gmail.com" 
              className={cn(
                "w-full h-10 text-base",
                isDark 
                  ? "bg-[#2c2c2c] border-0 rounded-md text-neutral-200 placeholder:text-neutral-500"
                  : "bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              )}
            />
          </div>
          <textarea 
            placeholder="Do you need a cup of coffee?" 
            className={cn(
              "w-full h-[120px] p-3 text-base resize-none focus:outline-none",
              isDark 
                ? "bg-[#2c2c2c] border-0 rounded-md text-neutral-200 placeholder:text-neutral-500"
                : "bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            )}
          />
          <div className="flex items-center justify-between gap-3">
            <select
              className={cn(
                "h-10 px-3 text-base appearance-none cursor-pointer flex-1",
                isDark 
                  ? "bg-[#2c2c2c] border-0 rounded-md text-neutral-200"
                  : "bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              )}
            >
              <option value="need-reply">replay options</option>
              <option value="no-reply">no reply needed</option>
            </select>
            <Button 
              size="default" 
              className={cn(
                "px-6 transition-all duration-200 font-medium h-10 min-w-[100px]",
                isDark 
                  ? "bg-white text-black hover:bg-neutral-200 rounded-md"
                  : "bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-sm hover:shadow-md"
              )}
            >
              Send
            </Button>
          </div>
          <div className={cn(
            "text-sm",
            isDark ? "text-neutral-500" : "text-slate-500"
          )}>
            Your message will be sent to{' '}
            <a 
              href="mailto:nagetspesial@gmail.com"
              className={cn(
                "transition-colors duration-200 hover:underline relative z-10 font-medium",
                isDark 
                  ? "text-neutral-300 hover:text-[#ff6b6b]"
                  : "text-blue-600 hover:text-blue-700"
              )}
            >
              nagetspesial@gmail.com
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showContactCard, setShowContactCard] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<'github' | 'instagram' | null>(null);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [instagramProfile, setInstagramProfile] = useState<InstagramProfile | null>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(false);

  // GitHub profile fetch
  useEffect(() => {
    if (hoveredSocial === 'github') {
      setIsLoadingGithub(true);
      fetch('https://api.github.com/users/nagetspesial')
        .then(res => res.json())
        .then((data: GitHubProfile) => {
          setGithubProfile(data);
        })
        .catch(error => {
          console.error('Error fetching GitHub profile:', error);
        })
        .finally(() => {
          setIsLoadingGithub(false);
        });
    }
  }, [hoveredSocial]);

  // Instagram profile fetch
  useEffect(() => {
    if (hoveredSocial === 'instagram') {
      setIsLoadingInstagram(true);
      
      // Only fetch profile if we're hovering, don't redirect
      fetch('/api/instagram/profile')
        .then(res => {
          if (res.status === 401) {
            // If not authenticated, just set loading to false
            setIsLoadingInstagram(false);
            return;
          }
          return res.json();
        })
        .then(data => {
          if (data?.username) {
            setInstagramProfile(data);
          }
        })
        .catch(error => {
          console.error('Error fetching Instagram profile:', error);
        })
        .finally(() => {
          setIsLoadingInstagram(false);
        });
    }
  }, [hoveredSocial]);

  // Handle Instagram click
  const handleInstagramClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if authenticated
    const res = await fetch('/api/instagram/profile');
    if (res.status === 401) {
      // Not authenticated, initiate auth flow
      const authRes = await fetch('/api/auth/instagram');
      const data = await authRes.json();
      window.location.href = data.url;
    } else {
      // Already authenticated, proceed to Instagram profile
      window.open('https://instagram.com/petiranggara', '_blank');
    }
  };

  return (
    <footer className={cn(
      "w-full h-20 border-t",
      isDark 
        ? "bg-background border-neutral-800" 
        : "bg-white border-slate-100 shadow-sm"
    )}>
      <div className="h-full w-full">
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
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
                <GitHubIcon className={cn(
                  "w-5 h-5 transition-colors sm:w-[18px] sm:h-[18px]",
                  isDark 
                    ? "text-white/80 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                )} />
              </Link>
              <SocialCard
                name={githubProfile?.name || "nagetspesial"}
                username={githubProfile?.login ? `@${githubProfile.login}` : "@nagetspesial"}
                avatar={githubProfile?.avatar_url || "https://github.com/nagetspesial.png"}
                isVisible={hoveredSocial === 'github'}
                isLoading={isLoadingGithub}
              />
            </div>
            <div className="relative">
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
                <InstagramIcon className={cn(
                  "w-5 h-5 transition-colors sm:w-[18px] sm:h-[18px]",
                  isDark 
                    ? "text-white/80 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                )} />
              </Link>
              <SocialCard
                name="Petir Anggara"
                username={instagramProfile?.username ? `@${instagramProfile.username}` : "@petiranggara"}
                avatar={instagramProfile?.profile_picture || `https://unavatar.io/instagram/${instagramProfile?.username || 'petiranggara'}`}
                isVisible={hoveredSocial === 'instagram'}
                isLoading={isLoadingInstagram}
              />
            </div>
            <div className="relative">
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
                {showContactCard ? (
                  <X className={cn(
                    "w-5 h-5 transition-colors sm:w-[18px] sm:h-[18px]",
                    isDark 
                      ? "text-white/80 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  )} />
                ) : (
                  <MailIcon className={cn(
                    "w-5 h-5 transition-colors sm:w-[18px] sm:h-[18px]",
                    isDark 
                      ? "text-white/80 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  )} />
                )}
              </button>
              <ContactCard isOpen={showContactCard} onClose={() => setShowContactCard(false)} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LocalTime />
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
} 