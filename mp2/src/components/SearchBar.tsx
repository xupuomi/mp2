import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search movies and TV shows...", 
  initialValue = "" 
}) => {
  const [query, setQuery] = useState<string>(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <label htmlFor="search-input" className="search-label">
        Search Movies and TV Shows
      </label>
      <div className="search-input-container">
        <input
          id="search-input"
          name="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="search-button"
          aria-label="Search"
        >
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;