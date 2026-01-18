import React, { useEffect, useState } from 'react';

interface WeatherPanelProps {
  location?: { lat: number; lng: number };
}

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ location }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Codes WMO simplifiés pour l'affichage texte
  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear_Sky";
    if (code >= 1 && code <= 3) return "Partly_Cloudy";
    if (code >= 45 && code <= 48) return "Fog_Detected";
    if (code >= 51 && code <= 67) return "Rain_Activity";
    if (code >= 71 && code <= 77) return "Snow_Fall";
    if (code >= 95) return "Thunderstorm";
    return "Unknown_Atmosphere";
  };

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        // Utilisation de l'API Open-Meteo (gratuite, sans clé API)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&wind_speed_unit=kmh`
        );
        const json = await response.json();
        
        setData({
          temp: json.current.temperature_2m,
          humidity: json.current.relative_humidity_2m,
          windSpeed: json.current.wind_speed_10m,
          pressure: json.current.surface_pressure,
          weatherCode: json.current.weather_code
        });
        setLoading(false);
      } catch (error) {
        console.error("Weather data fetch failed", error);
      }
    };

    fetchWeather();
    // Rafraîchir toutes les 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [location]);

  return (
    <div className="bg-black/40 p-2 rounded backdrop-blur-md flex flex-col gap-1 relative overflow-hidden group border border-cyan-500/20 h-full">
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-0.5 shrink-0">
        <h3 className="text-[7.5px] font-orbitron text-cyan-400 uppercase tracking-widest flex items-center gap-1">
          <span className={`w-1 h-1 rounded-full ${loading ? 'bg-yellow-500' : 'bg-cyan-400'} animate-pulse shadow-[0_0_5px_cyan]`}></span>
          Environment
        </h3>
        <span className="text-[5.5px] font-mono text-cyan-500/40 uppercase tracking-tighter">
            {location ? "Uplink_Established" : "Searching_Signal..."}
        </span>
      </div>
      
      <div className="flex flex-col gap-1.5 flex-1 justify-around overflow-hidden">
        {/* Primary Data Row */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-lg font-orbitron text-cyan-50 leading-none">
              {data ? data.temp.toFixed(1) : "--.-"}°<span className="text-[7px] ml-0.5 opacity-50 font-mono">C</span>
            </span>
            <div className="text-right font-mono text-[6.5px] flex flex-col gap-0.5">
              <span className="text-cyan-200">HUM: {data ? data.humidity : "--"}%</span>
              <span className="text-cyan-200">WND: {data ? data.windSpeed : "--"}km/h</span>
            </div>
          </div>
          <span className="text-[6.5px] uppercase font-mono text-cyan-400/80 tracking-tighter mt-0.5">
            {data ? getWeatherDescription(data.weatherCode) : "Scanning..."}
          </span>
        </div>

        {/* Secondary Detailed Metrics */}
        <div className="grid grid-cols-1 gap-1 border-y border-cyan-500/10 py-1">
          <div className="flex justify-between items-center">
            <span className="text-[5.5px] text-cyan-500/40 uppercase font-mono">Barometer</span>
            <span className="text-[7.5px] text-cyan-100 font-mono">{data ? data.pressure : "----"} hPa</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[5.5px] text-cyan-500/40 uppercase font-mono">SensorStatus</span>
            <span className="text-[7.5px] text-green-400 font-mono">ACTIVE</span>
          </div>
        </div>

        {/* Visual Pulse / Wave */}
        <div className="h-3 flex items-end justify-around gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-cyan-400 animate-[barPulse_2s_ease-in-out_infinite]"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                animationDelay: `${i * 0.15}s`
              }}
            ></div>
          ))}
        </div>

        <div className="pt-0.5 flex flex-col gap-0.5 shrink-0">
          <div className="text-[5.5px] font-mono uppercase text-cyan-500/40 tracking-widest">Global_POS</div>
          <div className="font-mono text-[6.5px] text-cyan-100 flex flex-col gap-0.5">
            <span className="tabular-nums">LAT: {location?.lat.toFixed(3) || "---"}</span>
            <span className="tabular-nums">LNG: {location?.lng.toFixed(3) || "---"}</span>
          </div>
        </div>
      </div>

      <div className="mt-0.5 h-0.5 bg-cyan-950 rounded-full overflow-hidden shrink-0">
        <div className="h-full bg-cyan-400/40 w-1/3 animate-[scanning_4s_infinite_linear]"></div>
      </div>
      
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
      `}</style>
    </div>
  );
};

export default WeatherPanel;