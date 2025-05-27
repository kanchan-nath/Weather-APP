import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow,
  Sun, 
  CloudSun,
  Wind
} from 'lucide-react';

interface WeatherIconProps {
  weatherCode: number;
  description: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherCode, description }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      // Reset any previous animations
      gsap.set(iconRef.current, { clearProps: 'all' });
      
      // Create a new animation based on the weather type
      const tl = gsap.timeline({ repeat: -1 });
      
      if (weatherCode >= 200 && weatherCode < 300) {
        // Thunderstorm animation
        tl.to(iconRef.current, { 
          rotation: 2, 
          x: 2, 
          duration: 0.1, 
          repeat: 5, 
          yoyo: true 
        })
        .to(iconRef.current, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }, "+=0.5");
      } 
      else if (weatherCode >= 300 && weatherCode < 400 || (weatherCode >= 500 && weatherCode < 600)) {
        // Rain animation
        tl.to(iconRef.current, { 
          y: 3,
          duration: 0.8, 
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      }
      else if (weatherCode >= 600 && weatherCode < 700) {
        // Snow animation
        tl.to(iconRef.current, { 
          rotation: 5,
          duration: 2, 
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }
      else if (weatherCode >= 700 && weatherCode < 800) {
        // Atmosphere animation (fog, mist)
        tl.to(iconRef.current, { 
          opacity: 0.7,
          duration: 1.5, 
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      }
      else if (weatherCode === 800) {
        // Clear sky animation
        tl.to(iconRef.current, { 
          rotation: 360,
          duration: 20, 
          ease: "none",
          repeat: -1
        });
      }
      else if (weatherCode > 800 && weatherCode < 900) {
        // Clouds animation
        tl.to(iconRef.current, { 
          x: 5,
          duration: 3, 
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }
  }, [weatherCode]);

  const getWeatherIcon = () => {
    // Thunder
    if (weatherCode >= 200 && weatherCode < 300) {
      return <CloudLightning size={64} className="text-purple-500" />;
    }
    // Drizzle
    else if (weatherCode >= 300 && weatherCode < 400) {
      return <CloudDrizzle size={64} className="text-blue-400" />;
    }
    // Rain
    else if (weatherCode >= 500 && weatherCode < 600) {
      return <CloudRain size={64} className="text-blue-500" />;
    }
    // Snow
    else if (weatherCode >= 600 && weatherCode < 700) {
      return <CloudSnow size={64} className="text-blue-200" />;
    }
    // Atmosphere (fog, mist)
    else if (weatherCode >= 700 && weatherCode < 800) {
      return description.includes('fog') ? 
        <CloudFog size={64} className="text-gray-400" /> : 
        <Wind size={64} className="text-gray-500" />;
    }
    // Clear sky
    else if (weatherCode === 800) {
      return <Sun size={64} className="text-yellow-400" />;
    }
    // Clouds
    else if (weatherCode > 800 && weatherCode < 900) {
      return weatherCode === 801 ? 
        <CloudSun size={64} className="text-gray-500" /> : 
        <Cloud size={64} className="text-gray-500" />;
    }
    // Default
    return <Cloud size={64} className="text-gray-500" />;
  };

  return (
    <div ref={iconRef} className="flex items-center justify-center">
      {getWeatherIcon()}
    </div>
  );
};

export default WeatherIcon;