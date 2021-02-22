import * as yup from 'yup';
import { params, Params } from './params';
import { Middleware } from '../type';

export interface PaginationOption {
  defaultLimit?: number,
  maxLimit?: number,
  maxOffset?: number
}

const defaultOptions = {
  defaultLimit: 20,
  maxLimit: 50,
  maxOffset: 2000
};

// middleware
export function Pagination (options: PaginationOption = defaultOptions): Middleware {
  const paginationParams = buildParams(options);
  return Params(paginationParams);
}

// decorator
export function pagination (options: PaginationOption = defaultOptions) {
  const paginationParams = buildParams(options);
  return params(paginationParams);
}

function buildParams (options: PaginationOption) {
  options = {
    ...defaultOptions,
    ...options
  };

  return yup.object({
    offset: yup.number()
      .default(0)
      .max(options.maxOffset || defaultOptions.maxOffset),
    limit: yup.number()
      .default(options.defaultLimit || defaultOptions.defaultLimit)
      .max(options.maxLimit || defaultOptions.maxLimit)
  });
}
