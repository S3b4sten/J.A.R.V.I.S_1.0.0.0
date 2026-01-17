
import React from 'react';

interface GroundingLink {
  title: string;
  uri: string;
}

interface SourcePanelProps {
  links: GroundingLink[];
  isVisible: boolean;
  onClose: () => void;
}

const SourcePanel: React.FC<SourcePanelProps> = ({ links, isVisible, onClose }) => {
  if (!isVisible || links.length === 0) return null;

  return (
    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4 animate-in fade-in zoom-in duration-500 z-50">
      <div className="bg-black/80 backdrop-blur-2xl border border-cyan-500/40 rounded-t-[40px] rounded-b-lg p-6 shadow-[0_-20px_50px_rgba(0,212,255,0.2)] relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-950 border border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
        >
          <span className="font-orbitron text-[10px] group-hover:scale-125 transition-transform">X</span>
        </button>

        <div className="flex items-center justify-between mb-4 border-b border-cyan-500/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]"></div>
            <span className="font-orbitron text-[12px] tracking-[0.4em] text-cyan-400 uppercase">Archive_Nodes</span>
          </div>
          <span className="text-[9px] text-cyan-500/60 font-mono uppercase tracking-widest">Linked_Data: {links.length}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group bg-cyan-500/5 border border-cyan-500/10 hover:border-cyan-400/50 p-3 rounded-md transition-all duration-300 hover:translate-x-1"
            >
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-[12px] font-bold text-cyan-50 truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                  {link.title || 'Data Stream ' + idx}
                </span>
                <span className="text-[9px] text-cyan-500/50 truncate font-mono italic">
                  {new URL(link.uri).hostname}
                </span>
              </div>
              <div className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ml-4">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        
        {/* Decorative footer */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-0.5 w-full bg-cyan-900/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400/60 w-1/4 animate-[scanning_3s_infinite_linear]"></div>
          </div>
          <span className="text-[8px] font-orbitron text-cyan-950 uppercase tracking-[1em]">Source_Panel_Active</span>
        </div>
      </div>

      <style>{`
        @keyframes scanning {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
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

export default SourcePanel;
