import { MovieType } from '@/types/movie/movie.type';
import { ApiService } from '@/common/services/api.service';
import * as process from 'node:process';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { OmdbApiService } from '@/common/services/movie_api/omdb_api.service';

describe('OmdbApiService', () => {
  let omdbApiService: OmdbApiService;
  let apiService: ApiService;
  const mocked_default_lang = 'en-US';
  const mocked_max_search_results = '5';
  const mocked_api_key = 'mocked_api_key';

  beforeEach(() => {
    process.env.DEFAULT_LANGUAGE = mocked_default_lang;
    process.env.MAX_MOVIE_SEARCH_ITEMS = mocked_max_search_results;
    process.env.OMDB_API_KEY = mocked_api_key;
    apiService = new ApiService();
    omdbApiService = new OmdbApiService(apiService);
  });

  afterEach(() => {
    delete process.env.DEFAULT_LANGUAGE;
    delete process.env.MAX_SEARCH_RESULTS;
    delete process.env.OMDB_API_KEY;
  });

  it('fetch_movie returns TmdbMovieType when movie data is valid', async () => {
    const imdb_id = 'tt123';
    const movie_data = {
      imdbID: imdb_id,
      Title: 'Test Movie',
      Runtime: '120 min',
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(movie_data);

    const result = await omdbApiService.find({ imdb_id });

    expect(result).toBeInstanceOf(MovieType);
    expect(result?.imdb_id).toBe(imdb_id);
    expect(result?.title).toBe(movie_data.Title);
  });

  it('fetch_movie returns null when movie data is null', async () => {
    const imdb_id = 'tt123';
    jest.spyOn(apiService, 'call_api').mockResolvedValue(null);

    const result = await omdbApiService.find({ imdb_id });

    expect(result).toBeNull();
  });

  it('fetch_movie returns null when movie data is invalid', async () => {
    const imdb_id = 'tt123';
    const invalid_movie_data = {
      imdbID: imdb_id,
      Title: 'Test Movie',
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(invalid_movie_data);

    const result = await omdbApiService.find({ imdb_id });

    expect(result).toBeNull();
  });

  it('fetch_search returns array of MovieSearchType when search results are valid', async () => {
    const query = 'test';
    const searches = {
      Search: [
        {
          imdbID: 'tt1',
          Title: 'Test Movie 1',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt2',
          Title: 'Test Movie 2',
          Runtime: '120 min',
        },
      ],
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(searches);

    const result = await omdbApiService.search(query);

    expect(result).toHaveLength(searches.Search.length);
    expect(result[0]).toBeInstanceOf(MovieSearchType);
    expect(result[0].imdb_id).toBe(searches.Search[0].imdbID);
    expect(result[1]).toBeInstanceOf(MovieSearchType);
    expect(result[1].imdb_id).toBe(searches.Search[1].imdbID);
  });

  it('fetch_search returns just MAX_MOVIE_SEARCH_ITEMS items', async () => {
    const query = 'test';
    const searchResults = {
      Search: [
        {
          imdbID: 'tt1',
          Title: 'Test Movie 1',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt2',
          Title: 'Test Movie 2',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt3',
          Title: 'Test Movie 3',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt4',
          Title: 'Test Movie 4',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt5',
          Title: 'Test Movie 5',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt6',
          Title: 'Test Movie 6',
          Runtime: '120 min',
        },
        {
          imdbID: 'tt7',
          Title: 'Test Movie 7',
          Runtime: '120 min',
        },
      ],
    };
    jest.spyOn(apiService, 'call_api').mockResolvedValue(searchResults);

    const result = await omdbApiService.search(query);

    expect(result).toHaveLength(Number(mocked_max_search_results));
  });

  it('fetch_search returns empty array when search results are invalid', async () => {
    const query = 'test';
    jest.spyOn(apiService, 'call_api').mockResolvedValue({ Search: [] });

    const result = await omdbApiService.search(query);

    expect(result).toEqual([]);
  });

  it('gen_movie_link generates correct movie link', () => {
    const imdb_id = 'tt123';
    const lang = 'de-DE';
    const expectedLink = `https://www.omdbapi.com/?apikey=${mocked_api_key}&i=${imdb_id}&plot=short`;
    jest.spyOn(apiService, 'call_api').mockResolvedValue(null);

    omdbApiService.find({ imdb_id }, lang);

    expect(apiService.call_api).toHaveBeenCalledWith(expectedLink);
  });

  it('gen_movie_search_link generates correct search link', () => {
    const query = 'test';
    const lang = 'de-DE';
    const expectedLink = `https://www.omdbapi.com/?apikey=${mocked_api_key}&s=${query}&type=movie`;
    jest.spyOn(apiService, 'call_api').mockResolvedValue({ Search: [] });
    omdbApiService.search(query, lang);

    expect(apiService.call_api).toHaveBeenCalledWith(expectedLink);
  });
});
