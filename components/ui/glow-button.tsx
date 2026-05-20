"use client"

import React, { useId } from 'react';

interface GlowButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GlowButton({ children = 'Register', onClick, className }: GlowButtonProps) {
  const rawId = useId().replace(/:/g, '');
  const filters = {
    unopaq: `unopaq-${rawId}`,
    unopaq2: `unopaq2-${rawId}`,
    unopaq3: `unopaq3-${rawId}`,
  };

  return (
    <div className="relative group inline-flex">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes speen {
          0% { transform: rotate(10deg); }
          50% { transform: rotate(190deg); }
          100% { transform: rotate(370deg); }
        }
        @keyframes woah {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.75); }
        }
      `}} />

      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq}>
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 9 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq2}>
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq3}>
            <feColorMatrix values="1 0 0 0.2 0 0 1 0 0.2 0 0 0 1 0.2 0 0 0 0 2 0" />
          </filter>
        </defs>
      </svg>

      {/* Hidden clickable button */}
      <button
        onClick={onClick}
        className="absolute inset-0 w-full h-full z-20 outline-none border-none rounded-[22px] cursor-pointer opacity-0"
      />

      {/* Button Container */}
      <div className="relative">
        {/* Outer Glow */}
        <div
          className="absolute inset-0 -z-20 opacity-50 overflow-hidden transition-opacity duration-300 group-hover:opacity-75 group-active:opacity-100"
          style={{ filter: `blur(2em) url(#${filters.unopaq})` }}
        >
          <div
            className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
            style={{ background: 'linear-gradient(90deg, #f50 30%, #0000 50%, #05f 70%)' }}
          />
        </div>

        {/* Middle Glow */}
        <div
          className="absolute inset-[-0.125em] -z-20 opacity-50 overflow-hidden transition-opacity duration-300 group-hover:opacity-75 group-active:opacity-100"
          style={{ filter: `blur(0.25em) url(#${filters.unopaq2})`, borderRadius: '0.75em' }}
        >
          <div
            className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
            style={{ background: 'linear-gradient(90deg, #f95 20%, #0000 45% 55%, #59f 80%)' }}
          />
        </div>

        {/* Button Border */}
        <div
          className="p-0.5 bg-[#0005] rounded-[22px]"
        >
          <div className="relative">
            {/* Inner Glow */}
            <div
              className="absolute inset-[-2px] -z-10 opacity-50 overflow-hidden transition-opacity duration-300 group-hover:opacity-75 group-active:opacity-100"
              style={{ filter: `blur(2px) url(#${filters.unopaq3})`, borderRadius: 'inherit' }}
            >
              <div
                className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
                style={{ background: 'linear-gradient(90deg, #fc9 30%, #0000 45% 55%, #9cf 70%)' }}
              />
            </div>

            {/* Button Surface */}
            <div
              className="flex flex-col items-center justify-center min-w-[120px] h-[44px] px-6 bg-[#111215] text-white overflow-hidden text-sm font-semibold rounded-[20px]"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
