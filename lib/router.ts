import KoaRouter from 'koa-router';
import Debug from 'debug';
import path from 'path';
import assert from 'assert';
import { ParameterizedContext } from 'koa';
import { isProduction } from './utils';
import { HttpResponse, ServerErrorResponse, RedirectResponse } from './http_response';
import { KoaRouterMethod, KoaMiddleware } from './type';

const debug = Debug('crepecake:router');

let newrelic: any;
try {
  newrelic = require('newrelic');
  debug('found newrelic');
} catch (e) {
  debug('not found newrelic');
}

export class Router {
  // for newrelic tracing
  private parentRouter = { parentPath: '' }
  private pathSegment = ''

  // koa router instance
  readonly router = new KoaRouter()

  get parentPath () {
    return path.join(this.parentRouter.parentPath, this.pathSegment);
  }

  use(path: string, fn: Router | KoaMiddleware): Router
  use(fn: Router | KoaMiddleware): Router
  use (
    path: string | (Router | KoaMiddleware),
    fn?: Router | KoaMiddleware
  ): Router {
    if (typeof path !== 'string') {
      fn = path;
      path = '';
    }

    if (fn instanceof Router) {
      fn.pathSegment = path;
      fn.parentRouter = this;
      this.router.use(path, fn.router.routes());
      this.router.use(path, fn.router.allowedMethods());
    } else {
      assert(fn);
      this.router.use(path, fn);
    }

    return this;
  }

  private route (
    name: string,
    method: KoaRouterMethod,
    path: string | RegExp,
    ...middleware: KoaMiddleware[]
  ): Router {
    middleware = middleware.map(m => wrap(m, this, path.toString(), name));
    method.call(this.router, path, ...middleware);
    return this;
  }

  get (path: string | RegExp, ...middleware: KoaRouter.IMiddleware[]): Router {
    return this.route('get', this.router.get, path, ...middleware);
  }

  post (path: string | RegExp, ...middleware: KoaRouter.IMiddleware[]): Router {
    return this.route('post', this.router.post, path, ...middleware);
  }

  put (path: string | RegExp, ...middleware: KoaRouter.IMiddleware[]): Router {
    return this.route('put', this.router.put, path, ...middleware);
  }

  patch (path: string | RegExp, ...middleware: KoaRouter.IMiddleware[]): Router {
    return this.route('patch', this.router.patch, path, ...middleware);
  }

  delete (path: string | RegExp, ...middleware: KoaRouter.IMiddleware[]): Router {
    return this.route('delete', this.router.delete, path, ...middleware);
  }
}

/***
 * middleware is a normal koajs middleware, which should look like
 * async function (ctx, next) {
 *   ...
 * }
 *
 * If the async function returns, either a HttpResponse object or other nodejs objects,
 * the execution of middleware chain will be stopped and the returned value will be
 * sent to the client.
 */
function wrap (middleware: KoaMiddleware, self: Router, pathName: string, method: string): KoaMiddleware {
  return async function (ctx, next) {
    if (newrelic) {
      let fullPath = path.join(self.parentPath, pathName);
      if (fullPath[0] === '/') {
        fullPath = fullPath.slice(1);
      }
      newrelic.setTransactionName(`${fullPath} ${method.toUpperCase()}`);
      debug(`setup newrelic txn: ${fullPath} ${method.toUpperCase()}`);
    }

    try {
      const res = await middleware(ctx, next);
      if (!res) {
        return;
      }

      sendResponse(ctx, res);
    } catch (err) {
      let error: any = err;

      if (!(err instanceof ServerErrorResponse || err instanceof Error || err instanceof HttpResponse)) {
        error = new Error(err);
      }

      sendResponse(ctx, error);
    }
  };
}

function sendResponse (ctx: ParameterizedContext, res: any) {
  if (res instanceof ServerErrorResponse) {
    ctx.status = res.code;
    const response: any = {
      message: res.message
    };
    if (!isProduction()) {
      response.reason = res.reason;
    }
    ctx.body = response;
  } else if (res instanceof RedirectResponse) {
    ctx.status = res.code;
    ctx.redirect(res.url);
    ctx.body = res.message;
  } else if (res instanceof HttpResponse) {
    ctx.status = res.code;
    ctx.body = res.message;
  } else if (res instanceof Error) {
    throw res;
  } else {
    ctx.body = res;
  }
}
