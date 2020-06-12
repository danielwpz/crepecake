# CrepeCake

REST API server framework based on koa.

## Install
`npm install crepecake`

## Getting started

example:
```javascript
const CrepeCake = require('../index');
const HttpResponse = CrepeCake.HttpResponse;

const app = new CrepeCake();
const router = new CrepeCake.Router();

// -- Build your router

router.get('/', (ctx) => {
  return 'ok';
});

router.post('/login', (ctx) => {
  throw HttpResponse.notImplemented();
});

// -- Register middlewares

app.use(async function requestLogger(ctx, next) {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(router);

// -- Run

app.listen(3000, () => {
  console.log('CrepeCake server running...');
});
```

## Difference with Koa
1. Routing     
   You don't need to import `koa-router` separately, crepecake itself exposes a `Router` class, which has the same interface as koa router.      
   And you can directly mount a router onto another one, without doing `routeA.use(routeB.routes())`.     

2. Response parsing      
   In Koa, you need to do `ctx.body = 'hello, world'` in order to send a response. With crepecake, you can just return an object or an instance of `HttpResponse` from an async middleware function, crepecake will handle the response parsing properly and reply to the client.    

3. Error handling      
   Some shortcuts for throwing server errors are provided such like `HttpResponse.internalError` for your convenience. But you can still throw an error at anytime, the normal error handling procedure of Koa will be used in that case.
