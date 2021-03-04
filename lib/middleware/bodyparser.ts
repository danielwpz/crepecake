import KoaBodyParser from 'koa-bodyparser';
import { Middleware } from '../type';

export function BodyParser (options?: KoaBodyParser.Options): Middleware {
  return KoaBodyParser(options);
}
