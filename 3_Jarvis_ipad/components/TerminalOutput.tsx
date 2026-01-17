
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
    <div className="fixed top-20 left-6 bottom-32 w-full max-w-[300px] md:max-w-[400px] pointer-events-none z-30">
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2 mb-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-cyan-500/60 uppercase">System_Log_Feed</span>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto pr-4 mask-fade-bottom"
        >
          <div className="flex flex-col gap-6">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col gap-1.5 animate-in slide-in-from-left-4 duration-500 ${msg.role === 'user' ? 'opacity-40' : 'opacity-100'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-orbitron tracking-widest uppercase ${msg.role === 'jarvis' ? 'text-cyan-400' : 'text-white/40'}`}>
                    {msg.role === 'jarvis' ? 'JARVIS_OUT' : 'USER_IN'}
                  </span>
                  <div className="flex-1 h-[1px] bg-cyan-500/10"></div>
                </div>
                
                <div className={`font-mono text-[13px] leading-relaxed tracking-tight ${msg.role === 'jarvis' ? 'text-cyan-100 glow-text-sm' : 'text-cyan-600'}`}>
                  {msg.role === 'jarvis' && <span className="text-cyan-500 mr-2 opacity-50">$</span>}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4 border-l border-cyan-500/20 ml-1"></div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
        .glow-text-sm {
          text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default TerminalOutput;
