import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

interface StatState {
  cpu: number;
  memory: number;
  logic: number;
  network: number;
  latency: number;
  temp: number;
}

interface HistoryPoint {
  time: number;
  value: number;
}

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<StatState>({
    cpu: 0, memory: 0, logic: 100, network: 0, latency: 0, temp: 0
  });
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [connected, setConnected] = useState(false);

  const coreCount = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Connexion au script Python local
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        
        setConnected(true);
        setStats(prev => ({
          cpu: data.cpu,
          memory: data.memory,
          logic: data.logic,
          network: data.network,
          latency: Math.floor(Math.random() * 20) + 10, // Latence simulée
          temp: data.temp
        }));

        setHistory(prev => {
          const next = [...prev, { time: Date.now(), value: data.cpu }];
          return next.slice(-20);
        });

      } catch (error) {
        setConnected(false);
        // Mode dégradé (simulation) si Python n'est pas lancé
        setStats(prev => ({
            ...prev,
            cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
            temp: 0
        }));
      }
    };

    // Mise à jour toutes les secondes
    const interval = setInterval(fetchStats, 1000);
    fetchStats(); // Appel immédiat
    return () => clearInterval(interval);
  }, []);

  const MiniGauge = ({ value, label, color = "bg-cyan-400" }: { value: number, label: string, color?: string }) => (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-end">
        <span className="text-[6px] font-orbitron tracking-widest text-cyan-500/60 uppercase">{label}</span>
        <span className="text-[7.5px] font-mono text-cyan-100">{Math.round(value)}%</span>
      </div>
      <div className="h-[3px] w-full bg-cyan-950 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out shadow-[0_0_5px_currentColor]`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-top-4 duration-700">
      <div className={`h-full bg-black/40 backdrop-blur-xl border ${connected ? 'border-cyan-500/20' : 'border-red-500/20'} p-2 relative overflow-hidden group flex flex-col justify-between`}>
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 ${connected ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-red-500 shadow-[0_0_8px_red]'} rounded-full animate-pulse`}></div>
            <h3 className="font-orbitron text-[8px] tracking-[0.4em] text-cyan-400 uppercase">Core_Diagnostics</h3>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-1.5">
              <span className="text-[7px] font-mono text-cyan-500/40 uppercase">TEMP</span>
              <span className={`text-[8px] font-mono ${stats.temp > 70 ? 'text-red-400' : 'text-cyan-100'}`}>{stats.temp.toFixed(1)}°C</span>
            </div>
            <span className="font-mono text-[7px] text-cyan-500/40 uppercase">v{coreCount}.0_MK</span>
          </div>
        </div>

        <div className="flex-1 flex gap-4 my-0.5 overflow-hidden">
          {/* Main Stats Left */}
          <div className="w-1/2 flex flex-col justify-around py-0.5">
            <MiniGauge value={stats.cpu} label="Processor" />
            <MiniGauge value={stats.logic} label="Logic_Drive" color="bg-blue-400" />
            <MiniGauge value={stats.memory} label="Neural_Net" />
          </div>

          {/* Temporal Graph Right (Utilisation CPU) */}
          <div className="w-1/2 flex flex-col">
            <div className="flex justify-between items-center mb-0.5">
               <span className="text-[6px] font-orbitron tracking-widest text-cyan-500/60 uppercase">Load_History</span>
               <span className="text-[7.5px] font-mono text-cyan-100">{Math.round(stats.cpu)}%</span>
            </div>
            <div className="flex-1 bg-cyan-950/20 border border-cyan-500/10 rounded overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <YAxis hide domain={[0, 100]} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22d3ee" 
                    strokeWidth={1.5} 
                    dot={false} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[7px] font-mono uppercase border-t border-cyan-500/10 pt-1 opacity-50 shrink-0">
          <span className="tracking-widest">Link: {connected ? "SECURE (PYTHON)" : "OFFLINE (SIM)"}</span>
          <span className="tracking-widest">Ping: {stats.latency.toFixed(0)}MS</span>
        </div>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/20 animate-[scanningStats_8s_linear_infinite] pointer-events-none"></div>
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