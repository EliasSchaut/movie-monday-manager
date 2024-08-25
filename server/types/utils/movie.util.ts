export type MovieId = number;
export type ImdbId = string;
export type TmdbId = number;
export type ExternalId = ImdbId | TmdbId;

export enum MovieApiTypeEnum {
  TMDB = 'TMDB',
  OMDB = 'OMDB',
  TOMDB = 'TOMDB',
}

export type MovieExternalIdsType = {
  imdb_id?: ImdbId;
  tmdb_id?: TmdbId;
};

export enum MovieExternalIdEnum {
  IMDB = 'imdb_id',
  TMDB = 'tmdb_id',
}

export type OmitToMovie<T> = Omit<T, 'to_movie_type'>;
export type OmitToMovieSearch<T> = Omit<T, 'to_movie_search_type'>;
