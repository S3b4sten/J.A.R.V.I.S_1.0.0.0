
import React from 'react';
import { AgendaItem } from '../types';

const MOCK_AGENDA: AgendaItem[] = [
  { time: '09:00', task: 'STARK INDUSTRIES BOARD', priority: 'HIGH' },
  { time: '11:45', task: 'FUSION CORE MAINTENANCE', priority: 'CRITICAL' },
  { time: '14:00', task: 'RESERVE EVENT: GALA INTERCEPT', priority: 'NORMAL' },
  { time: '17:30', task: 'DEBRIEF WITH RHODEY', priority: 'HIGH' }
];

const AgendaPanel: React.FC = () => {
  return (
    <div className="glow-border bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-3 min-h-[180px]">
      <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
        <h3 className="text-[10px] font-orbitron text-cyan-500 uppercase tracking-widest">
          Schedule & Logistics
        </h3>
        <span className="text-[9px] px-1 bg-cyan-500/20 rounded">SYNC: OK</span>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-40 no-scrollbar">
        {MOCK_AGENDA.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 relative group">
            <div className="text-[9px] font-mono opacity-50 w-10 shrink-0">{item.time}</div>
            <div className="flex-1 border-l-2 border-cyan-900/50 pl-3 group-hover:border-cyan-400 transition-all">
              <div className="text-[11px] font-bold text-cyan-100 leading-tight uppercase tracking-tight">{item.task}</div>
              <div className={`text-[8px] font-mono mt-0.5 ${
                item.priority === 'CRITICAL' ? 'text-red-500' : 
                item.priority === 'HIGH' ? 'text-yellow-500' : 'text-cyan-700'
              }`}>
                [{item.priority}]
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaPanel;
