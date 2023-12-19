import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MovieSearchItemModel } from '@/types/models/movie_search_item.model';
import { ImdbApiMovieType } from '@/types/imdb_api_movie.type';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ImdbApiService {
  private readonly api_key: string;
  private readonly MAX_SEARCH_ITEMS: number;
  private readonly AVAILABLE_LANGS: string[];

  constructor() {
    const i18n = I18nContext.current();
    this.api_key = process.env.IMDB_API_KEY as string;
    this.MAX_SEARCH_ITEMS = 5;
    this.AVAILABLE_LANGS = i18n
      ? i18n.service.getSupportedLanguages()
      : ['en', 'de'];
  }

  public async find(
    imdb_id: string,
    lang: string = 'en',
  ): Promise<ImdbApiMovieType | null> {
    const response = await fetch(
      `https://imdb-api.com/${lang}/API/Title/${this.api_key}/${imdb_id}/Ratings`,
    ).catch(() => {
      throw new ServiceUnavailableException();
    });

    const movie = (await response.json()) as any;
    if (movie.type !== 'Movie') return null;

    return {
      imdb_id: movie.id,
      lang_meta: lang,
      title: movie.title,
      year: Number(movie.year),
      genre: movie.genres,
      director: movie.directors,
      actors: movie.stars,
      imdb_rate: movie.ratings.imDb,
      meta_score: movie.ratings.metacritic,
      rotten_score: movie.ratings.rottenTomatoes,
      languages: movie.languages,
      plot: movie.plotLocal !== '' ? movie.plotLocal : movie.plot,
      runtime: Number(movie.runtimeMins),
      poster_link: movie.image,
    } as ImdbApiMovieType;
  }

  public async find_all_langs(
    imdb_id: string,
  ): Promise<ImdbApiMovieType[] | null> {
    const movie_infos: ImdbApiMovieType[] = [];

    for (const lang of this.AVAILABLE_LANGS) {
      const movie_info = await this.find(imdb_id, lang);
      if (movie_info !== null) movie_infos.push(movie_info);
      else return null;
    }
    return movie_infos;
  }

  public async search(
    search_input: string,
    lang: string = 'en',
  ): Promise<MovieSearchItemModel[]> {
    const response = await fetch(
      `https://imdb-api.com/${lang}/API/SearchMovie/${this.api_key}/${search_input}`,
    ).catch(() => {
      throw new ServiceUnavailableException();
    });
    const data = (await response.json()) as any;
    const movies = (data.results as any[]).slice(0, this.MAX_SEARCH_ITEMS);

    return movies.map((movie) => {
      return {
        imdb_id: movie.id,
        title: movie.title,
        description: movie.description,
        poster_link: movie.image,
      };
    }) as MovieSearchItemModel[];
  }

  public static gen_imdb_link(imdb_id: string) {
    return `https://www.imdb.com/title/${imdb_id}/`;
  }
}
