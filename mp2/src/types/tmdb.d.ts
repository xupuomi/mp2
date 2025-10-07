export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface MovieDetails extends Movie {
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: any[];
  production_countries: any[];
  revenue: number;
  runtime: number;
  spoken_languages: any[];
  status: string;
  tagline: string;
}

export interface TVShowDetails extends TVShow {
  created_by: any[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: any;
  networks: any[];
  next_episode_to_air: any;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: any[];
  production_countries: any[];
  seasons: any[];
  spoken_languages: any[];
  status: string;
  tagline: string;
  type: string;
}

export type MediaType = 'movie' | 'tv';
export type MediaItem = Movie | TVShow;
export type MediaDetails = MovieDetails | TVShowDetails;

export interface SearchParams {
  query?: string;
  page?: number;
  genre?: number;
  sortBy?: string;
  mediaType?: MediaType;
}