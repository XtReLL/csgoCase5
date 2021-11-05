import { Injectable, NestMiddleware } from '@nestjs/common';
import { json } from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public constructor() {}

  public use(req: Request, res: Response, next: () => any): any {
    json({
      verify: (req: any, res, buffer) => {
        if (Buffer.isBuffer(buffer)) {
          const rawBody = Buffer.from(buffer);
          req['parsedRawBody'] = rawBody;
        }
        return true;
      },
    })(req as any, res as any, next);
  }
}

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    json()(req as any, res as any, next);
  }
}
