export class HttpResponse {
  constructor (code: number, message: string)
}

export class RedirectResponse extends HttpResponse {
  constructor (code: number, message: string, url: string)
}

export class ServerErrorResponse extends HttpResponse {
  constructor (code: number, message: string, reason: any)
}

export declare function ok (message: any): HttpResponse
export declare function created (message: any): HttpResponse
export declare function accepted (message: any): HttpResponse
export declare function noContent (message: any): HttpResponse

export declare function movedPermanently (url: string): RedirectResponse
export declare function found (url: string): RedirectResponse
export declare function seeOther (url: string): RedirectResponse
export declare function notModified (message: any): HttpResponse
export declare function temporaryRedirect (url: string): RedirectResponse

export declare function badRequest (message: any): HttpResponse
export declare function unauthorized (message: any): HttpResponse
export declare function forbidden (message: any): HttpResponse
export declare function notFound (message: any): HttpResponse
export declare function notAcceptable (message: any): HttpResponse
export declare function lengthRequired (message: any): HttpResponse
export declare function payloadTooLarge (message: any): HttpResponse
export declare function unsupportedMediaType (message: any): HttpResponse
export declare function tooManyRequests (message: any): HttpResponse

export declare function internalError (message: any, reason: any): ServerErrorResponse
export declare function notImplemented (message: any, reason: any): ServerErrorResponse
export declare function serviceUnavailable (message: any, reason: any): ServerErrorResponse
