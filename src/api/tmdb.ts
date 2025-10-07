import axios from 'axios';
import {
  TMDBResponse,
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  GenreResponse,
  SearchParams
} from '../types/tmdb';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/no_img.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const searchMulti = async (query: string, page: number = 1): Promise<TMDBResponse<Movie | TVShow>> => {
  const response = await tmdbApi.get('/search/multi', {
    params: { query, page }
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page }
  });
  return response.data;
};

export const searchTVShows = async (query: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/search/tv', {
    params: { query, page }
  });
  return response.data;
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
    params: { page }
  });
  return response.data;
};

export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get(`/trending/tv/${timeWindow}`, {
    params: { page }
  });
  return response.data;
};

export const getTrendingAll = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<Movie | TVShow>> => {
  const response = await tmdbApi.get(`/trending/all/${timeWindow}`, {
    params: { page }
  });
  return response.data;
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const response = await tmdbApi.get(`/movie/${id}`);
  return response.data;
};

export const getTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  const response = await tmdbApi.get(`/tv/${id}`);
  return response.data;
};

export const getMovieGenres = async (): Promise<GenreResponse> => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data;
};

export const getTVGenres = async (): Promise<GenreResponse> => {
  const response = await tmdbApi.get('/genre/tv/list');
  return response.data;
};

export const discoverMovies = async (params: SearchParams): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      page: params.page || 1,
      with_genres: params.genre,
      sort_by: params.sortBy || 'popularity.desc'
    }
  });
  return response.data;
};

export const discoverTVShows = async (params: SearchParams): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/discover/tv', {
    params: {
      page: params.page || 1,
      with_genres: params.genre,
      sort_by: params.sortBy || 'popularity.desc'
    }
  });
  return response.data;
};

export default tmdbApi;