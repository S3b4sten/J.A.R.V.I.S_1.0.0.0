
import React from 'react';
import { SystemStatus } from '../types';

interface SystemStatsProps {
  status: SystemStatus;
}

const SystemStats: React.FC<SystemStatsProps> = ({ status }) => {
  const StatItem = ({ label, value, unit, colorClass = "text-cyan-400" }: { label: string, value: string | number, unit: string, colorClass?: string }) => (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-end">
        <span className="text-[9px] text-cyan-400/40 font-mono uppercase">{label}</span>
        <span className={`text-xs font-orbitron ${colorClass}`}>{value}<span className="text-[9px] ml-0.5 opacity-50">{unit}</span></span>
      </div>
      <div className="h-0.5 bg-cyan-950 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-500/60 transition-all duration-1000" style={{ width: `${Math.min(100, Number(value))}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="glow-border bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-3">
      <h3 className="text-[10px] font-orbitron text-cyan-500 uppercase tracking-widest border-b border-cyan-900 pb-1">System Core</h3>
      <StatItem label="CPU" value={status.cpu.toFixed(1)} unit="%" />
      <StatItem label="MEM" value={status.memory.toFixed(1)} unit="GB" />
      <StatItem label="NET" value={status.network.toFixed(0)} unit="MB" />
      <StatItem label="LAT" value={status.latency.toFixed(0)} unit="MS" />
    </div>
  );
};

export default SystemStats;
