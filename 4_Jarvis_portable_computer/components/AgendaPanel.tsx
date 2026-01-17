
import React from 'react';
import { AgendaItem } from '../types';

const MOCK_AGENDA: AgendaItem[] = [
  { time: '11:45', task: 'FUSION CORE MAINTENANCE', priority: 'CRITICAL' },
  { time: '14:00', task: 'RESERVE EVENT: GALA', priority: 'NORMAL' },
  { time: '17:30', task: 'DEBRIEF WITH RHODEY', priority: 'HIGH' }
];

const AgendaPanel: React.FC = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-cyan-500/20 p-4 backdrop-blur-md relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700 flex flex-col">
      <div className="flex justify-between items-center mb-3 border-b border-cyan-500/10 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></div>
          <h3 className="font-orbitron text-[9px] tracking-[0.4em] text-cyan-400 uppercase">Daily_Protocol</h3>
        </div>
        <span className="text-[7px] font-mono text-green-500/60 uppercase">Secure</span>
      </div>

      <div className="mb-3 p-2 bg-cyan-500/5 border-l-2 border-cyan-400 flex justify-between items-center shrink-0">
        <div className="min-w-0">
          <div className="text-[7px] font-mono text-cyan-500/60 mb-0.5 uppercase tracking-tighter">Active</div>
          <div className="text-[10px] font-orbitron text-cyan-50 uppercase truncate leading-tight tracking-wider">Fusion_Maint</div>
        </div>
        <div className="text-right ml-2 shrink-0">
          <div className="text-[7px] font-mono text-cyan-400/40 uppercase">ETA</div>
          <div className="text-[9px] font-orbitron text-cyan-200">00:42:15</div>
        </div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-1">
        {MOCK_AGENDA.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 border-b border-white/5 pb-1">
            <div className="w-10 text-[8px] font-mono text-cyan-500/40 tabular-nums shrink-0">{item.time}</div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="text-[9px] font-mono text-cyan-100 uppercase tracking-tight truncate">{item.task}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={`w-0.5 h-0.5 rounded-full ${item.priority === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-cyan-500'}`}></div>
                <span className="text-[6px] font-mono text-cyan-700 uppercase tracking-widest">{item.priority}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-[1px] w-full animate-[agendaScanLine_8s_linear_infinite] pointer-events-none"></div>
      <style>{`
        @keyframes agendaScanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600%); }
        }
      `}</style>
    </div>
  );
};

export default AgendaPanel;
