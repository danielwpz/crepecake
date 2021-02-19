import Koa from 'koa'
import Router from './lib/router'
import KoaRouter from 'koa-router'

export default class CrepeCake extends Koa {
  // @ts-ignore
  use (fn: Router | KoaRouter.IMiddleware): void
}

export { Router }
export * as HttpResponse from './lib/http_response'
