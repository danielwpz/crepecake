class HttpResponse {
  /***
   * Root HTTP Response class, should not be directly used.
   */
  constructor(code, message) {
    this.code = code;
    this.message= message;
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

function internalError(message, reason) {
  return new ServerErrorResponse(500, message || 'internal server error', reason);
}

function notImplemented(message, reason) {
  return new ServerErrorResponse(501, message || 'not implemented', reason);
}

module.exports = {
  HttpResponse,
  ServerErrorResponse,
  ok,
  created,
  accepted,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internalError,
  notImplemented
};