import { InjectionToken } from '@angular/core';

export const REFRESH_URL_BLACKLIST = new InjectionToken<Array<string | RegExp>>(
  `Refreshing tokens should be skipped for these URLs`
);

export const DEFAULT_REFRESH_URL_BLACKLIST = [
  'login',
  'logout',
  'auth',
  'refresh',
  'token',
  'register'
];
