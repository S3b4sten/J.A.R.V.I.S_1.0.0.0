
import React from 'react';

interface WeatherPanelProps {
  location?: { lat: number; lng: number };
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ location }) => {
  return (
    <div className="bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-2 relative overflow-hidden group border border-cyan-500/20 h-full">
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-1">
        <h3 className="text-[9px] font-orbitron text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_cyan]"></span>
          Environment
        </h3>
        <span className="text-[7px] font-mono text-cyan-500/40 uppercase tracking-tighter">Uplink_OK</span>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 justify-center">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-orbitron text-cyan-50">22°<span className="text-[8px] ml-0.5 opacity-50 font-mono">C</span></span>
            <span className="text-[8px] uppercase font-mono text-cyan-400/80">Partly_Cloudy</span>
          </div>
          <div className="text-right font-mono text-[7px] space-y-0.5">
            <div className="flex justify-between gap-2">
              <span className="opacity-40 uppercase">HUM</span>
              <span className="text-cyan-200">42%</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="opacity-40 uppercase">UV</span>
              <span className="text-cyan-200">LOW</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="opacity-40 uppercase">WND</span>
              <span className="text-cyan-200">14km/h</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-cyan-500/10 flex flex-col gap-0.5">
          <div className="text-[7px] font-mono uppercase text-cyan-500/40 tracking-widest">Global_POS</div>
          <div className="font-mono text-[9px] text-cyan-100 flex justify-between">
            <span>LAT: {location?.lat.toFixed(3) || "---"}</span>
            <span>LNG: {location?.lng.toFixed(3) || "---"}</span>
          </div>
        </div>
      </div>

      <div className="mt-1 h-0.5 bg-cyan-950 rounded-full overflow-hidden shrink-0">
        <div className="h-full bg-cyan-400/40 w-1/3 animate-[scanning_4s_infinite_linear]"></div>
      </div>
    </div>
  );
};

export default WeatherPanel;
