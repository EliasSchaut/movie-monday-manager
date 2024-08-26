import { MovieType } from '@/types/movie/movie.type';
import { ApiService } from '@/common/services/api.service';
import * as process from 'node:process';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { TomdbApiService } from '@/common/services/movie_api/tomdb_api.service';

describe('TomdbApiService', () => {
  let tomdbApiService: TomdbApiService;
  let apiService: ApiService;
  const mocked_default_lang = 'en-US';
  const mocked_max_search_results = '5';
  const mocked_api_key = 'mocked_api_key';

  beforeEach(() => {
    process.env.DEFAULT_LANGUAGE = mocked_default_lang;
    process.env.MAX_MOVIE_SEARCH_ITEMS = mocked_max_search_results;
    process.env.TMDB_API_KEY = mocked_api_key;
    apiService = new ApiService();
    tomdbApiService = new TomdbApiService(apiService);
  });

  afterEach(() => {
    delete process.env.DEFAULT_LANGUAGE;
    delete process.env.MAX_SEARCH_RESULTS;
    delete process.env.TMDB_API_KEY;
  });

  it('fetch_movie returns TmdbMovieType when movie data is valid', async () => {
    const tmdb_id = 123;
    const imdb_id = 'tt123';
    const movie_data = {
      id: tmdb_id,
      title: 'Test Movie',
      runtime: 120,
      imdb_id: imdb_id,
      Title: 'Test Movie',
      Runtime: '120 min',
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(movie_data);

    const result = await tomdbApiService.find({ tmdb_id });

    expect(result).toBeInstanceOf(MovieType);
    expect(result?.tmdb_id).toBe(tmdb_id);
    expect(result?.title).toBe(movie_data.title);
  });

  it('fetch_movie returns null when movie data is null', async () => {
    const imdb_id = 'tt123';
    const tmdb_id = 123;
    jest.spyOn(apiService, 'call_api').mockResolvedValue(null);

    const result = await tomdbApiService.find({ tmdb_id, imdb_id });

    expect(result).toBeNull();
  });

  it('fetch_movie returns null when movie data is invalid', async () => {
    const imdb_id = 'tt123';
    const tmdb_id = 123;
    const invalid_movie_data = { id: tmdb_id, title: 'Test Movie' };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(invalid_movie_data);

    const result = await tomdbApiService.find({ tmdb_id, imdb_id });

    expect(result).toBeNull();
  });

  it('fetch_search returns array of MovieSearchType when search results are valid', async () => {
    const query = 'test';
    const searches = {
      results: [
        { id: 1, title: 'Test Movie 1' },
        { id: 2, title: 'Test Movie 2' },
      ],
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(searches);

    const result = await tomdbApiService.search(query);

    expect(result).toHaveLength(searches.results.length);
    expect(result[0]).toBeInstanceOf(MovieSearchType);
    expect(result[0].tmdb_id).toBe(searches.results[0].id);
    expect(result[1]).toBeInstanceOf(MovieSearchType);
    expect(result[1].tmdb_id).toBe(searches.results[1].id);
  });

  it('fetch_search returns just MAX_MOVIE_SEARCH_ITEMS items', async () => {
    const query = 'test';
    const searchResults = {
      results: [
        { id: 1, title: 'Test Movie 1' },
        { id: 2, title: 'Test Movie 2' },
        { id: 3, title: 'Test Movie 3' },
        { id: 4, title: 'Test Movie 4' },
        { id: 5, title: 'Test Movie 5' },
        { id: 6, title: 'Test Movie 6' },
        { id: 7, title: 'Test Movie 7' },
      ],
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(searchResults);

    const result = await tomdbApiService.search(query);

    expect(result).toHaveLength(Number(mocked_max_search_results));
  });

  it('fetch_search returns empty array when search results are invalid', async () => {
    const query = 'test';
    jest.spyOn(apiService, 'call_api').mockResolvedValue({ results: [] });

    const result = await tomdbApiService.search(query);

    expect(result).toEqual([]);
  });
});
