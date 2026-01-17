
import React from 'react';
import { UserPreference } from '../types';

const PREFS: UserPreference[] = [
  { id: '1', label: 'BIO_LOCK', value: 'ENABLED', status: 'ACTIVE' },
  { id: '2', label: 'VOICE_ID', value: 'TONY_S', status: 'ACTIVE' },
  { id: '3', label: 'PROTOCOL_11', value: 'LOCKED', status: 'LOCKED' }
];

const PreferencePanel: React.FC = () => {
  return (
    <div className="glow-border bg-black/40 p-4 rounded backdrop-blur-md flex flex-col gap-3 xl:block hidden">
      <h3 className="text-[10px] font-orbitron text-cyan-500 uppercase tracking-widest border-b border-cyan-900 pb-2">
        User Protocols
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {PREFS.map((pref) => (
          <div key={pref.id} className="flex justify-between items-center bg-cyan-900/10 p-2 border border-cyan-900/30">
            <span className="text-[9px] opacity-60">{pref.label}</span>
            <span className={`text-[10px] font-bold ${pref.status === 'LOCKED' ? 'text-red-500' : 'text-green-500'}`}>
              {pref.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[8px] opacity-20 text-center font-mono">ENCRYPTION_LAYER_6_ACTIVE</div>
    </div>
  );
};

export default PreferencePanel;
