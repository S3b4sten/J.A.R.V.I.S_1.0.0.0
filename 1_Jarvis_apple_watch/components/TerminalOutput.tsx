
import React, { forwardRef } from 'react';
import { Message } from '../types';

interface TerminalOutputProps {
  messages: Message[];
}

const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(({ messages }, ref) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
      {messages.map((msg, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-1 rounded ${msg.role === 'jarvis' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/60'}`}>
              {msg.role === 'jarvis' ? 'J.A.R.V.I.S.' : 'USER_PROMPT'}
            </span>
            <span className="text-[10px] opacity-30">
              [{msg.timestamp.toLocaleTimeString([], { hour12: false })}]
            </span>
          </div>
          <div className={`${msg.role === 'jarvis' ? 'text-cyan-100' : 'text-cyan-400/70'} leading-relaxed break-words`}>
            {msg.role === 'jarvis' && <span className="text-cyan-500 mr-2">&gt;</span>}
            {msg.text}
          </div>
          {msg.groundingLinks && (
            <div className="mt-2 ml-4 flex flex-wrap gap-2">
              {msg.groundingLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
});

export default TerminalOutput;
