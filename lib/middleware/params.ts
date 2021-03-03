import * as yup from 'yup';
import * as Type from '../type';
import assert from 'assert';
import { Next } from 'koa';
import { badRequest } from '../http_response';

export interface ValidateOption {
  strict?: boolean;
  abortEarly?: boolean;
  recursive?: boolean;
  context?: any;
}

// we enforce strip unknown here, so that ctx.params only produces known fields.
// in case you need extra fields from request, use raw query or body.
const defaultOptions = {
  stripUnknown: true
};

// decorator
export function params (schema: yup.BaseSchema, validateOptions?: ValidateOption) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    assert(descriptor.value, 'params must be used as a method decorator');
    const oldHandler = descriptor.value;
    const options = {
      ...defaultOptions,
      ...validateOptions
    };
    descriptor.value = buildHandler(schema, options, oldHandler);
  };
}

// middleware
export function Params (schema: yup.BaseSchema, validateOptions?: ValidateOption): Type.Middleware {
  const options = {
    ...defaultOptions,
    ...validateOptions
  };
  return buildHandler(schema, options);
}

function buildHandler (schema: yup.BaseSchema, validateOptions: ValidateOption, oldHandler?: Type.Middleware): Type.Middleware {
  return async (ctx: Type.CrepecakeContext, next: Next) => {
    try {
      const data = {
        ...ctx.request.query,
        ...(ctx.request as any).body
      };

      const params = await schema.validate(data, validateOptions);
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
      if (err.name === 'ValidationError') {
        throw badRequest({ error: err.message });
      }

      throw err;
    }
  };
}
