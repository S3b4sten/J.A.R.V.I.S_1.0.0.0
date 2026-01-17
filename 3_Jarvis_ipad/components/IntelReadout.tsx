
import React from 'react';

interface IntelReadoutProps {
  value: string;
  isVisible: boolean;
}

const IntelReadout: React.FC<IntelReadoutProps> = ({ value, isVisible }) => {
  if (!isVisible || !value) return null;

  const isFault = value.includes('FAULT') || value.includes('OFFLINE') || value.includes('ERROR');

  return (
    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-700 z-40 w-full max-w-lg px-4">
      <div className="relative group">
        {/* Decorative corner brackets */}
        <div className={`absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 transition-colors duration-500 ${isFault ? 'border-red-500' : 'border-cyan-400'} opacity-50`}></div>
        <div className={`absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 transition-colors duration-500 ${isFault ? 'border-red-500' : 'border-cyan-400'} opacity-50`}></div>
        <div className={`absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 transition-colors duration-500 ${isFault ? 'border-red-500' : 'border-cyan-400'} opacity-50`}></div>
        <div className={`absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 transition-colors duration-500 ${isFault ? 'border-red-500' : 'border-cyan-400'} opacity-50`}></div>
        
        <div className={`bg-black/60 backdrop-blur-2xl border ${isFault ? 'border-red-500/40' : 'border-cyan-500/20'} p-8 flex flex-col items-center shadow-[0_0_80px_rgba(0,212,255,0.15)] relative overflow-hidden transition-colors duration-500`}>
          {/* Subtle background scanline for the box */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

          <div className={`flex items-center gap-3 mb-6 border-b ${isFault ? 'border-red-500/40' : 'border-cyan-500/20'} pb-2 w-full justify-center relative`}>
            <div className={`w-1.5 h-1.5 ${isFault ? 'bg-red-500 shadow-[0_0_10px_#ff0000]' : 'bg-cyan-400 shadow-[0_0_10px_#00d4ff]'} rounded-full animate-pulse`}></div>
            <span className={`font-orbitron text-[10px] tracking-[0.5em] ${isFault ? 'text-red-400' : 'text-cyan-400'} uppercase opacity-80`}>
              {isFault ? 'System_Fault_Detected' : 'Data_Extraction_Module'}
            </span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <span className={`text-[10px] font-mono ${isFault ? 'text-red-500/40' : 'text-cyan-500/40'} uppercase tracking-[0.3em] mb-3`}>
              {isFault ? 'Diagnostics:' : 'Analysis_Result:'}
            </span>
            <span className={`text-4xl md:text-6xl font-mono font-bold ${isFault ? 'text-red-100' : 'text-cyan-50'} tracking-tight text-center leading-tight glow-text-sharp transition-colors duration-500`}>
              {value}
            </span>
          </div>
          
          <div className="mt-8 flex justify-between items-center w-full">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 w-4 ${isFault ? 'bg-red-500/20' : 'bg-cyan-500/20'} rounded-full`}>
                  <div className={`h-full ${isFault ? 'bg-red-400' : 'bg-cyan-400'} w-full animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                </div>
              ))}
            </div>
            <span className={`text-[9px] font-mono tracking-widest uppercase ${isFault ? 'text-red-500/40' : 'text-cyan-500/40'}`}>
              {isFault ? 'Recalibration_Required' : 'Verified_By_Jarvis'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .glow-text-sharp {
          text-shadow: 0 0 1px rgba(255, 255, 255, 0.8), 
                       0 0 12px ${isFault ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 212, 255, 0.4)'};
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
};

export default IntelReadout;
