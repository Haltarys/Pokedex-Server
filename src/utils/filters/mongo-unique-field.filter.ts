import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoUniqueFieldFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const next = host.switchToHttp().getNext();

    if (exception.code === 11000) {
      const fields = Object.keys(exception.keyPattern).join('", "');
      next(new BadRequestException(`Unique fields "${fields}" already in use.`));
    } else {
      next(exception);
    }
  }
}
