
import React, { useState, useEffect } from 'react';

interface ResponseDisplayProps {
  text: string;
  isVisible: boolean;
  onClose: () => void;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ text, isVisible, onClose }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }
    
    let index = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      setDisplayText((prev) => text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 15); // Typewriter effect for tech feel

    return () => clearInterval(interval);
  }, [text]);

  if (!isVisible || !text) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6 pointer-events-none">
      <div className="w-full max-w-3xl bg-[#000d14]/90 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_100px_rgba(0,212,255,0.1)] pointer-events-auto animate-in fade-in zoom-in duration-500 relative flex flex-col max-h-[70vh]">
        
        {/* Decorative corner brackets */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]"></div>
            <span className="font-orbitron text-xs tracking-[0.4em] text-cyan-400 uppercase">Intelligence_Report</span>
          </div>
          <button 
            onClick={onClose}
            className="text-cyan-500 hover:text-white transition-colors p-1"
          >
            <span className="font-orbitron text-xs">CLOSE [X]</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="font-mono text-base md:text-lg text-cyan-50 leading-relaxed tracking-tight">
            <span className="text-cyan-500/50 mr-2 font-bold select-none">$</span>
            {displayText}
            <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse"></span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-500/10 flex justify-between items-center opacity-30 px-6">
          <span className="text-[8px] font-mono tracking-widest uppercase">Encryption_Level_09</span>
          <div className="flex gap-2">
            <div className="w-12 h-[1px] bg-cyan-500"></div>
            <div className="w-6 h-[1px] bg-cyan-500/50"></div>
          </div>
          <span className="text-[8px] font-mono tracking-widest uppercase">JARVIS_v2.5_CORE</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 212, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ResponseDisplay;
