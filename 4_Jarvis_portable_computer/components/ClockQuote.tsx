
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
    <div className="flex flex-col items-start justify-center font-mono pl-4 border-l-2 border-cyan-500/30">
      <div className="text-4xl font-orbitron tracking-tighter text-cyan-50">
        {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
        <span className="text-sm ml-1 opacity-40 font-mono">:{time.getSeconds().toString().padStart(2, '0')}</span>
      </div>
      <div className="text-[10px] text-cyan-500/60 uppercase tracking-[0.2em] mt-1">
        {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
      </div>
      <div className="mt-4 text-[11px] text-cyan-400/80 italic font-mono animate-in fade-in slide-in-from-left-2 duration-1000">
        <span className="text-cyan-600 mr-2 opacity-50 font-bold">$</span>
        {QUOTES[quoteIdx]}
      </div>
    </div>
  );
};

export default ClockQuote;
