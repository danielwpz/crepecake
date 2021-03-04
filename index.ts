import Koa from 'koa';
import Debug from 'debug';
import { Router } from './lib/router';
import { CrepecakeConfig, PartialCrepecakeConfig, Middleware as CrepecakeMiddleware } from './lib/type';
import { BodyParser } from './lib/middleware/bodyparser';
import { Compress } from './lib/middleware/compress';
import { Cors } from './lib/middleware/cors';
import { Helmet } from './lib/middleware/helmet';
import { Logger } from './lib/middleware/logger';
import { defaultConfig } from './lib/config';

export * as HttpResponse from './lib/http_response';
export * as Middleware from './lib/middleware';
export * as Type from './lib/type';
export { Router };

const debug = Debug('crepecake:main');

export class Crepecake {
  private app = new Koa()

  constructor (config?: PartialCrepecakeConfig) {
    config = {
      ...defaultConfig,
      ...config
    };

    const globalMiddlewares = config?.middleware?.global;
    this.installGlobalMiddlewares(globalMiddlewares || {});
  }

  use (fn: Router | CrepecakeMiddleware) {
    if (fn instanceof Router) {
      debug('installing crepecake router');
      this.app.use(fn.router.routes());
      this.app.use(fn.router.allowedMethods());
    } else {
      debug('installing koa router');
      this.app.use(fn);
    }
    return this;
  }

  listen (...args: any[]) {
    return this.app.listen(...args);
  }

  private installGlobalMiddlewares (config: Partial<CrepecakeConfig['middleware']['global']>) {
    if (config.bodyparser !== false) {
      this.use(BodyParser(config.bodyparser));
    }

    if (config.compress !== false) {
      this.use(Compress(config.compress));
    }

    if (config.cors !== false) {
      this.use(Cors(config.cors));
    }

    if (config.helmet !== false) {
      this.use(Helmet(config.helmet));
    }

    if (config.logger !== false) {
      this.use(Logger(config.logger));
    }
  }
}
