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
  return new HttpResponse(200, message);
}

function created(message) {
  return new HttpResponse(201, message);
}

function accepted(message) {
  return new HttpResponse(202, message);
}

function noContent(message) {
  return new HttpResponse(204, message);
}

function badRequest(message) {
  return new HttpResponse(400, message);
}

function unauthorized(message) {
  return new HttpResponse(401, message);
}

function forbidden(message) {
  return new HttpResponse(403, message);
}

function notFound(message) {
  return new HttpResponse(404, message);
}

function internalError(message, reason) {
  return new ServerErrorResponse(500, message, reason);
}

function notImplemented(message, reason) {
  return new ServerErrorResponse(501, message, reason);
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