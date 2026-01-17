
import React from 'react';

interface JarvisHUDProps {
  isProcessing: boolean;
  isActive: boolean;
  onClick: () => void;
}

const JarvisHUD: React.FC<JarvisHUDProps> = ({ isProcessing, isActive, onClick }) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onClick}
        className="relative w-16 h-16 flex items-center justify-center group outline-none focus:outline-none"
        aria-label={isActive ? "Deactivate Jarvis" : "Activate Jarvis"}
      >
        {/* Outer Rotating Ring */}
        <div className={`absolute inset-0 border-[1px] border-dashed rounded-full transition-colors duration-500 ${isActive ? 'border-red-500/50 animate-[rotate_5s_linear_infinite]' : 'border-cyan-500/30 animate-[rotate_15s_linear_infinite]'}`}></div>
        
        {/* Core Glowing Orb */}
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
          isActive 
            ? 'bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110' 
            : 'bg-cyan-500/10 group-hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
        }`}>
          {/* Inner pulsating core */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive 
              ? 'bg-red-400/40 animate-pulse' 
              : isProcessing 
                ? 'bg-cyan-300 animate-bounce' 
                : 'bg-cyan-400/30'
          }`}>
            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
              isActive 
                ? 'bg-white shadow-[0_0_15px_white]' 
                : 'bg-cyan-100 shadow-[0_0_10px_white]'
            }`}></div>
          </div>
        </div>

        {/* Hexagon Rings (Simplified) */}
        <svg className={`absolute inset-0 w-full h-full opacity-40 pointer-events-none transition-colors duration-500 ${isActive ? 'text-red-500' : 'text-cyan-400'}`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="2 10" 
            className={isActive ? 'animate-[rotate_10s_linear_infinite]' : 'animate-[rotate_20s_linear_infinite]'} 
          />
        </svg>
      </button>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default JarvisHUD;
