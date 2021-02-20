import KoaRouter from 'koa-router';

// internal use
export type KoaRouterMethod = (...args: any[]) => KoaRouter
export type KoaMiddleware = KoaRouter.IMiddleware

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends Readonly<infer U>[]
      ? Readonly<DeepPartial<U>>[]
      : DeepPartial<T[P]>
};

export type Middleware = KoaMiddleware

export interface CrepecakeConfig {
  middleware: {
    global: {
      bodyparser: any,
      compress: any,
      cors: any,
      helmet: any,
      logger: any
    }
  }
}

export type PartialCrepecakeConfig = DeepPartial<CrepecakeConfig>
