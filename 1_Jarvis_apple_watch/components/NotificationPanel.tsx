
import React from 'react';
import { NotificationItem } from '../types';

const MOCK_NOTIFS: NotificationItem[] = [
  { id: '1', type: 'SECURITY', content: 'External perimeter breach detected in sector 7-G (False alarm)', time: '02:14' },
  { id: '2', type: 'SYSTEM', content: 'Armor integrity scan complete. Mark 85 at 98%', time: '05:42' },
  { id: '3', type: 'COMM', content: 'Incoming message from Ms. Potts queued', time: 'NOW' }
];

const NotificationPanel: React.FC = () => {
  return (
    <div className="glow-border bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-2">
      <h3 className="text-[10px] font-orbitron text-red-500 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
        Priority Alerts
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
        {MOCK_NOTIFS.map((notif) => (
          <div key={notif.id} className="text-[10px] border-l-2 border-red-900/50 pl-2 py-1 bg-red-500/5">
            <div className="flex justify-between opacity-50 text-[8px] font-bold">
              <span>{notif.type}</span>
              <span>{notif.time}</span>
            </div>
            <div className="text-cyan-100/80 leading-tight mt-0.5">{notif.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
