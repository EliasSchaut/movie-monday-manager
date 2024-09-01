import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@/types/auth/role.enum';

export const Role = Reflector.createDecorator<RoleEnum>();
