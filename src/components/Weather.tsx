import { useState } from 'react';
import { Cloud, Wind, Droplets, Gauge } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  wind_speed: number;
  pressure: number;
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?city=${encodeURIComponent(city)}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Weather Information</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {weather && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <h3 className="text-4xl font-bold mb-2">{weather.city}</h3>
            <p className="text-xl capitalize">{weather.description}</p>
          </div>

          <div className="text-center mb-8">
            <div className="text-7xl font-bold mb-2">{weather.temperature}°C</div>
            <p className="text-lg">Feels like {weather.feels_like}°C</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 flex items-center gap-3">
              <Wind className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Wind Speed</p>
                <p className="text-xl font-semibold">{weather.wind_speed} m/s</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 flex items-center gap-3">
              <Droplets className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Humidity</p>
                <p className="text-xl font-semibold">{weather.humidity}%</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 flex items-center gap-3">
              <Gauge className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Pressure</p>
                <p className="text-xl font-semibold">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
