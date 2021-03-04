import KoaCors from '@koa/cors';
import { Middleware } from '../type';

export function Cors (options?: KoaCors.Options): Middleware {
  return KoaCors(options);
}
