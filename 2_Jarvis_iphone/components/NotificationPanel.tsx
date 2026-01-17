
import React from 'react';
import { NotificationItem } from '../types';

const MOCK_NOTIFS: NotificationItem[] = [
  { id: '1', type: 'SECURITY', content: 'Perimeter breach sector 7-G (False)', time: '02:14' },
  { id: '2', type: 'SYSTEM', content: 'Armor integrity scan: 98%', time: '05:42' },
  { id: '3', type: 'COMM', content: 'Message from Ms. Potts queued', time: 'NOW' },
];

const NotificationPanel: React.FC = () => {
  return (
    <div className="bg-black/40 p-2.5 rounded backdrop-blur-md flex flex-col gap-1.5 h-full border border-cyan-500/20 overflow-hidden group">
      <div className="flex justify-between items-center border-b border-red-900/40 pb-1">
        <h3 className="text-[8px] font-orbitron text-red-500 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ff0000]"></span>
          Priority_Alerts
        </h3>
        <span className="text-[6px] font-mono text-red-500/40 uppercase">Level_1</span>
      </div>
      
      <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-1">
        {MOCK_NOTIFS.map((notif) => (
          <div key={notif.id} className="text-[8px] border-l border-red-500/30 pl-2 py-1 bg-red-500/5 hover:bg-red-500/10 transition-colors">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[5.5px] font-bold text-red-400 uppercase tracking-tighter">{notif.type}</span>
              <span className="text-[6px] font-mono text-red-900">{notif.time}</span>
            </div>
            <div className="text-cyan-100/90 leading-tight font-mono text-[9px] line-clamp-2 break-words">
              {notif.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
