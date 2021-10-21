import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthServiceForTokens } from './auth-service-for-tokens';
import { REFRESH_URL_BLACKLIST } from './url-blacklist';

/**
 * Refreshes both tokens when there's a 401 error. Some conditions apply.
 */
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthServiceForTokens,
    @Inject(REFRESH_URL_BLACKLIST) private blacklist: Array<string | RegExp>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      req = this.addTokenHeader(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        /**
         * If one of these conditions applies, attempt a refresh.
         */
        const isError = error instanceof HttpErrorResponse;
        const isStatus401 = error.status === 401;
        const isWhitelist = !this.blacklist.find((url) => req.url.match(url));

        if (isError && isStatus401 && isWhitelist) {
          return this.handle401(req, next);
        }

        return throwError(error);
      })
    );
  }

  private handle401(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /**
     * If we're not refreshing a token, refresh it
     * and retry the original request.
     */
    if (!this.isRefreshing$.getValue()) {
      this.isRefreshing$.next(true);

      const refreshToken = this.authService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          tap(({ accessToken, refreshToken }) => {
            this.isRefreshing$.next(false);
            console.log('saving new: ', accessToken, refreshToken)
            this.authService.saveAccessToken(accessToken);
            this.authService.saveRefreshToken(refreshToken);
          }),
          switchMap(({ accessToken }) => {
            return next.handle(this.addTokenHeader(request, accessToken));
          }),
          catchError((err) => {
            this.isRefreshing$.next(false);
            this.authService.onRefreshError();
            return throwError(err);
          })
        );
      }

      this.isRefreshing$.next(false);
      this.authService.onRefreshError();
      return throwError('Missing refresh token');
    }

    /**
     * If we're already refreshing a token, wait
     * until we get the new one and perform the
     * request with the new Access Token.
     */
    return this.isRefreshing$.pipe(
      filter((is) => !is),
      take(1),
      switchMap(() => {
        const accessToken = this.authService.getAccessToken();
        return next.handle(this.addTokenHeader(request, accessToken));
      })
    );
  }

  /**
   * Returns an identical request with a new Access Token
   */
  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }
}
