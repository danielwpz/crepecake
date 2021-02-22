import { Crepecake, Router, Middleware, Type } from '../../index';
import supertest, { Response } from 'supertest';
import * as yup from 'yup';
import { describe, before, after, it } from 'mocha';
import { expect } from 'chai';

const app = new Crepecake();

const otherParams = yup.object({
  name: yup.string()
});

class FooController {
  @Middleware.pagination({ defaultLimit: 20, maxLimit: 100 })
  async getFoo (ctx: Type.ParamsContext) {
    return ctx.params;
  }

  @Middleware.pagination({ defaultLimit: 20, maxLimit: 100 })
  @Middleware.params(otherParams)
  async paginationBeforeParams (ctx: Type.ParamsContext<typeof otherParams>) {
    return ctx.params;
  }

  @Middleware.params(otherParams)
  @Middleware.pagination({ defaultLimit: 20, maxLimit: 100 })
  async paginationAfterParams (ctx: Type.ParamsContext<typeof otherParams>) {
    return ctx.params;
  }
}

describe('Pagination Middleware Test', () => {
  let request: supertest.SuperTest<supertest.Test>, server: any;

  before(() => {
    const router = new Router();
    const fooController = new FooController();

    router.get('/pagination/before', fooController.paginationBeforeParams);
    router.get('/pagination/after', fooController.paginationAfterParams);
    router.get('/pagination/middleware', Middleware.Pagination({ defaultLimit: 20, maxLimit: 100 }), async ctx => {
      return ctx.params;
    });
    router.get('/pagination', fooController.getFoo);

    app.use(router);
    server = app.listen();
    request = supertest(server);
  });

  after(() => {
    server.close();
  });

  buildTestCases('/pagination', 'pagination only');
  buildTestCases('/pagination/before', 'before params');
  buildTestCases('/pagination/after', 'after params');
  buildTestCases('/pagination/middleware', 'as middleware');

  function buildTestCases (path: string, name: string, cb?: (res: Response) => Promise<void>) {
    describe(name, () => {
      it('should use default values if not provided', async () => {
        const res = await request
          .get(path)
          .expect(200);

        expect(res.body.offset).eql(0);
        expect(res.body.limit).eql(20);
        if (cb) {
          await cb(res);
        }
      });

      it('should use user provided values if properly provided', async () => {
        const res = await request
          .get(path)
          .query({ offset: 10, limit: 1 })
          .expect(200);

        expect(res.body.offset).eql(10);
        expect(res.body.limit).eql(1);
        if (cb) {
          await cb(res);
        }
      });

      it('should raise if wrong value is provided', async () => {
        await request
          .get(path)
          .query({ offset: 10, limit: 99999 })
          .expect(400);
      });
    });
  }
});
