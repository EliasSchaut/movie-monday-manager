import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('----------------------------------');
    console.log('Request Body');
    console.log('----------------------------------');
    console.log(req.body)
    console.log('----------------------------------');
    next();
  }
}
