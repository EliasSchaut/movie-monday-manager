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
import { ServerId } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { MovieIdInputModel } from '@/types/models/inputs/movie_id.input';
import { UserModel } from '@/types/models/user.model';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/auth/role.enum';
import { UserID } from '@/common/decorators/user_id.decorator';
import { MovieSearchModel } from '@/types/models/movie_search.model';
import { MovieSearchInputModel } from '@/types/models/inputs/movie_search.input';
import { MovieExternalIdInputModel } from '@/types/models/inputs/movie_external_id.input';

@Resolver(() => MovieModel)
export class MovieResolver {
  constructor(private readonly movie_service: MovieService) {}

  @Query(() => MovieModel, {
    name: 'movie',
  })
  async find_by_id(
    @Args('movie_id_input') movie_id_input: MovieIdInputModel,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.find_by_id(movie_id_input.movie_id, {
      server_id,
      i18n,
    });
  }

  @Query(() => [MovieModel], {
    name: 'movie_find_many',
  })
  async find_many(
    @ServerId() server_id: number,
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
    @ServerId() server_id: number,
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
    @Args('external_id_input') external_id_input: MovieExternalIdInputModel,
    @UserID() user_id: string,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.create(external_id_input, {
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
    @Args('movie_id_input') movie_id_input: MovieIdInputModel,
    @UserID() user_id: string,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.delete(movie_id_input.movie_id, {
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
    @Args('movie_id_input') movie_id_input: MovieIdInputModel,
    @UserID() user_id: string,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieModel> {
    return this.movie_service.delete_proposed(movie_id_input.movie_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @ResolveField(() => UserModel, {
    name: 'proposer',
  })
  async resolve_proposer(
    @Parent() movie: MovieModel,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel> {
    return this.movie_service.resolve_proposer(movie.id, {
      server_id,
      i18n,
    });
  }

  @ResolveField(() => Number, {
    name: 'rank',
    complexity: 2,
  })
  async resolve_rank(
    @Parent() movie: MovieModel,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<number> {
    return this.movie_service.resolve_rank(movie.id, { server_id, i18n });
  }
}
