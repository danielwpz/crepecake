import { Crepecake, Router, Middleware, Type } from '../../index';
import supertest from 'supertest';
import * as yup from 'yup';
import { describe, before, after, it } from 'mocha';
import { expect } from 'chai';

const app = new Crepecake();

const paginationParams = yup.object({
  offset: yup.number().integer().default(0),
  limit: yup.number().integer().default(10)
});

const getParams = yup.object({
  query: yup.string().required()
}).concat(
  paginationParams
);

const postParams = yup.object({
  data: yup.array(
    yup.object({
      name: yup.string().required(),
      email: yup.string().email()
    })
  ).required()
});

class FooController {
  @Middleware.params(postParams)
  async postFoo (ctx: Type.ParamsContext<typeof postParams>) {
    return {
      post: 'ok',
      ...ctx.params
    };
  }
}

describe('Params Middleware Test', () => {
  let request: supertest.SuperTest<supertest.Test>, server: any;

  before(() => {
    const router = new Router();
    const fooController = new FooController();

    router.get('/params', Middleware.Params(getParams), async (ctx: Type.ParamsContext<typeof getParams>) => {
      return {
        get: 'ok',
        ...ctx.params
      };
    });
    router.post('/params/:id', fooController.postFoo);

    app.use(router);
    server = app.listen();
    request = supertest(server);
  });

  after(() => {
    server.close();
  });

  describe('GET query params', () => {
    it('should raise 400 if required params is missing', async () => {
      await request
        .get('/params')
        .expect(400);
    });

    it('should have all params constructed if properly provided', async () => {
      const res = await request
        .get('/params')
        .query({ query: 'bar' })
        .expect(200);

      expect(res.body.get).eql('ok');
      expect(res.body.query).eql('bar');
      expect(res.body.offset).eql(0);
      expect(res.body.limit).eql(10);
    });

    it('extra params should be ignored by default', async () => {
      const res = await request
        .get('/params')
        .query({ query: 'bar', more: 'yes' })
        .expect(200);

      expect(res.body.more).not.exist;
    });
  });

  describe('POST body params', () => {
    it('should raise 400 if required params is missing', async () => {
      await request
        .post('/params/123')
        .expect(400);
    });

    it('should have all params constructed if properly provided', async () => {
      const res = await request
        .post('/params/123')
        .send({
          data: [
            { name: 'foo', email: 'foo@example.com' }
          ]
        })
        .expect(200);

      expect(res.body).to.have.property('data').of.length(1);
      expect(res.body.data[0]).to.eql({
        name: 'foo',
        email: 'foo@example.com'
      });

      expect(res.body.post).eql('ok');

      expect(res.body.id).to.eql('123');
    });
  });

});
