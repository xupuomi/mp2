import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Movie, TVShow, MediaType, TMDBResponse } from '../types/tmdb';
import { searchMulti, searchMovies, searchTVShows } from '../api/tmdb';
import SearchBar from '../components/SearchBar';
import SortControls from '../components/SortControls';
import CardItem from '../components/CardItem';

const ListView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'popularity.desc';
  const mediaType = searchParams.get('type') as MediaType | 'all' || 'all';

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setResults([]);
      setTotalPages(0);
    }
  }, [query, currentPage, mediaType]);

  useEffect(() => {
    if (results.length > 0) {
      sortResults();
    }
  }, [sortBy]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response: TMDBResponse<Movie | TVShow>;
      
      switch (mediaType) {
        case 'movie':
          response = await searchMovies(query, currentPage);
          break;
        case 'tv':
          response = await searchTVShows(query, currentPage);
          break;
        default:
          response = await searchMulti(query, currentPage);
      }
      
      setResults(response.results);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = () => {
    const sortedResults = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'popularity.desc':
          return b.popularity - a.popularity;
        case 'popularity.asc':
          return a.popularity - b.popularity;
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'vote_average.asc':
          return a.vote_average - b.vote_average;
        case 'release_date.desc':
          const dateA = 'release_date' in a ? a.release_date : a.first_air_date;
          const dateB = 'release_date' in b ? b.release_date : b.first_air_date;
          return new Date(dateB || '').getTime() - new Date(dateA || '').getTime();
        case 'release_date.asc':
          const dateC = 'release_date' in a ? a.release_date : a.first_air_date;
          const dateD = 'release_date' in b ? b.release_date : b.first_air_date;
          return new Date(dateC || '').getTime() - new Date(dateD || '').getTime();
        case 'title.asc':
          const titleA = 'title' in a ? a.title : a.name;
          const titleB = 'title' in b ? b.title : b.name;
          return titleA.localeCompare(titleB);
        case 'title.desc':
          const titleC = 'title' in a ? a.title : a.name;
          const titleD = 'title' in b ? b.title : b.name;
          return titleD.localeCompare(titleC);
        default:
          return 0;
      }
    });
    setResults(sortedResults);
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('q', newQuery);
      newParams.delete('page'); 
      return newParams;
    });
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', newSortBy);
      return newParams;
    });
  };

  const handleMediaTypeChange = (newMediaType: MediaType | 'all') => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newMediaType === 'all') {
        newParams.delete('type');
      } else {
        newParams.set('type', newMediaType);
      }
      newParams.delete('page');
      return newParams;
    });
    setCurrentPage(1);
  };

  const handleCardClick = (id: number, type: MediaType) => {
    const currentIndex = results.findIndex(item => item.id === id);
    navigate(`/details/${type}/${id}`, {
      state: {
        movieList: results,
        currentIndex: currentIndex,
        mediaType: type
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="list-view">
      <div className="search-header">
        <SearchBar 
          onSearch={handleSearch} 
          initialValue={query}
          placeholder="Search movies and TV shows..."
        />
        
        <div className="search-controls">
          <div className="media-type-filter">
            <label htmlFor="media-type-filter">Type:</label>
            <select 
              id="media-type-filter"
              name="mediaType"
              value={mediaType} 
              onChange={(e) => handleMediaTypeChange(e.target.value as MediaType | 'all')}
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
          
          {results.length > 0 && (
            <SortControls 
              sortBy={sortBy} 
              onSortChange={handleSortChange}
            />
          )}
        </div>
      </div>

      {loading && <div className="loading">Searching...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {query && !loading && results.length === 0 && !error && (
        <div className="no-results">
          No results found for "{query}"
        </div>
      )}
      
      {results.length > 0 && (
        <>
          <div className="results-info">
            Found {results.length} results {query && `for "${query}"`}
          </div>
          
          <div className="results-grid">
            {results.map((item) => (
              <CardItem
                key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`}
                item={item}
                mediaType={'title' in item ? 'movie' : 'tv'}
                onClick={handleCardClick}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListView;