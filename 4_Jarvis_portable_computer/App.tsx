
import React, { useState, useEffect, useRef } from 'react';
import JarvisHUD from './components/JarvisHUD';
import SourcePanel from './components/SourcePanel';
import IntelReadout from './components/IntelReadout';
import ResponseDisplay from './components/ResponseDisplay';
import SystemStats from './components/SystemStats';
import WeatherPanel from './components/WeatherPanel';
import ClockQuote from './components/ClockQuote';
import NotificationPanel from './components/NotificationPanel';
import TextInputOverlay from './components/TextInputOverlay';
import AgendaPanel from './components/AgendaPanel';
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
  const [showLongResponse, setShowLongResponse] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [fullResponse, setFullResponse] = useState('');
  const [intelValue, setIntelValue] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>();

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.warn("Geolocation access denied.", error)
      );
    }
  }, []);

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
      setShowLongResponse(false);
      setShowTextInput(false);
      
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
            if (message.serverContent?.outputTranscription) setFullResponse(p => p + message.serverContent.outputTranscription.text);
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
          systemInstruction: "You are JARVIS. Respond briefly and with technical precision.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { stopVoiceSession(); }
  };

  const handleManualTransmit = async (query: string) => {
    setIsProcessing(true);
    setIntelValue('ANALYZING...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      setFullResponse(response.text || "");
      setGroundingLinks(response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((l: any) => l) || []);
      setIntelValue('PROCESSED');
      setIsProcessing(false);
    } catch { setIsProcessing(false); setIntelValue('ERROR'); }
  };

  return (
    <div className="h-screen w-screen bg-[#00080f] text-cyan-400 p-4 md:p-6 overflow-hidden relative font-mono select-none">
      {/* Background FX */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Interface Grid - 3 Columns (1/3 each) */}
      <div className="grid grid-cols-3 h-full gap-4 md:gap-6 relative z-10">
        
        {/* COLUMN LEFT - 8 Vertical Rows */}
        <div className="grid grid-rows-8 h-full gap-3 overflow-hidden">
          {/* Section 1-2 (2/8 - 25% height): Clock */}
          <div className="row-span-2 flex flex-col justify-center border-b border-cyan-500/10">
            <ClockQuote />
          </div>
          
          {/* Section 3-5 (3/8 - 37.5% height): Weather */}
          <div className="row-span-3 min-h-0">
            <WeatherPanel location={location} />
          </div>
          
          {/* Section 6-8 (3/8 - 37.5% height): Priority Alerts */}
          <div className="row-span-3 min-h-0">
            <NotificationPanel />
          </div>
        </div>

        {/* COLUMN MIDDLE - JARVIS CORE */}
        <div className="flex flex-col items-center justify-center relative h-full overflow-hidden">
          <div className="absolute top-[8%] w-full flex justify-center pointer-events-none">
            <IntelReadout value={intelValue} isVisible={!!intelValue && !showSources && !showLongResponse && !showTextInput} />
          </div>

          <div className={`transition-all duration-700 transform ${showSources || showLongResponse || showTextInput ? 'scale-50 opacity-10 blur-xl translate-y-10' : 'scale-100 opacity-100'}`}>
            <JarvisHUD 
              isActive={isListening} 
              isProcessing={isProcessing} 
              onClick={isListening ? stopVoiceSession : startVoiceSession} 
            />
          </div>

          <div className={`mt-8 flex flex-col items-center gap-4 transition-all duration-500 ${showSources || showLongResponse || showTextInput ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
            <button 
              onClick={() => setShowTextInput(true)}
              className="group relative px-8 py-2 border border-cyan-500/30 hover:border-cyan-400 bg-black/40 backdrop-blur-md"
            >
              <div className="relative flex items-center gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></div>
                <span className="font-orbitron text-[10px] tracking-[0.5em] text-cyan-500 group-hover:text-cyan-400 uppercase">Input_Directives</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowLongResponse(true); setShowSources(false); }}
                disabled={!fullResponse}
                className={`px-4 py-1 border font-orbitron text-[8px] tracking-[0.3em] transition-all ${
                  fullResponse ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(0,212,255,0.2)]' : 'border-white/5 text-white/5 opacity-20'
                }`}
              >
                DATA_LOG
              </button>
              <button
                onClick={() => { setShowSources(true); setShowLongResponse(false); }}
                disabled={groundingLinks.length === 0}
                className={`px-4 py-1 border font-orbitron text-[8px] tracking-[0.3em] transition-all ${
                  groundingLinks.length > 0 ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(0,212,255,0.2)]' : 'border-white/5 text-white/5 opacity-20'
                }`}
              >
                SOURCES
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN RIGHT - 2 Vertical Sections (50% each) */}
        <div className="grid grid-rows-2 h-full gap-4 overflow-hidden">
          {/* Top (50% height): Core Diagnostic */}
          <div className="min-h-0">
            <SystemStats />
          </div>
          
          {/* Bottom (50% height): Daily Protocol */}
          <div className="min-h-0">
            <AgendaPanel />
          </div>
        </div>
      </div>

      {/* OVERLAYS */}
      <SourcePanel links={groundingLinks} isVisible={showSources} onClose={() => setShowSources(false)} />
      <ResponseDisplay text={fullResponse} isVisible={showLongResponse} onClose={() => setShowLongResponse(false)} />
      <TextInputOverlay isVisible={showTextInput} onClose={() => setShowTextInput(false)} onTransmit={handleManualTransmit} />
      
      {/* Brackets */}
      <div className="fixed top-2 left-2 w-4 h-4 border-t border-l border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed top-2 right-2 w-4 h-4 border-t border-r border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-500/20 pointer-events-none"></div>
    </div>
  );
};

export default App;
