import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MovieDetails, TVShowDetails, MediaType, Movie, TVShow } from "../types/tmdb";
import { getMovieDetails, getTVShowDetails, getImageUrl } from "../api/tmdb";

interface LocationState {
  movieList: (Movie | TVShow)[];
  currentIndex: number;
  mediaType: MediaType;
}

const DetailView: React.FC = () => {
  const { type, id } = useParams<{ type: MediaType; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mediaType = type;
  const itemId = id ? parseInt(id, 10) : 0;
  
  const state = location.state as LocationState;
  const movieList = state?.movieList || [];
  const currentIndex = state?.currentIndex ?? -1;

  const fetchDetails = useCallback(async () => {
    console.log("fetchDetails called with:", { itemId, mediaType });
    setLoading(true);
    setError(null);

    try {
      let response: MovieDetails | TVShowDetails;

      if (mediaType === "movie") {
        response = await getMovieDetails(itemId);
      } else {
        response = await getTVShowDetails(itemId);
      }

      setDetails(response);
    } catch (err: any) {
      console.error("Details fetch error:", err);
      setError("Failed to load details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [itemId, mediaType]);

  useEffect(() => {
    if (itemId > 0 && mediaType) {
      fetchDetails();
    }
  }, [itemId, mediaType, fetchDetails]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigation = (direction: "prev" | "next") => {
    if (movieList.length === 0 || currentIndex === -1) return;
    
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < movieList.length) {
      const nextItem = movieList[newIndex];
      const nextMediaType: MediaType = 'title' in nextItem ? 'movie' : 'tv';
      
      navigate(`/details/${nextMediaType}/${nextItem.id}`, {
        state: {
          movieList: movieList,
          currentIndex: newIndex,
          mediaType: nextMediaType
        }
      });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const container = target.parentElement;
    if (container) {
      container.innerHTML = '<div class="detail-image-placeholder"><span class="no-image-text">No Image</span></div>';
    }
  };

  if (loading) {
    return <div className="loading">Loading details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={handleBack} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="error-container">
        <div className="error">No details found</div>
        <button onClick={handleBack} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const isMovie = "title" in details;
  const title = isMovie ? details.title : details.name;
  const releaseDate = isMovie ? details.release_date : details.first_air_date;
  const runtime = isMovie ? details.runtime : details.episode_run_time?.[0];

  return (
    <div className="detail-view">
      <div className="detail-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>

        <div className="navigation-controls">
          <button
            onClick={() => handleNavigation("prev")}
            className="nav-button"
            disabled={movieList.length === 0 || currentIndex <= 0}
          >
            ← Previous
          </button>
          {movieList.length > 0 && currentIndex !== -1 ? (
            <span className="nav-position">
              {currentIndex + 1} of {movieList.length}
            </span>
          ) : (
            <span className="nav-position">
              1 of 1
            </span>
          )}
          <button
            onClick={() => handleNavigation("next")}
            className="nav-button"
            disabled={movieList.length === 0 || currentIndex >= movieList.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-poster">
          {details.poster_path ? (
            <img
              src={getImageUrl(details.poster_path, "w500")}
              alt={`${title} poster`}
              className="poster-image"
              onError={handleImageError}
            />
          ) : (
            <div className="detail-image-placeholder">
              <span className="no-image-text">No Image</span>
            </div>
          )}
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{title}</h1>

          {details.tagline && (
            <p className="detail-tagline">"{details.tagline}"</p>
          )}

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Type:</span>
              <span className="meta-value">
                {mediaType === "movie" ? "🎬 Movie" : "📺 TV Show"}
              </span>
            </div>

            {releaseDate && (
              <div className="meta-item">
                <span className="meta-label">
                  {mediaType === "movie" ? "Release Date:" : "First Air Date:"}
                </span>
                <span className="meta-value">
                  {new Date(releaseDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {runtime && (
              <div className="meta-item">
                <span className="meta-label">
                  {mediaType === "movie" ? "Runtime:" : "Episode Runtime:"}
                </span>
                <span className="meta-value">{runtime} minutes</span>
              </div>
            )}

            <div className="meta-item">
              <span className="meta-label">Rating:</span>
              <span className="meta-value">
                ⭐{" "}
                {details.vote_average
                  ? details.vote_average.toFixed(1)
                  : "N/A"}{" "}
                (
                {details.vote_count
                  ? details.vote_count.toLocaleString()
                  : "0"}{" "}
                votes)
              </span>
            </div>

            {details.genres && details.genres.length > 0 && (
              <div className="meta-item">
                <span className="meta-label">Genres:</span>
                <div className="genre-tags">
                  {details.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isMovie && (
              <>
                <div className="meta-item">
                  <span className="meta-label">Seasons:</span>
                  <span className="meta-value">
                    {details.number_of_seasons}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Episodes:</span>
                  <span className="meta-value">
                    {details.number_of_episodes}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status:</span>
                  <span className="meta-value">{details.status}</span>
                </div>
              </>
            )}

            {isMovie && details.budget && details.budget > 0 && (
              <div className="meta-item">
                <span className="meta-label">Budget:</span>
                <span className="meta-value">
                  ${details.budget.toLocaleString()}
                </span>
              </div>
            )}

            {isMovie && (
              <div className="meta-item">
                <span className="meta-label">Revenue:</span>
                <span className="meta-value">
                  {details.revenue && details.revenue > 0 
                    ? `$${details.revenue.toLocaleString()}` 
                    : 'Not available'
                  }
                </span>
              </div>
            )}
          </div>

          {details.overview && (
            <div className="detail-overview">
              <h3>Overview</h3>
              <p>{details.overview}</p>
            </div>
          )}

          {details.homepage && (
            <div className="detail-links">
              <a
                href={details.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="homepage-link"
              >
                Official Website →
              </a>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default DetailView;
