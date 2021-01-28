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
export declare function notModified (message: any): RedirectResponse
export declare function temporaryRedirect (url: string): RedirectResponse
