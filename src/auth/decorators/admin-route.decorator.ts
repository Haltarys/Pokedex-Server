import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/user/enums/role.enum';

export const AdminRoute = () =>
  applyDecorators(Roles(Role.ADMIN), UseGuards(JwtAuthGuard, RolesGuard));
