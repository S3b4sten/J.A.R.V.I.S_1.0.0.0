
import React from 'react';

interface JarvisHUDProps {
  isProcessing: boolean;
  isActive: boolean;
  onClick: () => void;
}

const JarvisHUD: React.FC<JarvisHUDProps> = ({ isProcessing, isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <button 
        onClick={onClick}
        className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center group outline-none focus:outline-none"
        aria-label={isActive ? "Deactivate Jarvis" : "Activate Jarvis"}
      >
        {/* Outer Rotating Ring */}
        <div className={`absolute inset-0 border-[2px] border-dashed rounded-full transition-colors duration-500 ${isActive ? 'border-red-500/50 animate-[rotate_10s_linear_infinite]' : 'border-cyan-500/30 animate-rotate-slow'}`}></div>
        
        {/* Middle Rotating Ring with notches */}
        <div className={`absolute inset-6 border-[1px] rounded-full transition-colors duration-500 ${isActive ? 'border-red-400/50 animate-[rotate_3s_linear_infinite_reverse]' : 'border-cyan-400/50 animate-rotate-fast'}`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 transition-colors duration-500 ${isActive ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-6 transition-colors duration-500 ${isActive ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 w-6 transition-colors duration-500 ${isActive ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-1 w-6 transition-colors duration-500 ${isActive ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
        </div>

        {/* Third Pulse Ring (only when active) */}
        {isActive && (
          <div className="absolute inset-0 border border-red-500/20 rounded-full animate-ping opacity-20"></div>
        )}

        {/* Core Glowing Orb */}
        <div className={`relative w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-700 overflow-hidden ${
          isActive 
            ? 'bg-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.4)] scale-110' 
            : 'bg-cyan-500/10 group-hover:bg-cyan-500/20 shadow-[0_0_30px_rgba(0,212,255,0.2)] group-hover:scale-105'
        }`}>
          {/* Inner pulsating core */}
          <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive 
              ? 'bg-red-400/40 animate-pulse' 
              : isProcessing 
                ? 'bg-cyan-300 animate-bounce' 
                : 'bg-cyan-400/30'
          }`}>
            <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full transition-all duration-500 ${
              isActive 
                ? 'bg-white shadow-[0_0_25px_white]' 
                : 'bg-cyan-100 shadow-[0_0_20px_white]'
            }`}></div>
          </div>
          
          {/* Scan Line Effect within orb */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-1/2 w-full animate-[scan_3s_linear_infinite] pointer-events-none"></div>
        </div>

        {/* Data Hexagon Rings (SVG) */}
        <svg className={`absolute inset-0 w-full h-full opacity-40 pointer-events-none transition-colors duration-500 ${isActive ? 'text-red-500' : 'text-cyan-400'}`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeDasharray="2 12" 
            className={isActive ? 'animate-[rotate_15s_linear_infinite]' : 'animate-rotate-slow'} 
          />
        </svg>

        {/* Corner Brackets */}
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-red-500' : 'border-cyan-500/40 group-hover:border-cyan-400'}`}></div>
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-red-500' : 'border-cyan-500/40 group-hover:border-cyan-400'}`}></div>
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-red-500' : 'border-cyan-500/40 group-hover:border-cyan-400'}`}></div>
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-red-500' : 'border-cyan-500/40 group-hover:border-cyan-400'}`}></div>
      </button>

      {/* Interaction Label */}
      <div className="flex flex-col items-center">
        <div className={`font-orbitron text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? 'text-red-500 animate-pulse' : 'text-cyan-500/60'}`}>
          {isActive ? 'COMMS_ACTIVE - SPEAK_NOW' : 'TAP_TO_ENGAGE_CORE'}
        </div>
        <div className="h-0.5 w-12 bg-cyan-900 mt-2 overflow-hidden">
          <div className={`h-full bg-cyan-400 transition-all duration-500 ${isActive ? 'w-full bg-red-500' : 'w-0'}`}></div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};

export default JarvisHUD;
