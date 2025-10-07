import React, { useState, useEffect } from 'react';
import { Genre, MediaType } from '../types/tmdb';
import { getMovieGenres, getTVGenres } from '../api/tmdb';

interface GalleryFilterProps {
  selectedGenre: number | null;
  selectedMediaType: MediaType | 'all';
  onGenreChange: (genreId: number | null) => void;
  onMediaTypeChange: (mediaType: MediaType | 'all') => void;
}

const GalleryFilter: React.FC<GalleryFilterProps> = ({
  selectedGenre,
  selectedMediaType,
  onGenreChange,
  onMediaTypeChange
}) => {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          getMovieGenres(),
          getTVGenres()
        ]);
        setMovieGenres(movieGenresData.genres);
        setTVGenres(tvGenresData.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const getAvailableGenres = (): Genre[] => {
    if (selectedMediaType === 'movie') return movieGenres;
    if (selectedMediaType === 'tv') return tvGenres;
    const allGenres = [...movieGenres, ...tvGenres];
    const uniqueGenres = allGenres.filter((genre, index, self) => 
      index === self.findIndex(g => g.id === genre.id)
    );
    return uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
  };

  const availableGenres = getAvailableGenres();

  if (loading) {
    return <div className="filter-loading">Loading filters...</div>;
  }

  return (
    <div className="gallery-filter">
      <div className="filter-group">
        <label htmlFor="media-type-select" className="filter-label">
          Media Type:
        </label>
        <select
          id="media-type-select"
          value={selectedMediaType}
          onChange={(e) => onMediaTypeChange(e.target.value as MediaType | 'all')}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="genre-select" className="filter-label">
          Genre:
        </label>
        <select
          id="genre-select"
          value={selectedGenre || ''}
          onChange={(e) => onGenreChange(e.target.value ? parseInt(e.target.value) : null)}
          className="filter-select"
        >
          <option value="">All Genres</option>
          {availableGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {(selectedGenre || selectedMediaType !== 'all') && (
        <button
          onClick={() => {
            onGenreChange(null);
            onMediaTypeChange('all');
          }}
          className="clear-filters-button"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default GalleryFilter;