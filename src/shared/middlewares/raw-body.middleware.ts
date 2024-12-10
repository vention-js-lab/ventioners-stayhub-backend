import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          error: 'Invalid payload',
        });
      }
      next();
    });
  }
}
