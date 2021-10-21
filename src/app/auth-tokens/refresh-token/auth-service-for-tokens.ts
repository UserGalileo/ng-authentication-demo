import { Observable, of } from 'rxjs';

export abstract class AuthServiceForTokens {
  abstract getAccessToken(): any;
  abstract getRefreshToken(): any;
  abstract refreshToken(
    refreshToken: any
  ): Observable<{ accessToken: any; refreshToken: any }>;
  abstract saveAccessToken(accessToken: any): void;
  abstract saveRefreshToken(refreshToken: any): void;
  abstract onError(): void;
}

export class NoopAuthServiceForTokens implements AuthServiceForTokens {
  getAccessToken() {
    console.log('[NoopAuthServiceForTokens] getAccessToken');
    return 'noop';
  }
  getRefreshToken() {
    console.log('[NoopAuthServiceForTokens] getRefreshToken');
    return 'noop';
  }
  refreshToken() {
    console.log('[NoopAuthServiceForTokens] refreshToken');
    return of({
      accessToken: 'noop',
      refreshToken: 'noop',
    });
  }
  saveAccessToken() {
    console.log('[NoopAuthServiceForTokens] saveAccessToken');
  }
  saveRefreshToken() {
    console.log('[NoopAuthServiceForTokens] saveRefreshToken');
  }
  onError() {
    console.log('[NoopAuthServiceForTokens] onError');
  }
}
