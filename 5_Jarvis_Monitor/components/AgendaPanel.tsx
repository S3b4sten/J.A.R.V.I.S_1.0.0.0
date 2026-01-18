import React, { useState, useEffect } from 'react';
import { AgendaItem } from '../types';

const AgendaPanel: React.FC = () => {
  const [items, setItems] = useState<AgendaItem[]>([]);

  // Charger depuis le LocalStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('jarvis-agenda');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Données par défaut si vide
      setItems([
        { time: '09:00', task: 'SYSTEM INITIALIZATION', priority: 'CRITICAL' },
      ]);
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem('jarvis-agenda', JSON.stringify(items));
  }, [items]);

  // Fonction pour ajouter une tâche (via prompt pour l'instant)
  const handleAddTask = () => {
    const task = prompt("Enter Protocol Task Name:");
    if (!task) return;
    const time = prompt("Enter Time (HH:MM):") || "00:00";
    const priority = confirm("Is this CRITICAL priority?") ? "CRITICAL" : "NORMAL";
    
    setItems(prev => [...prev, { time, task, priority: priority as 'CRITICAL' | 'NORMAL' | 'HIGH' }].sort((a,b) => a.time.localeCompare(b.time)));
  };

  // Supprimer une tâche au clic
  const handleRemoveTask = (index: number) => {
    if(confirm("Terminate this protocol?")) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-full h-full bg-black/40 border border-cyan-500/20 p-2 backdrop-blur-md relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700 flex flex-col">
      <div className="flex justify-between items-center mb-1 border-b border-cyan-500/10 pb-0.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></div>
          <h3 className="font-orbitron text-[8px] tracking-[0.4em] text-cyan-400 uppercase">Daily_Protocol</h3>
        </div>
        <button 
          onClick={handleAddTask}
          className="text-[7px] font-mono text-cyan-500 hover:text-cyan-200 cursor-pointer uppercase border border-cyan-500/30 px-1 rounded hover:bg-cyan-500/20 transition-colors"
        >
          + ADD
        </button>
      </div>

      <div className="mb-1.5 p-1 bg-cyan-500/5 border-l-2 border-cyan-400 flex justify-between items-center shrink-0">
        <div className="min-w-0">
          <div className="text-[5.5px] font-mono text-cyan-500/60 uppercase tracking-tighter">Current_Op</div>
          <div className="text-[8.5px] font-orbitron text-cyan-50 uppercase truncate leading-tight tracking-wider">
             {items.length > 0 ? items[0].task : "IDLE"}
          </div>
        </div>
        <div className="text-right ml-2 shrink-0">
          <div className="text-[5.5px] font-mono text-cyan-400/40 uppercase">COUNT</div>
          <div className="text-[8px] font-orbitron text-cyan-200">{items.length}</div>
        </div>
      </div>
      
      <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => handleRemoveTask(idx)}
            className="flex items-center gap-2 border-b border-white/5 pb-0.5 cursor-pointer hover:bg-white/5 transition-colors group"
          >
            <div className="w-7 text-[7px] font-mono text-cyan-500/40 tabular-nums shrink-0 group-hover:text-red-400">{item.time}</div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="text-[7.5px] font-mono text-cyan-100 uppercase tracking-tight truncate">{item.task}</div>
              <div className="flex items-center gap-1">
                <div className={`w-0.5 h-0.5 rounded-full ${item.priority === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-cyan-500'}`}></div>
                <span className="text-[5.5px] font-mono text-cyan-700 uppercase tracking-widest">{item.priority}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
            <div className="text-[8px] font-mono text-cyan-500/30 text-center mt-4">NO PROTOCOLS ASSIGNED</div>
        )}
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