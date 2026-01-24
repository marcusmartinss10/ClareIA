'use client';

import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    theme?: 'dark' | 'light';
    className?: string;
}

export default function Logo({
    size = 'md',
    showText = true,
    theme = 'light',
    className = ''
}: LogoProps) {

    // Size mapping
    const sizes = {
        sm: { icon: 'h-8 w-8', text: 'text-lg', dot: 'h-1.5 w-1.5' },
        md: { icon: 'h-10 w-10', text: 'text-xl', dot: 'h-2 w-2' },
        lg: { icon: 'h-14 w-14', text: 'text-2xl', dot: 'h-2.5 w-2.5' },
        xl: { icon: 'h-20 w-20', text: 'text-4xl', dot: 'h-3 w-3' }
    };

    const currentSize = sizes[size];
    const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-4px) scale(1.1); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(0, -4px); }
          75% { transform: translate(-2px, -2px); }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(0, 4px); }
          75% { transform: translate(2px, 2px); }
        }
        
        .logo-icon-glass {
          position: relative;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.9));
          border-radius: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 4px 12px rgba(6, 182, 212, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.4),
            inset 0 -1px 2px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .glass-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          border-radius: 20% 20% 0 0;
          pointer-events: none;
        }

        .tooth-shape {
          font-size: 1.5em;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          z-index: 10;
        }

        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
          pointer-events: none;
        }
        
        .p1 { width: 4px; height: 4px; top: 20%; left: 20%; animation: particle-1 4s ease-in-out infinite; }
        .p2 { width: 3px; height: 3px; bottom: 20%; right: 20%; animation: particle-2 5s ease-in-out infinite; }
        .p3 { width: 2px; height: 2px; top: 40%; right: 15%; animation: pulse-glow 3s ease-in-out infinite; }

      `}</style>

            {/* Liquid Glass Icon */}
            <div className={`logo-icon-glass ${currentSize.icon}`}>
                <div className="glass-highlight" />

                {/* Particles */}
                <div className="particle p1" />
                <div className="particle p2" />
                <div className="particle p3" />

                {/* Tooth Icon (Emoji for now, could be SVG) */}
                <div className="tooth-shape text-white">🦷</div>
            </div>

            {/* Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1 className={`font-black tracking-tight leading-none ${currentSize.text} ${textColor}`}>
                        Clare<span className="text-cyan-500">IA</span>
                    </h1>
                </div>
            )}
        </div>
    );
}
