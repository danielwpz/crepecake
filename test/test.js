const CrepeCake = require('../index');
const HttpResponse = CrepeCake.HttpResponse;
const crepecakeCommon = require('crepecake-common');

const app = new CrepeCake();
const router = new CrepeCake.Router();
const tokenRouter = new CrepeCake.Router();

tokenRouter
  .post('/', (ctx) => {
    return HttpResponse.created();
  })
  .delete('/', (ctx) => {
    return HttpResponse.badRequest('no token');
  });

router
  .use(async function printHeaders(ctx, next) {
    console.log(ctx.headers);
    await next();
  })
  .get('/', (ctx) => {
    return 'ok';
  })
  .use('/token', tokenRouter);

app.use(crepecakeCommon);

app.use(async function requestLogger(ctx, next) {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(router);

app.listen(3000, () => {
  console.log('CrepeCake server running...');
});