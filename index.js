const koa = require('koa');
const Router = require('./lib/router');
const HttpResponse = require('./lib/http_response');
const debug = require('./lib/debug');

class CrepeCake extends koa {

  constructor() {
    super();
  }

  use(fn) {
    if (fn instanceof Router) {
      debug('installing crepecake router');
      super.use(fn.routes());
      super.use(fn.allowedMethods());
    } else {
      debug('installing normal middleware');
      super.use(fn);
    }
  }
}

CrepeCake.Router = Router;
CrepeCake.HttpResponse = HttpResponse;

module.exports = CrepeCake;