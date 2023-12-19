import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@/types/enums/role.enum';

export const Role = Reflector.createDecorator<RoleEnum>();
