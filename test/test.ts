import { Crepecake, HttpResponse, Router } from '../index'
import supertest from 'supertest'
import { describe, before, after, it } from 'mocha'
import CrepecakeCommon from 'crepecake-common'

const app = new Crepecake();

describe('Crepecake Test', () => {
  let request: supertest.SuperTest<supertest.Test>, server: any;

  before(() => {
    app.use(CrepecakeCommon());

    const rootRouter = new Router();
    const subRouter = new Router();

    subRouter.get('/', (ctx) => {
      return 'ok';
    });

    subRouter.post('/accepted', async (ctx) => {
      return HttpResponse.accepted();
    });

    subRouter.get('/redirect', async (ctx) => {
      return HttpResponse.found('/target');
    });

    subRouter.get('/notfound', (ctx) => {
      return HttpResponse.notFound();
    });

    subRouter.get('/toolarge', (ctx) => {
      throw HttpResponse.payloadTooLarge();
    });

    subRouter.get('/internalerror', (ctx) => {
      throw HttpResponse.internalError();
    });

    subRouter.get('/path/:v/echo', ctx => {
      return ctx.params.v
    })

    subRouter.get('/:key*', (ctx) => {
      return ctx.params.key;
    })

    rootRouter.use('/sub', subRouter);

    app.use(rootRouter);
    server = app.listen();
    request = supertest(server);
  });

  after(() => {
    server.close();
  });

  it('GET /', async () => {
    await request
      .get('/sub/')
      .expect(200, 'ok');
  });

  it('POST /accepted', async () => {
    await request
      .post('/sub/accepted')
      .expect(202);
  });

  it('GET /redirect', async () => {
    await request
      .get('/sub/redirect')
      .expect(302)
      .expect('Location', '/target');
  });

  it('GET /notfound', async () => {
    await request
      .get('/sub/notfound')
      .expect(404);
  });

  it('GET /notfound_foo', async () => {
    await request
      .get('/notfound_foo')
      .expect(404);
  });

  it('GET /toolarge', async () => {
    await request
      .get('/sub/toolarge')
      .expect(413);
  });

  it('GET /internalerror', async () => {
    await request
      .get('/sub/internalerror')
      .expect(500);
  });

  it('GET /path/foo/echo', async () => {
    await request
      .get('/sub/path/foo/echo')
      .expect('foo');
  })

  it('GET /multi/key/path', async () => {
    await request
      .get('/sub/multi/key/path')
      .expect('multi/key/path');
  })
});
