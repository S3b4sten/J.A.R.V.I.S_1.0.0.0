import React, { useState, useEffect } from 'react';

const QUOTES = [
  "The mechanic is in.",
  "Sir, I've designated a few targets for you.",
  "Always a pleasure to be of service.",
  "Power reserves at optimal levels.",
  "Scanning local frequencies...",
  "Protocol 14 is now active."
];

const ClockQuote: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const q = setInterval(() => setQuoteIdx(p => (p + 1) % QUOTES.length), 10000);
    return () => { clearInterval(t); clearInterval(q); };
  }, []);

  return (
    <div className="flex flex-col h-full font-mono pl-4 border-l-2 border-cyan-500/30 py-1 overflow-hidden">
      {/* Module Header */}
      <div className="flex items-center gap-1.5 opacity-50 mb-1">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
        <span className="text-[7px] font-orbitron tracking-[0.3em] uppercase text-cyan-500">Temporal_Link_A1</span>
      </div>

      {/* Grouping Clock and Quote */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col">
          <div className="text-3xl font-orbitron tracking-tighter text-cyan-50 leading-none glow-text-sm">
            {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
            <span className="text-sm ml-1 opacity-40 font-mono">:{time.getSeconds().toString().padStart(2, '0')}</span>
          </div>
          <div className="text-[9px] text-cyan-500/60 uppercase tracking-[0.2em] mt-0.5 font-bold">
            {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>

        <div className="text-[9px] text-cyan-400/80 italic font-mono animate-in fade-in slide-in-from-left-2 duration-1000 line-clamp-1 border-t border-cyan-500/10 pt-1.5">
          <span className="text-cyan-600 mr-2 opacity-50 font-bold">$</span>
          {QUOTES[quoteIdx]}
        </div>
      </div>
      
      <style>{`
        .glow-text-sm {
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ClockQuote;