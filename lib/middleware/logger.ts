import KoaLogger, { LoggerOption } from '@danielwpz/koa-logger';
import { Middleware } from '../type';

export function Logger (options?: LoggerOption): Middleware {
  return KoaLogger(options);
}
