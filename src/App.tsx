import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import WeatherApp from './components/WeatherApp';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isLoading ? <LoadingScreen /> : <WeatherApp />}
    </ThemeProvider>
  );
}

export default App;