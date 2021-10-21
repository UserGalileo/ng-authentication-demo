export const environment = {
  production: true,
  // Absolute paths don't work with Angular XSRF protection! This is a workaround for a bug.
  // See: https://github.com/angular/angular/issues/20511
  // Alternative: write your own interceptor.
  apiUrl: '//localhost:3000'
};
