const koaRouter = require('koa-router');
const { HttpResponse, ServerErrorResponse, RedirectResponse } = require('./http_response');
const { isProduction } = require('./utils');
const debug = require('debug')('crepecake/router')
const joinpath = require('join-path')

let newrelic
try {
  newrelic = require('newrelic')
  debug('found newrelic')
} catch (e) {
  debug('not found newrelic')
}

class Router extends koaRouter {

  constructor() {
    super();
    this.parentRouter = { parentPath: '' }
    this.pathSegment = ''
  }

  get parentPath () {
    return joinpath(this.parentRouter.parentPath, this.pathSegment)
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
    middleware = middleware.map(m => wrap(m, this, path, method));

    const applyArguments = [name, path].concat(middleware);
    return koaRouterMethod.apply(this, applyArguments);
  }

  use(path, fn) {
    if (typeof path !== 'string') {
      fn = path;
      path = '';
    }

    if (fn instanceof Router) {
      fn.pathSegment = path
      fn.parentRouter = this
      super.use(path, fn.routes());
      super.use(path, fn.allowedMethods());
    } else {
      super.use(path, fn);
    }

    return this;
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
 * 
 * If the async function returns, either a HttpResponse object or other nodejs objects,
 * the execution of middleware chain will be stopped and the returned value will be 
 * sent to the client.
 */
function wrap(middleware, self, path, method) {
  return async function (ctx, next) {

    if (newrelic) {
      let fullPath = joinpath(self.parentPath, path)
      if (fullPath[0] === '/') {
        fullPath = fullPath.slice(1)
      }
      newrelic.setTransactionName(`${fullPath} ${method.toUpperCase()}`)
    }

    try {
      const res = await middleware(ctx, next);
      if (!res) {
        return;
      }

      sendResponse(ctx, res);
    } catch (err) {
      if (!err instanceof ServerErrorResponse && !err instanceof Error) {
        err = new Error(err);
      }

      sendResponse(ctx, err);
    }
  }
}

function sendResponse(ctx, res) {
  if (res instanceof ServerErrorResponse) {
    ctx.status = res.code;
    const response = {
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


module.exports = Router;