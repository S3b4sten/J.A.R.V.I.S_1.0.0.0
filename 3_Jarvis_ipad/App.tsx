
import React, { useState, useEffect, useRef } from 'react';
import JarvisHUD from './components/JarvisHUD';
import SourcePanel from './components/SourcePanel';
import IntelReadout from './components/IntelReadout';
import ResponseDisplay from './components/ResponseDisplay';
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
  const [fullResponse, setFullResponse] = useState('');
  const [intelValue, setIntelValue] = useState('');
  const [textInput, setTextInput] = useState('');

  // Live session & Audio refs
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  // Retry Logic Helper
  const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error.status === 500 || error.code === 500 || !error.status)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return callWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  // Audio Utils
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const playPCMResponse = async (base64Audio: string) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    sourcesRef.current.add(source);
    source.onended = () => {
      sourcesRef.current.delete(source);
      if (sourcesRef.current.size === 0) setIsProcessing(false);
    };
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    setIsListening(false);
    setIsProcessing(false);
  };

  const startVoiceSession = async () => {
    try {
      setIsListening(true);
      setGroundingLinks([]);
      setShowSources(false);
      setShowLongResponse(false);
      setFullResponse('');
      setIntelValue('');
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
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
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setFullResponse(prev => prev + text);
              const words = text.trim().split(' ');
              if (words.length > 0) {
                const shortVal = words[words.length - 1].replace(/[.!?]/g, '');
                if (shortVal.length > 1) setIntelValue(shortVal.toUpperCase());
              }
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsProcessing(true);
              await playPCMResponse(audioData);
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            setIntelValue('CORE_FAULT');
            stopVoiceSession();
          },
          onclose: () => stopVoiceSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {}, 
          inputAudioTranscription: {},
          systemInstruction: "You are JARVIS. Respond briefly. Focus on high-value data points.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIntelValue('SYSTEM_OFFLINE');
      stopVoiceSession();
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const query = textInput;
    setTextInput('');
    setIsProcessing(true);
    setGroundingLinks([]);
    setShowSources(false);
    setShowLongResponse(false);
    setFullResponse('');
    setIntelValue('CALCULATING...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await callWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: "You are JARVIS. Use tools to verify facts. Keep responses concise but comprehensive.",
          tools: [{ googleSearch: {} }]
        }
      }));

      const fullResponseText = response.text || "Directives received.";
      setFullResponse(fullResponseText);

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const newLinks = chunks.map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null).filter((l: any) => l !== null);
      setGroundingLinks(newLinks);

      const intelResponse = await callWithRetry(() => ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: `Based on this text: "${fullResponseText}", provide ONLY the single most important specific keyword, value, or location mentioned. Max 2 words.`,
      }));
      setIntelValue(intelResponse.text?.trim().toUpperCase() || 'PROCESSED');

      const ttsResponse = await callWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: fullResponseText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        }
      }));

      const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        await playPCMResponse(audioData);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setIntelValue('INTERFACE_FAULT');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00080f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* HUD Frame Brackets */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t border-l border-cyan-500/10 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-16 h-16 border-t border-r border-cyan-500/10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b border-l border-cyan-500/10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-cyan-500/10 pointer-events-none"></div>

      <IntelReadout value={intelValue} isVisible={!!intelValue && !showSources && !showLongResponse} />

      <SourcePanel 
        links={groundingLinks} 
        isVisible={showSources} 
        onClose={() => setShowSources(false)} 
      />

      <ResponseDisplay 
        text={fullResponse} 
        isVisible={showLongResponse} 
        onClose={() => setShowLongResponse(false)}
      />

      <div className={`z-10 transition-all duration-700 ${showSources || showLongResponse ? 'translate-y-24 opacity-10 scale-90 blur-md' : ''}`}>
        <JarvisHUD 
          isActive={isListening} 
          isProcessing={isProcessing} 
          onClick={isListening ? stopVoiceSession : startVoiceSession} 
        />
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-20 flex gap-2">
        <form onSubmit={handleTextSubmit} className="relative group flex-1">
          <div className="absolute -top-6 left-0 flex items-center gap-2">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="font-orbitron text-[8px] tracking-[0.4em] text-cyan-500/50 uppercase">Manual_Command_Override</span>
          </div>
          
          <input 
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="ENTER_DIRECTIVE_HERE..."
            disabled={isProcessing}
            className="w-full bg-black/40 border border-cyan-500/20 rounded-none px-4 py-3 text-sm text-cyan-100 font-mono focus:outline-none focus:border-cyan-400/60 focus:bg-cyan-500/5 transition-all placeholder:text-cyan-900 placeholder:font-orbitron"
          />
          
          <div className="absolute inset-0 -z-10 bg-cyan-500/0 group-focus-within:bg-cyan-500/5 blur-xl transition-all duration-500"></div>
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => { setShowLongResponse(!showLongResponse); setShowSources(false); }}
            disabled={!fullResponse}
            className={`px-4 py-3 border font-orbitron text-[10px] tracking-widest transition-all duration-300 ${
              fullResponse 
                ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black cursor-pointer' 
                : 'border-white/10 text-white/10 cursor-not-allowed opacity-30'
            }`}
          >
            DATA
          </button>
          <button
            onClick={() => { setShowSources(!showSources); setShowLongResponse(false); }}
            disabled={groundingLinks.length === 0}
            className={`px-4 py-3 border font-orbitron text-[10px] tracking-widest transition-all duration-300 ${
              groundingLinks.length > 0 
                ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                : 'border-white/10 text-white/10 cursor-not-allowed opacity-30'
            }`}
          >
            SRC
          </button>
        </div>
      </div>

      <div className="absolute bottom-24 w-full flex flex-col items-center pointer-events-none gap-2">
        <div className="font-orbitron text-[7px] tracking-[0.8em] text-cyan-500/20 uppercase">
          {isListening ? 'Neural Link Engaged' : isProcessing ? 'Data Extraction' : 'System Hibernation'}
        </div>
      </div>
    </div>
  );
};

export default App;
