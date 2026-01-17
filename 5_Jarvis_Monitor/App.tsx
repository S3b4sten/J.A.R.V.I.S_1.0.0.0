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
import TerminalOutput from './components/TerminalOutput';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface GroundingLink {
  title: string;
  uri: string;
}

interface Message {
  role: 'user' | 'jarvis';
  text: string;
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
  const [messages, setMessages] = useState<Message[]>([]);

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
      setFullResponse('');
      setIntelValue('');
      
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
              setFullResponse(p => p + text);
            }
            
            if (message.serverContent?.turnComplete) {
              setMessages(prev => [...prev, { role: 'jarvis', text: fullResponse || "System Ready." }]);
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
          systemInstruction: "You are JARVIS. CRITICAL RULE: Your responses MUST be no longer than 2 sentences. Be technical, witty, and extremely concise. Prioritize speed and brevity.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { stopVoiceSession(); }
  };

  const handleManualTransmit = async (query: string) => {
    setIsProcessing(true);
    setIntelValue('ANALYZING...');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { 
          systemInstruction: "You are JARVIS. LIMIT YOUR RESPONSE TO 2 SENTENCES MAXIMUM. Be concise.",
          tools: [{ googleSearch: {} }] 
        }
      });
      const text = response.text || "";
      setFullResponse(text);
      setMessages(prev => [...prev, { role: 'jarvis', text: text }]);
      setGroundingLinks(response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((l: any) => l) || []);
      setIntelValue('');
      setIsProcessing(false);
    } catch { 
      setIsProcessing(false); 
      setIntelValue('ERROR'); 
      setMessages(prev => [...prev, { role: 'jarvis', text: "ERROR: Communication uplink failure." }]);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#00080f] text-cyan-400 p-2 md:p-3 overflow-hidden relative font-mono select-none flex flex-col gap-3">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* TOP ROW - Diagnostic Panel (Left column reduced to 16% width) */}
      <div className="grid grid-cols-[16%_1fr] gap-3 h-[16%] shrink-0 z-10">
        <div className="border-r border-cyan-500/10 pr-2 flex items-start pt-1">
          <ClockQuote />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SystemStats />
          <AgendaPanel />
        </div>
      </div>

      {/* BOTTOM SECTION - Main Interaction Hub (Left column reduced to 16% width) */}
      <div className="flex-1 grid grid-cols-[16%_1fr] gap-3 overflow-hidden">
        <div className="grid grid-rows-2 gap-3 overflow-hidden">
          <div className="min-h-0">
            <WeatherPanel location={location} />
          </div>
          <div className="min-h-0">
            <NotificationPanel />
          </div>
        </div>

        <div className="relative bg-black/20 border border-cyan-500/10 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]"></div>

          <div className="flex-1 relative flex flex-col p-4 overflow-hidden">
            {intelValue && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 pointer-events-none px-6">
                <IntelReadout value={intelValue} isVisible={true} />
              </div>
            )}

            <div className="flex-1 overflow-hidden relative">
              <TerminalOutput messages={messages} />
            </div>

            <div className="mt-2 flex items-end justify-between border-t border-cyan-500/20 pt-3 bg-black/40">
              <div className="flex items-center gap-4">
                 <JarvisHUD 
                  isActive={isListening} 
                  isProcessing={isProcessing} 
                  onClick={isListening ? stopVoiceSession : startVoiceSession} 
                />
                <div className="flex flex-col">
                  <span className="font-orbitron text-[10px] tracking-[0.2em] text-cyan-400">STATUS: {isListening ? 'LISTENING' : isProcessing ? 'THINKING' : 'IDLE'}</span>
                  <span className="text-[8px] opacity-40 font-mono uppercase">Vocal_Link_Channel_A1</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowTextInput(true)} className="px-4 py-1 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 font-orbitron text-[9px] tracking-[0.2em] uppercase transition-all">Direct_Input</button>
                <button onClick={() => setShowLongResponse(true)} disabled={!fullResponse} className={`px-4 py-1 border font-orbitron text-[9px] tracking-[0.2em] transition-all uppercase ${fullResponse ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black' : 'border-white/5 text-white/5 opacity-20'}`}>Full_Report</button>
                <button onClick={() => setShowSources(true)} disabled={groundingLinks.length === 0} className={`px-4 py-1 border font-orbitron text-[9px] tracking-[0.2em] transition-all uppercase ${groundingLinks.length > 0 ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black' : 'border-white/5 text-white/5 opacity-20'}`}>Archives</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SourcePanel links={groundingLinks} isVisible={showSources} onClose={() => setShowSources(false)} />
      <ResponseDisplay text={fullResponse} isVisible={showLongResponse} onClose={() => setShowLongResponse(false)} />
      <TextInputOverlay isVisible={showTextInput} onClose={() => setShowTextInput(false)} onTransmit={handleManualTransmit} />
      
      <div className="fixed top-2 left-2 w-4 h-4 border-t border-l border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed top-2 right-2 w-4 h-4 border-t border-r border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-500/20 pointer-events-none"></div>
      <div className="fixed bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-500/20 pointer-events-none"></div>
    </div>
  );
};

export default App;