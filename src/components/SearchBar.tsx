import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';

interface SearchBarProps {
  onCityChange: (city: string) => void;
  initialCity?: string;
}

const POPULAR_CITIES = [
  'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 
  'Dubai', 'Singapore', 'Rome', 'Berlin', 'Mumbai'
];

const SearchBar: React.FC<SearchBarProps> = ({ onCityChange, initialCity = '' }) => {
  const [query, setQuery] = useState(initialCity);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the search bar on mount
    gsap.fromTo(
      inputRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onCityChange(query.trim());
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    onCityChange(city);
    setSuggestions([]);
    setIsFocused(false);
  };

  useEffect(() => {
    // Animation for suggestions
    if (suggestions.length > 0 && isFocused) {
      gsap.fromTo(
        suggestionsRef.current?.children || [],
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.2 }
      );
    }
  }, [suggestions, isFocused]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for a city..."
          className="w-full py-3 px-4 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white 
                    p-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Go
        </button>
      </form>
      
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;