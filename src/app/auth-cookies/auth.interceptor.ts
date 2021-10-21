import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserStore } from '../services/user.store';

/**
 * Logs out the user when we receive a 401.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userStore: UserStore, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.userStore.removeUser();
          this.router.navigateByUrl('/login');
        }
        return throwError(error);
      })
    );
  }
}
