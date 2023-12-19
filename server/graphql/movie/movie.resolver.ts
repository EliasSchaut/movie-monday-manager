import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieModel } from '@/types/models/movie.model';
import { MovieService } from '@/graphql/movie/movie.service';
import { ServerID } from '@/common/decorators/server.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ImdbIdInputModel } from '@/types/models/inputs/imdb_id.input';
import { UserModel } from '@/types/models/user.model';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { UserID } from '@/common/decorators/user.decorator';
import { MovieSearchModel } from '@/types/models/movie_search.model';
import { MovieSearchInputModel } from '@/types/models/inputs/movie_search.input';

@Resolver(() => MovieModel)
export class MovieResolver {
  constructor(private readonly movie_service: MovieService) {}

  @Query(() => MovieModel, {
    name: 'movie',
  })
  async find_by_id(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.find_by_id(imdb_id_input.imdb_id, {
      server_id,
      i18n,
    });
  }

  @Query(() => [MovieModel], {
    name: 'movie_find_many',
  })
  async find_many(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel[]> {
    return this.movie_service.find_many({ server_id, i18n });
  }

  @Role(RoleEnum.USER)
  @Query(() => MovieSearchModel, {
    name: 'movie_search',
  })
  async search(
    @Args('movie_search_input') movie_search_input: MovieSearchInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieSearchModel> {
    return this.movie_service.search(movie_search_input.query, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.USER)
  @Mutation(() => MovieModel, {
    name: 'movie_create',
  })
  async create(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.create(imdb_id_input.imdb_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => MovieModel, {
    name: 'movie_delete',
  })
  async delete(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.delete(imdb_id_input.imdb_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.USER)
  @Mutation(() => MovieModel, {
    name: 'movie_delete_proposed',
  })
  async delete_proposed(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.delete_proposed(imdb_id_input.imdb_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @ResolveField(() => UserModel)
  async resolve_proposer(
    @Parent() movie: MovieModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel> {
    return this.movie_service.resolve_proposer(movie.imdb_id, {
      server_id,
      i18n,
    });
  }

  @ResolveField(() => Number)
  async resolve_votes(
    @Parent() movie: MovieModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<number> {
    return this.movie_service.resolve_votes(movie.imdb_id, { server_id, i18n });
  }
}
