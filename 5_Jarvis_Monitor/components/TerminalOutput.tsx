
import React, { useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'jarvis';
  text: string;
}

interface TerminalOutputProps {
  messages: Message[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pr-4 mask-fade-bottom flex flex-col gap-4 py-2"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <span className="font-orbitron text-[10px] tracking-[1em] mb-2 uppercase">Awaiting_Connection</span>
            <div className="w-32 h-[1px] bg-cyan-500/50"></div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col gap-1.5 animate-in slide-in-from-left-4 duration-500 ${msg.role === 'user' ? 'opacity-50 ml-4 border-l border-white/10 pl-3' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-orbitron tracking-widest uppercase ${msg.role === 'jarvis' ? 'text-cyan-400' : 'text-white/40'}`}>
                {msg.role === 'jarvis' ? 'JARVIS' : 'AUTHORIZED_USER'}
              </span>
              <div className="flex-1 h-[1px] bg-cyan-500/5"></div>
              <span className="text-[6px] font-mono opacity-20">0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
            </div>
            
            <div className={`font-mono text-[14px] leading-relaxed tracking-tight ${msg.role === 'jarvis' ? 'text-cyan-50 glow-text-sm' : 'text-cyan-600'}`}>
              {msg.role === 'jarvis' && <span className="text-cyan-500 mr-2 opacity-50 font-bold">$</span>}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
        }
        .glow-text-sm {
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default TerminalOutput;
