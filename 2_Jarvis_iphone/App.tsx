import React, { useState, useEffect, useRef } from 'react';
import JarvisHUD from './components/JarvisHUD';
import SourcePanel from './components/SourcePanel';
import TextInputOverlay from './components/TextInputOverlay';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface GroundingLink {
  title: string;
  uri: string;
}

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [groundingLinks, setGroundingLinks] = useState<GroundingLink[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponseBox, setShowResponseBox] = useState(false);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const triggerResponse = (text: string) => {
    // Keep it short: one word, one number, or a short phrase (name/unit). 
    // We trim conversational filler via system instructions primarily.
    const cleaned = text.trim().toUpperCase();
    if (cleaned) {
      setResponseText(cleaned);
      setShowResponseBox(true);
    }
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    setIsListening(false);
    setIsProcessing(false);
  };

  const startVoiceSession = async () => {
    try {
      setIsListening(true);
      setGroundingLinks([]);
      setShowSources(false);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outCtx = new AudioContext({ sampleRate: 24000 });
      const inCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = outCtx;
      inputAudioContextRef.current = inCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) triggerResponse(text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsProcessing(true);
              const buffer = await outCtx.decodeAudioData(new Uint8Array(atob(audioData).split('').map(c => c.charCodeAt(0))).buffer);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsProcessing(false);
              };
            }
          },
          onerror: () => stopVoiceSession(),
          onclose: () => stopVoiceSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are JARVIS. RESPONSE RULE: DO NOT use complete sentences. Provide ONLY the core answer. If it is a name, provide the FULL NAME. If it is a measurement, provide the VALUE and UNIT. Otherwise, provide EXACTLY ONE WORD or ONE NUMBER. NO punctuation. NO phrases like 'It is', 'The answer is', or 'Sir'.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { stopVoiceSession(); }
  };

  const handleManualTransmit = async (query: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { 
          systemInstruction: "You are JARVIS. NO SENTENCES. If name, full name. If measure, value + unit. Otherwise one word/number. NO conversational filler.",
          tools: [{ googleSearch: {} }] 
        }
      });
      const text = response.text || "ERROR";
      triggerResponse(text);
      setGroundingLinks(response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((l: any) => l) || []);
      setIsProcessing(false);
    } catch { 
      setIsProcessing(false); 
      triggerResponse("FAULT");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#00080f] text-cyan-400 overflow-hidden relative font-mono select-none flex flex-col items-center p-6">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* TOP: Response Box Area */}
      <div className="h-[25%] w-full flex items-center justify-center pt-8 z-30">
        {showResponseBox && (
          <div className="relative w-full max-w-xs animate-in fade-in zoom-in duration-200">
            {/* Tech Box */}
            <div className="bg-black/80 border border-cyan-500/40 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,212,255,0.15)] relative">
              {/* Close Button Top Right */}
              <button 
                onClick={() => setShowResponseBox(false)}
                className="absolute top-2 right-2 text-cyan-500/60 hover:text-cyan-400 text-[10px] font-orbitron transition-colors border border-cyan-500/20 px-1 py-0.5 rounded bg-black/40"
              >
                CLOSE [X]
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-orbitron tracking-[0.4em] text-cyan-500/50 uppercase mb-3">Core_Readout</span>
                <span className="text-3xl md:text-4xl font-orbitron font-bold tracking-tight text-cyan-50 glow-text-sharp text-center leading-tight">
                  {responseText}
                </span>
              </div>

              {/* Decorative brackets for the content */}
              <div className="absolute left-1 top-1 w-2 h-2 border-t border-l border-cyan-500/40"></div>
              <div className="absolute right-1 bottom-1 w-2 h-2 border-b border-r border-cyan-500/40"></div>
            </div>
          </div>
        )}
      </div>

      {/* CENTER: Main JARVIS HUD (Positioned slightly higher) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-4 relative">
         <div className="transform scale-[2.5] relative z-20">
           <JarvisHUD 
            isActive={isListening} 
            isProcessing={isProcessing} 
            onClick={isListening ? stopVoiceSession : startVoiceSession} 
          />
         </div>
         {/* Orbiting background circles */}
         <div className="absolute top-20 w-80 h-80 border border-cyan-500/5 rounded-full animate-[ping_20s_linear_infinite] pointer-events-none"></div>
      </div>

      {/* BOTTOM: Manual Controls (Centered Horizontal Button) */}
      <div className="w-full max-w-sm flex flex-col items-center pb-12 gap-6 z-40">
        <div className="flex flex-col items-center gap-1 opacity-60">
          <span className="font-orbitron text-[10px] tracking-[0.6em] text-cyan-500 uppercase">
            {isListening ? 'Streaming' : isProcessing ? 'Processing' : 'Standby'}
          </span>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
        </div>

        <button 
          onClick={() => setShowTextInput(true)} 
          className="w-full py-5 border border-cyan-500/40 bg-cyan-950/20 backdrop-blur-md font-orbitron text-[12px] tracking-[0.4em] uppercase transition-all hover:bg-cyan-500/20 hover:border-cyan-400 active:scale-95 text-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.05)]"
        >
          Terminal_Input
        </button>
        
        {groundingLinks.length > 0 && (
          <button 
            onClick={() => setShowSources(true)} 
            className="flex items-center gap-2 text-[9px] font-orbitron tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors uppercase"
          >
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
            Data_Nodes_Available
          </button>
        )}
      </div>

      <SourcePanel links={groundingLinks} isVisible={showSources} onClose={() => setShowSources(false)} />
      <TextInputOverlay isVisible={showTextInput} onClose={() => setShowTextInput(false)} onTransmit={handleManualTransmit} />
      
      {/* HUD Corner Brackets */}
      <div className="fixed top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-cyan-500/10 pointer-events-none"></div>
      <div className="fixed top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-cyan-500/10 pointer-events-none"></div>
      <div className="fixed bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-cyan-500/10 pointer-events-none"></div>
      <div className="fixed bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-cyan-500/10 pointer-events-none"></div>

      <style>{`
        .glow-text-sharp {
          text-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;