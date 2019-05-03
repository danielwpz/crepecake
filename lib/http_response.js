class HttpResponse {
  /***
   * Root HTTP Response class, should not be directly used.
   */
  constructor(code, message) {
    this.code = code;
    this.message= message;
  }
}

class RedirectResponse extends HttpResponse {
  constructor(code, message, url) {
    super(code, message);
    this.url = url;
  }
}

class ServerErrorResponse extends HttpResponse {
  constructor(code, message, reason) {
    super(code, message);
    this.reason = reason;
  }
}

function ok(message) {
  return new HttpResponse(200, message || 'ok');
}

function created(message) {
  return new HttpResponse(201, message || 'created');
}

function accepted(message) {
  return new HttpResponse(202, message || 'accepted');
}

function noContent(message) {
  return new HttpResponse(204, message || 'no content');
}

function movedPermanently(url) {
  return new RedirectResponse(301, 'moved permanently', url);
}

function found(url) {
  return new RedirectResponse(302, 'found', url);
}

function seeOther(url) {
  return new RedirectResponse(303, 'see other', url);
}

function notModified(message) {
  return new HttpResponse(304, message || 'not modified');
}


function temporaryRedirect(url) {
  return new RedirectResponse(307, 'temporary redirect', url);
}

function badRequest(message) {
  return new HttpResponse(400, message || 'bad request');
}

function unauthorized(message) {
  return new HttpResponse(401, message || 'unauthorized');
}

function forbidden(message) {
  return new HttpResponse(403, message || 'forbidden');
}

function notFound(message) {
  return new HttpResponse(404, message || 'not found');
}

function notAcceptable(message) {
  return new HttpResponse(406, message || 'not acceptable');
}

function lengthRequired(message) {
  return new HttpResponse(411, message || 'length required');
}

function payloadTooLarge(message) {
  return new HttpResponse(413, message || 'payload too large');
}

function unsupportedMediaType(message) {
  return new HttpResponse(415, message || 'unsupported media type');
}

function tooManyRequests(message) {
  return new HttpResponse(429, message || 'too many requests');
}

function internalError(message, reason) {
  return new ServerErrorResponse(500, message || 'internal server error', reason);
}

function notImplemented(message, reason) {
  return new ServerErrorResponse(501, message || 'not implemented', reason);
}

function serviceUnavailable(message, reason) {
  return new ServerErrorResponse(503, message || 'service unavailable', reason);
}

module.exports = {
  HttpResponse,
  RedirectResponse,
  ServerErrorResponse,
  ok,
  created,
  accepted,
  noContent,
  movedPermanently,
  found,
  seeOther,
  notModified,
  temporaryRedirect,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  notAcceptable,
  lengthRequired,
  payloadTooLarge,
  unsupportedMediaType,
  tooManyRequests,
  internalError,
  notImplemented,
  serviceUnavailable
};
