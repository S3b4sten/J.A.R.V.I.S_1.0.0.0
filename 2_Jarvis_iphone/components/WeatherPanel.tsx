import React from 'react';

interface WeatherPanelProps {
  location?: { lat: number; lng: number };
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ location }) => {
  return (
    <div className="bg-black/40 p-2 rounded backdrop-blur-md flex flex-col gap-1 relative overflow-hidden group border border-cyan-500/20 h-full">
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-0.5 shrink-0">
        <h3 className="text-[7.5px] font-orbitron text-cyan-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_cyan]"></span>
          Environment
        </h3>
        <span className="text-[5.5px] font-mono text-cyan-500/40 uppercase tracking-tighter">Uplink_OK</span>
      </div>
      
      <div className="flex flex-col gap-1.5 flex-1 justify-around overflow-hidden">
        {/* Primary Data Row */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-lg font-orbitron text-cyan-50 leading-none">22.4°<span className="text-[7px] ml-0.5 opacity-50 font-mono">C</span></span>
            <div className="text-right font-mono text-[6.5px] flex flex-col gap-0.5">
              <span className="text-cyan-200">HUM: 42%</span>
              <span className="text-cyan-200">WND: 14km/h</span>
            </div>
          </div>
          <span className="text-[6.5px] uppercase font-mono text-cyan-400/80 tracking-tighter mt-0.5">Partly_Cloudy_Sky</span>
        </div>

        {/* Secondary Detailed Metrics */}
        <div className="grid grid-cols-1 gap-1 border-y border-cyan-500/10 py-1">
          <div className="flex justify-between items-center">
            <span className="text-[5.5px] text-cyan-500/40 uppercase font-mono">Barometer</span>
            <span className="text-[7.5px] text-cyan-100 font-mono">1012.4 hPa</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[5.5px] text-cyan-500/40 uppercase font-mono">Visibility</span>
            <span className="text-[7.5px] text-cyan-100 font-mono">16.2 km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[5.5px] text-cyan-500/40 uppercase font-mono">AQI</span>
            <span className="text-[7.5px] text-green-400 font-mono">32 (EXC)</span>
          </div>
        </div>

        {/* Visual Pulse / Wave */}
        <div className="h-3 flex items-end justify-around gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-cyan-400 animate-[barPulse_2s_ease-in-out_infinite]"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                animationDelay: `${i * 0.15}s`
              }}
            ></div>
          ))}
        </div>

        <div className="pt-0.5 flex flex-col gap-0.5 shrink-0">
          <div className="text-[5.5px] font-mono uppercase text-cyan-500/40 tracking-widest">Global_POS</div>
          <div className="font-mono text-[6.5px] text-cyan-100 flex flex-col gap-0.5">
            <span className="tabular-nums">LAT: {location?.lat.toFixed(3) || "---"}</span>
            <span className="tabular-nums">LNG: {location?.lng.toFixed(3) || "---"}</span>
          </div>
        </div>
      </div>

      <div className="mt-0.5 h-0.5 bg-cyan-950 rounded-full overflow-hidden shrink-0">
        <div className="h-full bg-cyan-400/40 w-1/3 animate-[scanning_4s_infinite_linear]"></div>
      </div>

      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
      `}</style>
    </div>
  );
};

export default WeatherPanel;