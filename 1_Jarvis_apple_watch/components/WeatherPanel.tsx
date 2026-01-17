
import React from 'react';

interface WeatherPanelProps {
  location?: { lat: number; lng: number };
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ location }) => {
  return (
    <div className="glow-border bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-3 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-7.07 1.07l-1.79 1.79 1.41 1.41 1.79-1.79-1.41-1.41zM11 19v3h2v-3h-2z" />
        </svg>
      </div>
      
      <h3 className="text-[10px] font-orbitron text-cyan-500 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
        Atmospheric Conditions
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-orbitron">22°<span className="text-xs ml-1 opacity-50 font-mono">C</span></span>
          <span className="text-[10px] uppercase font-mono opacity-60">Partly Cloudy</span>
        </div>
        <div className="text-right font-mono text-[10px]">
          <div className="flex justify-between gap-4">
            <span className="opacity-40 uppercase">Humidity</span>
            <span>42%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="opacity-40 uppercase">UV Index</span>
            <span className="text-yellow-500">LOW</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="opacity-40 uppercase">Precip</span>
            <span>0%</span>
          </div>
        </div>
      </div>

      <div className="mt-2 h-1 bg-cyan-950 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-500/30 w-1/3 animate-pulse"></div>
      </div>
      <div className="text-[8px] opacity-30 font-mono text-center">LOCAL_STATION_SYNC_COMPLETE</div>
    </div>
  );
};

export default WeatherPanel;
