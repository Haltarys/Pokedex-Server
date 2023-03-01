import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException)
export class WsValidationFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(new WsException(exception.getResponse()), host);
  }
}
