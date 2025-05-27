import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import { fetchWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weather';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import ForecastSection from './ForecastSection';
import WeatherDetails from './WeatherDetails';
import ThemeToggle from './ThemeToggle';
import { CloudRain, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const WeatherApp = () => {
  const [city, setCity] = useState('New York');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveRef = useRef<any>(null);
  const { theme } = useTheme();

  // Initialize Locomotive Scroll
  useEffect(() => {
    if (scrollRef.current) {
      locomotiveRef.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      });
    }

    return () => {
      if (locomotiveRef.current) {
        locomotiveRef.current.destroy();
      }
    };
  }, [weatherData]);

  // Fetch weather data
  useEffect(() => {
    const getWeatherData = async () => {
      if (!city) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchWeatherData(city);
        setWeatherData(data);
        
        // Animate weather data update
        if (appRef.current) {
          gsap.fromTo(
            '.weather-data',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
          );
        }
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Error fetching weather data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getWeatherData();
  }, [city]);

  // Initial animation
  useEffect(() => {
    if (appRef.current) {
      gsap.fromTo(
        '.app-container',
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      gsap.fromTo(
        '.search-container',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
      );
    }
  }, []);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
  };

  // Determine background gradient based on weather condition and theme
  const getBackgroundGradient = () => {
    if (!weatherData) return theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-100 to-white';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (theme === 'dark') {
      if (condition.includes('clear')) return 'bg-gradient-to-b from-indigo-950 to-blue-950';
      if (condition.includes('cloud')) return 'bg-gradient-to-b from-gray-900 to-slate-900';
      if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-gradient-to-b from-gray-950 to-blue-950';
      if (condition.includes('thunder')) return 'bg-gradient-to-b from-gray-950 to-purple-950';
      if (condition.includes('snow')) return 'bg-gradient-to-b from-slate-900 to-gray-900';
      if (condition.includes('mist') || condition.includes('fog')) return 'bg-gradient-to-b from-slate-900 to-gray-900';
      return 'bg-gradient-to-b from-gray-900 to-gray-800';
    } else {
      if (condition.includes('clear')) return 'bg-gradient-to-b from-blue-400 to-sky-300';
      if (condition.includes('cloud')) return 'bg-gradient-to-b from-blue-200 to-gray-200';
      if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-gradient-to-b from-blue-300 to-gray-300';
      if (condition.includes('thunder')) return 'bg-gradient-to-b from-purple-300 to-gray-300';
      if (condition.includes('snow')) return 'bg-gradient-to-b from-blue-100 to-gray-100';
      if (condition.includes('mist') || condition.includes('fog')) return 'bg-gradient-to-b from-gray-200 to-gray-300';
      return 'bg-gradient-to-b from-blue-100 to-white';
    }
  };

  return (
    <div 
      ref={appRef}
      className={`app-container min-h-screen w-full transition-colors duration-500 ${getBackgroundGradient()}`}
    >
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div ref={scrollRef} className="locomotive-scroll">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:px-8">
          {/* Header Section */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <CloudRain className="mr-2 h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold dark:text-white">SkyView</h1>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-5 w-5 dark:text-gray-300" />
              <span className="text-sm font-medium dark:text-gray-300">
                {weatherData?.name}, {weatherData?.sys.country}
              </span>
            </div>
          </header>

          {/* Search Section */}
          <div className="search-container mb-8">
            <SearchBar onCityChange={handleCityChange} initialCity={city} />
          </div>

          {/* Weather Display */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          ) : weatherData && (
            <div data-scroll-section>
              <WeatherDisplay weatherData={weatherData} />
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div data-scroll data-scroll-speed="0.1">
                  <WeatherDetails weatherData={weatherData} />
                </div>
                <div data-scroll data-scroll-speed="0.2">
                  <ForecastSection city={city} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;