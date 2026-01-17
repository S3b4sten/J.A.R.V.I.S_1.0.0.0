
import React, { useState, useEffect, useRef } from 'react';

interface TextInputOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onTransmit: (text: string) => void;
}

const TextInputOverlay: React.FC<TextInputOverlayProps> = ({ isVisible, onClose, onTransmit }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setText('');
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTransmit(text);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#001219]/90 border border-cyan-500/30 shadow-[0_0_100px_rgba(0,212,255,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]"></div>
            <span className="font-orbitron text-xs tracking-[0.4em] text-cyan-400 uppercase">Manual_Command_Interface</span>
          </div>
          <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest">Protocol_11_Secure</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="relative">
            <div className="absolute -top-3 left-4 px-2 bg-[#001219] text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest z-10">
              Input_Buffer
            </div>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Awaiting directives, Sir..."
              className="w-full h-32 bg-cyan-500/5 border border-cyan-500/20 p-4 font-mono text-cyan-50 text-lg focus:outline-none focus:border-cyan-400/60 resize-none custom-scrollbar placeholder:text-cyan-900/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-red-500/30 text-red-500 font-orbitron text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              DISCONNECT
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-8 py-2 border border-cyan-500 text-cyan-400 font-orbitron text-[10px] tracking-widest hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed group flex items-center gap-2"
            >
              <span>TRANSMIT</span>
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-2 bg-cyan-500/5 border-t border-cyan-500/10 flex justify-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
              <span className="text-[7px] font-mono text-cyan-500/40 uppercase">Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
              <span className="text-[7px] font-mono text-cyan-500/40 uppercase">Direct_Link</span>
            </div>
          </div>
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

export default TextInputOverlay;
