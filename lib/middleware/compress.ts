import KoaCompress from 'koa-compress';
import { Middleware } from '../type';

export function Compress (options?: KoaCompress.CompressOptions): Middleware {
  return KoaCompress(options);
}
