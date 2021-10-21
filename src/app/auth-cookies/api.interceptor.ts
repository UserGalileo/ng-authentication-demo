import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Adds "withCredentials" to send cookies to the backend
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(env.apiUrl)) {
      req = req.clone({ withCredentials: true });
    }
    return next.handle(req);
  }
}
