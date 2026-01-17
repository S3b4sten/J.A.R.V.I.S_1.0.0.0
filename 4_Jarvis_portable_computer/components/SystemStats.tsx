
import React, { useState, useEffect } from 'react';

interface StatState {
  cpu: number;
  memory: number;
  network: number;
  latency: number;
  temp: number;
}

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<StatState>({
    cpu: 12, memory: 45, network: 1.2, latency: 24, temp: 38
  });

  const coreCount = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 5)),
        latency: Math.max(15, Math.min(120, prev.latency + (Math.random() - 0.5) * 8)),
        temp: Math.max(30, Math.min(75, prev.temp + (Math.random() - 0.5) * 1.5))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const CircularGauge = ({ value, label, color = "stroke-cyan-400" }: { value: number, label: string, color?: string }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <svg className="w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-cyan-900/20" strokeWidth="2" />
            <circle
              cx="50%" cy="50%" r={radius}
              className={`fill-none ${color} transition-all duration-1000 ease-out`}
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-orbitron text-white">{Math.round(value)}%</span>
          </div>
        </div>
        <span className="text-[7px] font-mono tracking-widest uppercase text-cyan-500/60">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="h-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 p-4 relative overflow-hidden group flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></div>
            <h3 className="font-orbitron text-[9px] tracking-[0.4em] text-cyan-400 uppercase">Core_Diagnostics</h3>
          </div>
          <span className="font-mono text-[7px] text-cyan-500/40 uppercase">v{coreCount}.0_MK</span>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1 items-center">
          <CircularGauge value={stats.cpu} label="CPU" />
          <CircularGauge value={stats.memory} label="MEM" />
          <CircularGauge value={stats.temp} label="TMP" color={stats.temp > 65 ? "stroke-red-500" : "stroke-cyan-400"} />
        </div>

        <div className="space-y-2 pt-3 border-t border-cyan-500/10">
          <div className="flex justify-between items-center text-[8px] font-mono uppercase">
            <span className="opacity-40 tracking-widest">Link_Stable</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-200">{(100 - stats.latency / 2).toFixed(1)}%</span>
              <div className="w-10 h-1 bg-cyan-900 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${100 - stats.latency / 2}%` }}></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[8px] font-mono uppercase">
            <span className="opacity-40 tracking-widest">Ping_MS</span>
            <span className="text-cyan-200">{stats.latency.toFixed(0)}</span>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/10 animate-[scanningStats_5s_linear_infinite] pointer-events-none"></div>
      </div>
      <style>{`
        @keyframes scanningStats {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SystemStats;
