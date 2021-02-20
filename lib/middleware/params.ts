import * as yup from 'yup';
import * as Type from '../type';
import assert from 'assert';
import { Next } from 'koa';
import { badRequest } from '../http_response';

// decorator
export function params (schema: yup.BaseSchema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    assert(descriptor.value, 'params must be used as a method decorator');
    const oldHandler = descriptor.value;
    descriptor.value = buildHandler(schema, oldHandler);
  };
}

// middleware
export function Params (schema: yup.BaseSchema): Type.Middleware {
  return buildHandler(schema);
}

function buildHandler (schema: yup.BaseSchema, oldHandler?: Type.Middleware): Type.Middleware {
  return async (ctx: Type.CrepecakeContext, next: Next) => {
    try {
      const data = {
        ...ctx.request.query,
        ...(ctx.request as any).body
      };

      const params = await schema.validate(data);
      const oldParams = ctx.params;
      ctx.params = {
        ...oldParams,
        ...params
      };

      if (oldHandler) {
        return oldHandler(ctx, next); // decorator mode
      } else {
        await next(); // middleware mode
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        throw badRequest({ error: err.message });
      }

      throw err;
    }
  };
}
