
import React from 'react';
import { NewsItem } from '../types';

interface NewsTickerProps {
  items: NewsItem[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ items }) => {
  return (
    <div className="bg-cyan-950/20 border-y border-cyan-800/50 py-1 overflow-hidden whitespace-nowrap flex items-center">
      <div className="px-4 bg-cyan-500/20 text-[10px] font-bold font-orbitron tracking-widest flex items-center gap-2 border-r border-cyan-800">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
        WORLD_FEED
      </div>
      
      <div className="flex animate-marquee hover:pause whitespace-nowrap">
        {items.length > 0 ? (
          items.concat(items).map((item, idx) => (
            <div key={idx} className="flex items-center mx-8 gap-3">
              <span className="text-[10px] font-mono opacity-40">[{item.time}]</span>
              <span className="text-xs font-mono text-cyan-100">{item.title}</span>
              <span className="text-[10px] font-mono text-cyan-600">//{item.source}</span>
            </div>
          ))
        ) : (
          <div className="mx-8 text-xs font-mono italic opacity-50">Initializing satellite feed...</div>
        )}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
