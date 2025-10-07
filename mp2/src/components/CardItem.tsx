import React from 'react';
import { Movie, TVShow, MediaType } from '../types/tmdb';
import { getImageUrl } from '../api/tmdb';

interface CardItemProps {
  item: Movie | TVShow;
  mediaType?: MediaType;
  onClick?: (id: number, mediaType: MediaType) => void;
}

const CardItem: React.FC<CardItemProps> = ({ item, mediaType, onClick }) => {
  const isMovie = 'title' in item;
  const actualMediaType = mediaType || (isMovie ? 'movie' : 'tv');
  
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown';

  const handleClick = () => {
    if (onClick) {
      onClick(item.id, actualMediaType);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const container = target.parentElement;
    if (container) {
      container.innerHTML = '<div class="card-image-placeholder"><span class="no-image-text">No Image</span></div>';
    }
  };

  return (
    <div 
      className={`card-item ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-image-container">
        {item.poster_path ? (
          <img
            src={getImageUrl(item.poster_path, 'w342')}
            alt={`${title} poster`}
            className="card-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="card-image-placeholder">
            <span className="no-image-text">No Image</span>
          </div>
        )}
        <div className="card-overlay">
          <div className="card-rating">
            ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
          </div>
          <div className="card-media-type">
            {actualMediaType === 'movie' ? '🎬' : '📺'}
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title" title={title}>
          {title}
        </h3>
        <p className="card-year">{year}</p>
        {item.overview && (
          <p className="card-overview" title={item.overview}>
            {item.overview.length > 120 
              ? `${item.overview.substring(0, 120)}...` 
              : item.overview
            }
          </p>
        )}
        <div className="card-stats">
          <span className="card-votes">
            👥 {item.vote_count ? item.vote_count.toLocaleString() : '0'} votes
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItem;