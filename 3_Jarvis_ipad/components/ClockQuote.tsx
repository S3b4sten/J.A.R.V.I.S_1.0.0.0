
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
    <div className="flex flex-col items-center justify-center font-mono">
      <div className="text-2xl font-orbitron tracking-widest">
        {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-[10px] opacity-60 uppercase border-y border-cyan-500/30 px-4 py-1 mt-1">
        {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
      <div className="mt-2 text-[10px] text-cyan-200 animate-pulse italic">
        " {QUOTES[quoteIdx]} "
      </div>
    </div>
  );
};

export default ClockQuote;
