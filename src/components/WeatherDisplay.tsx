import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import WeatherIcon from './WeatherIcon';
import { WeatherData } from '../types/weather';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      // Create animation timeline
      const tl = gsap.timeline();
      
      tl.fromTo(
        '.weather-main',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      
      tl.fromTo(
        '.weather-info',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 },
        "-=0.3"
      );
      
      tl.fromTo(
        '.weather-icon-container',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5 },
        "-=0.4"
      );
    }
  }, [weatherData]);

  // Helper function to format temperature
  const formatTemp = (temp: number): string => {
    return `${Math.round(temp)}°C`;
  };

  // Get weather condition and time to determine background
  const getConditionClass = () => {
    const condition = weatherData.weather[0].main.toLowerCase();
    const backgroundClasses = {
      base: 'rounded-xl p-6 shadow-lg transition-all duration-500',
      light: {
        clear: 'bg-gradient-to-br from-yellow-100 to-blue-100 border border-yellow-200',
        clouds: 'bg-gradient-to-br from-gray-100 to-blue-100 border border-gray-200',
        rain: 'bg-gradient-to-br from-blue-100 to-gray-200 border border-blue-200',
        snow: 'bg-gradient-to-br from-blue-50 to-gray-100 border border-blue-100',
        default: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100'
      },
      dark: {
        clear: 'bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800',
        clouds: 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700',
        rain: 'bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-800',
        snow: 'bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-800',
        default: 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
      }
    };

    const isDark = document.documentElement.classList.contains('dark');
    const themeClasses = isDark ? backgroundClasses.dark : backgroundClasses.light;

    if (condition.includes('clear')) return `${backgroundClasses.base} ${themeClasses.clear}`;
    if (condition.includes('cloud')) return `${backgroundClasses.base} ${themeClasses.clouds}`;
    if (condition.includes('rain') || condition.includes('drizzle')) return `${backgroundClasses.base} ${themeClasses.rain}`;
    if (condition.includes('snow')) return `${backgroundClasses.base} ${themeClasses.snow}`;
    
    return `${backgroundClasses.base} ${themeClasses.default}`;
  };

  return (
    <div ref={displayRef} className="weather-data mb-8">
      <div className={getConditionClass()}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="weather-main text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-800 dark:text-white">
              {formatTemp(weatherData.main.temp)}
            </h2>
            <p className="weather-info text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200 capitalize">
              {weatherData.weather[0].description}
            </p>
            
            <div className="flex flex-wrap mt-4 gap-4">
              <div className="weather-info flex items-center text-gray-600 dark:text-gray-300">
                <Thermometer size={18} className="mr-1" />
                <span>Feels like: {formatTemp(weatherData.main.feels_like)}</span>
              </div>
              
              <div className="weather-info flex items-center text-gray-600 dark:text-gray-300">
                <Droplets size={18} className="mr-1" />
                <span>Humidity: {weatherData.main.humidity}%</span>
              </div>
              
              <div className="weather-info flex items-center text-gray-600 dark:text-gray-300">
                <Wind size={18} className="mr-1" />
                <span>Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h</span>
              </div>
            </div>
          </div>
          
          <div className="weather-icon-container flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
            <WeatherIcon 
              weatherCode={weatherData.weather[0].id} 
              description={weatherData.weather[0].description} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;