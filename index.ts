import Koa from 'koa';
import Debug from 'debug';
import { Router, KoaMiddleware } from './lib/router';
export * as HttpResponse from './lib/http_response';

const debug = Debug('crepecake:main');

export class Crepecake {
  private app = new Koa()

  use (fn: Router | KoaMiddleware) {
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
}

export { Router };
