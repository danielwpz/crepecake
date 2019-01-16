const koaRouter = require('koa-router');
const { HttpResponse, ServerErrorResponse } = require('./http_response');
const { isProduction } = require('./utils');
const debug = require('./debug');


class Router extends koaRouter {

  constructor() {
    super();
  }

  route(method, name, path, middleware) {
    const koaRouterMethod = super[method];

    if (typeof path === 'string' || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 3);
    } else {
      middleware = Array.prototype.slice.call(arguments, 2);
      path = name;
      name = null;
    }
    middleware = middleware.map(m => wrap(m));

    const applyArguments = [name, path].concat(middleware);
    return koaRouterMethod.apply(this, applyArguments);
  }

  get(...args) {
    return this.route('get', ...args);
  }

  post(...args) {
    return this.route('post', ...args);
  }

  put(...args) {
    return this.route('put', ...args);
  }

  patch(...args) {
    return this.route('patch', ...args);
  }

  delete(...args) {
    return this.route('delete', ...args);
  }
}

/***
 * middleware is a normal koajs middleware, which should look like
 * async function (ctx, next) {
 *   ...
 * }
 */
function wrap(middleware) {
  return async function (ctx, next) {
    try {
      const res = await middleware(ctx, next);
      if (res instanceof HttpResponse) {
        ctx.status = res.code;
        ctx.body = res.message;
      } else {
        ctx.body = res;
      }
    } catch (err) {
      if (err instanceof ServerErrorResponse) {
        ctx.status = err.code;
        const response = {
          message: err.message
        };
        if (!isProduction()) {
          response.reason = err.reason;
        }
        ctx.body = response;
      } else {
        throw err;
      }
    }
  }
}


module.exports = Router;