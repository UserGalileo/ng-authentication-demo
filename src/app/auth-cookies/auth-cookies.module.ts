import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ApiInterceptor } from './api.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ]
})
export class AuthCookiesModule {
  constructor(@Optional() @SkipSelf() self: AuthCookiesModule) {
    if (self) {
      throw new Error('AuthCookiesModule imported more than once.')
    }
  }
}
