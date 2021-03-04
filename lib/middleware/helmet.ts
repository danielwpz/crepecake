import KoaHelmet from 'koa-helmet';
import { Middleware } from '../type';

type HelmetOptions = Required<Parameters<typeof KoaHelmet>>[0];

export function Helmet (options?: HelmetOptions): Middleware {
  return KoaHelmet(options);
}
