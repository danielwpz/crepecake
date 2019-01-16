const CrepeCake = require('../index');
const HttpResponse = CrepeCake.HttpResponse;

const app = new CrepeCake();
const router = new CrepeCake.Router();

router
  .get('/', (ctx) => {
    return 'ok';
  })
  .post('/token', (ctx) => {
    throw HttpResponse.internalError('cannot do it now', {app});
  })
  .delete('/token', (ctx) => {
    return HttpResponse.badRequest('no token');
  });

app.use(async function requestLogger(ctx, next) {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(router);

app.listen(3000, () => {
  console.log('CrepeCake server running...');
});