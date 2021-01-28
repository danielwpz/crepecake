import * as KoaRouter from 'koa-router'

export default class Router extends KoaRouter {
  use (path: string, fn: Router | KoaRouter.IMiddleware): Router
  use (fn: Router | KoaRouter.IMiddleware): Router

  get (
    name: string,
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
  get (
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter

  post (
    name: string,
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
  post (
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter

  put (
    name: string,
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
  put (
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter

  patch (
    name: string,
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
  patch (
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter

  delete (
    name: string,
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
  delete (
    path: string | RegExp,
    ...middleware: KoaRouter.IMiddleware[]
  ): KoaRouter
}
