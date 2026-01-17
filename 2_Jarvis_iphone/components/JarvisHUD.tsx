import React from 'react';

interface JarvisHUDProps {
  isProcessing: boolean;
  isActive: boolean;
  onClick: () => void;
}

const JarvisHUD: React.FC<JarvisHUDProps> = ({ isProcessing, isActive, onClick }) => {
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={onClick}
        className="relative w-24 h-24 flex items-center justify-center group outline-none focus:outline-none touch-none"
        aria-label={isActive ? "Deactivate Jarvis" : "Activate Jarvis"}
      >
        {/* Outer Rotating Ring */}
        <div className={`absolute inset-[-10px] border-[1px] border-dashed rounded-full transition-colors duration-500 ${isActive ? 'border-red-500/50 animate-[rotate_3s_linear_infinite]' : 'border-cyan-500/20 animate-[rotate_15s_linear_infinite]'}`}></div>
        
        {/* Secondary Rotating Ring */}
        <div className={`absolute inset-[-4px] border border-cyan-500/10 rounded-full transition-all duration-500 ${isActive ? 'scale-125 border-red-500/30' : 'animate-[rotate_10s_linear_infinite_reverse]'}`}></div>

        {/* Core Glowing Orb */}
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 z-10 ${
          isActive 
            ? 'bg-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.6)] scale-110' 
            : 'bg-cyan-500/10 group-hover:bg-cyan-500/20 shadow-[0_0_30px_rgba(0,212,255,0.3)]'
        }`}>
          {/* Inner pulsating core */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive 
              ? 'bg-red-400/40 animate-pulse' 
              : isProcessing 
                ? 'bg-cyan-300 animate-[pulse_1s_infinite]' 
                : 'bg-cyan-400/20'
          }`}>
            <div className={`w-5 h-5 rounded-full transition-all duration-500 ${
              isActive 
                ? 'bg-white shadow-[0_0_20px_white]' 
                : 'bg-cyan-100 shadow-[0_0_15px_white]'
            }`}></div>
          </div>
        </div>

        {/* Technical HUD Circles */}
        <svg className={`absolute inset-[-30px] w-[calc(100%+60px)] h-[calc(100%+60px)] opacity-60 pointer-events-none transition-colors duration-500 ${isActive ? 'text-red-500' : 'text-cyan-400'}`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 5" />
          <circle 
            cx="50" cy="50" r="42" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="4 15" 
            className={isActive ? 'animate-[rotate_8s_linear_infinite]' : 'animate-[rotate_25s_linear_infinite]'} 
          />
          {/* Scanning line */}
          <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="1" transform-origin="50 50" className="animate-[rotate_2s_linear_infinite]" />
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