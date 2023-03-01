import { applyDecorators, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';

export const LoginRoute = () => applyDecorators(UseGuards(LocalAuthGuard));
