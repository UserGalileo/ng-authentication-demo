import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';
import {
  AuthServiceForTokens,
  NoopAuthServiceForTokens,
} from './auth-service-for-tokens';
import {
  DEFAULT_REFRESH_URL_BLACKLIST,
  REFRESH_URL_BLACKLIST,
} from './url-blacklist';
import { CommonModule } from '@angular/common';

/**
 * Instructions below!
 */
@NgModule({
  imports: [ CommonModule ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    {
      provide: AuthServiceForTokens,
      useClass: NoopAuthServiceForTokens,
    },
    {
      provide: REFRESH_URL_BLACKLIST,
      useValue: DEFAULT_REFRESH_URL_BLACKLIST,
    },
  ],
})
export class RefreshTokenModule {
  constructor(@Optional() @SkipSelf() self: RefreshTokenModule) {
    if (self) {
      throw new Error('RefreshTokenModule imported more than once.');
    }
  }
}

/**
 * HOW TO USE THIS MODULE
 *
 * - Copy this entire folder in your project and leave it as-is. Don't touch it unless you need to tweak it.
 *
 * - In your AppModule, provide a different REFRESH_URL_BLACKLIST using the same syntax as above.
 *   It must contain strings or RegExps for the URLs for which the interceptor should NOT work:
 *   make sure to include all of your authentication endpoints (eg. /login, /logout, /register, /token...)
 *   Example:
    {
      provide: REFRESH_URL_BLACKLIST,
      useValue: ['login', 'logout', 'refresh'],
    }

 * - Create a service which implements AuthServiceForTokens and provide it instead.
 *   It'll be used by the interceptor: look at AuthTokensService for reference.
 *   You'll have to decide: where to store the tokens, how to refresh them (API call), and what to do on error (eg. logout).
 *   Make sure that your server always returns a different refresh token for each refresh (Refresh Token Rotation).
 *   Example:
    {
      provide: AuthServiceForTokens,
      useExisting: AuthService
    }
 *
 */
