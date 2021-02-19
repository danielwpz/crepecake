export class HttpResponse {
  /***
   * Root HTTP Response class, should not be directly used.
   */
  constructor (readonly code: number, readonly message: any) {}
}

export class RedirectResponse extends HttpResponse {
  constructor (code: number, message: any, readonly url: string) {
    super(code, message);
  }
}

export class ServerErrorResponse extends HttpResponse {
  constructor (code: number, message: any, readonly reason: any) {
    super(code, message);
  }
}

export function ok (message?: any) {
  return new HttpResponse(200, message || 'ok');
}

export function created (message?: any) {
  return new HttpResponse(201, message || 'created');
}

export function accepted (message?: any) {
  return new HttpResponse(202, message || 'accepted');
}

export function noContent (message?: any) {
  return new HttpResponse(204, message || 'no content');
}

export function movedPermanently (url: string) {
  return new RedirectResponse(301, 'moved permanently', url);
}

export function found (url: string) {
  return new RedirectResponse(302, 'found', url);
}

export function seeOther (url: string) {
  return new RedirectResponse(303, 'see other', url);
}

export function notModified (message?: any) {
  return new HttpResponse(304, message || 'not modified');
}

export function temporaryRedirect (url: string) {
  return new RedirectResponse(307, 'temporary redirect', url);
}

export function badRequest (message?: any) {
  return new HttpResponse(400, message || 'bad request');
}

export function unauthorized (message?: any) {
  return new HttpResponse(401, message || 'unauthorized');
}

export function forbidden (message?: any) {
  return new HttpResponse(403, message || 'forbidden');
}

export function notFound (message?: any) {
  return new HttpResponse(404, message || 'not found');
}

export function notAcceptable (message?: any) {
  return new HttpResponse(406, message || 'not acceptable');
}

export function lengthRequired (message?: any) {
  return new HttpResponse(411, message || 'length required');
}

export function payloadTooLarge (message?: any) {
  return new HttpResponse(413, message || 'payload too large');
}

export function unsupportedMediaType (message?: any) {
  return new HttpResponse(415, message || 'unsupported media type');
}

export function tooManyRequests (message?: any) {
  return new HttpResponse(429, message || 'too many requests');
}

export function internalError(message?: any, reason?: any) {
  return new ServerErrorResponse(500, message || 'internal server error', reason);
}

export function notImplemented(message?: any, reason?: any) {
  return new ServerErrorResponse(501, message || 'not implemented', reason);
}

export function serviceUnavailable(message?: any, reason?: any) {
  return new ServerErrorResponse(503, message || 'service unavailable', reason);
}
