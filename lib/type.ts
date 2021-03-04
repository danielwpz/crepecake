import { DefaultContext, DefaultState, ParameterizedContext, Next as KoaNext } from 'koa';
import KoaRouter from 'koa-router';
import { BaseSchema, AnySchema, InferType } from 'yup';

// -- internal use
export type KoaRouterMethod = (...args: any[]) => KoaRouter;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends Readonly<infer U>[]
      ? Readonly<DeepPartial<U>>[]
      : DeepPartial<T[P]>
};
// -- end of internal

// type for all kinds of middlewares or handlers
export type Middleware = KoaRouter.IMiddleware;

export type Next = KoaNext

// type for general context passed to a middleware
export type CrepecakeContext<StateT = DefaultState, CustomT = DefaultContext> = 
  ParameterizedContext<StateT, CustomT & KoaRouter.IRouterParamContext<StateT, CustomT>>;

// a special type of context with params defined by a Yup schema
export interface ParamsContext<P extends BaseSchema = AnySchema> extends CrepecakeContext {
  params: { [name: string]: any } & InferType<P>
}

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
