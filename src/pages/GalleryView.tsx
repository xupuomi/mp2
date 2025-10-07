import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, TVShow, MediaType } from '../types/tmdb';
import { getTrendingAll, getTrendingMovies, getTrendingTVShows, discoverMovies, discoverTVShows } from '../api/tmdb';
import GalleryFilter from '../components/GalleryFilter';
import SortControls from '../components/SortControls';
import CardItem from '../components/CardItem';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | 'all'>('all');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const fetchTrendingItems = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    let response;
    const hasGenre = selectedGenre !== null;

    if (hasGenre) {
      if (selectedMediaType === "movie") {
        response = await discoverMovies({
          genre: selectedGenre!,
          sortBy: sortBy,
          page: 1,
        });
      } else if (selectedMediaType === "tv") {
        response = await discoverTVShows({
          genre: selectedGenre!,
          sortBy: sortBy,
          page: 1,
        });
      } else {
        const [movieResponse, tvResponse] = await Promise.all([
          discoverMovies({ genre: selectedGenre!, sortBy: sortBy, page: 1 }),
          discoverTVShows({ genre: selectedGenre!, sortBy: sortBy, page: 1 }),
        ]);
        response = {
          results: [
            ...(movieResponse?.results || []),
            ...(tvResponse?.results || []),
          ],
        };
      }
    } else {
      if (selectedMediaType === "movie") {
        response = await getTrendingMovies("week");
      } else if (selectedMediaType === "tv") {
        response = await getTrendingTVShows("week");
      } else {
        response = await getTrendingAll("week");
      }
    }
    const results = response?.results || [];
    if (results.length === 0) {
      console.warn("No items found for filters:", {
        genre: selectedGenre,
        type: selectedMediaType,
        sortBy,
      });
      setItems([]);
      setLoading(false);
      return;
    }
    // Always apply the requested sort order to the fetched results so
    // sorting (e.g. title A-Z) works when a genre is selected.
    const sortedResults = sortResults(results, sortBy);

    console.log("Fetched results:", {
      genre: selectedGenre,
      mediaType: selectedMediaType,
      sortBy,
      count: sortedResults.length,
    });

    setItems(sortedResults);
  } catch (err) {
    console.error("Trending fetch error:", {
      error: err,
      selectedGenre,
      selectedMediaType,
      sortBy,
    });
    setError("Failed to load trending items. Please try again.");
    setItems([]);
  } finally {
    setLoading(false);
  }
}, [selectedGenre, selectedMediaType, sortBy]);

  useEffect(() => {
    fetchTrendingItems();
  }, [fetchTrendingItems]);

  const sortResults = (results: (Movie | TVShow)[], sortOrder: string) => {
    return [...results].sort((a, b) => {
      switch (sortOrder) {
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
  };

  const handleCardClick = (id: number, type: MediaType) => {
    const currentIndex = items.findIndex(item => item.id === id);
    navigate(`/details/${type}/${id}`, {
      state: {
        movieList: items,
        currentIndex: currentIndex,
        mediaType: type
      }
    });
  };

  const getPageTitle = () => {
    if (selectedGenre && selectedMediaType !== 'all') {
      return `Trending ${selectedMediaType === 'movie' ? 'Movies' : 'TV Shows'} by Genre`;
    } else if (selectedGenre) {
      return 'Trending by Genre';
    } else if (selectedMediaType === 'movie') {
      return 'Trending Movies';
    } else if (selectedMediaType === 'tv') {
      return 'Trending TV Shows';
    }
    return 'Trending';
  };

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h1>{getPageTitle()}</h1>
        
        <div className="gallery-controls">
          <GalleryFilter
            selectedGenre={selectedGenre}
            selectedMediaType={selectedMediaType}
            onGenreChange={setSelectedGenre}
            onMediaTypeChange={setSelectedMediaType}
          />
          
          <SortControls
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

        </div>
      </div>

      {loading && <div className="loading">Loading trending content...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && items.length === 0 && !error && (
        <div className="no-results">
          No trending items found with the selected filters.
        </div>
      )}
      
      {items.length > 0 && (
        <div className="gallery-grid">
          {items.map((item) => {
            const mediaType: MediaType = "title" in item ? "movie" : "tv";
            return (
                <CardItem
                key={`${item.id}-${mediaType}`}
                item={item}
                mediaType={mediaType}
                onClick={handleCardClick}
                />
            );
    })}
        </div>
      )}
    </div>
  );
};

export default GalleryView;