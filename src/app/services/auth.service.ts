import { Observable } from 'rxjs';
import { User } from '../models';

/**
 * This class needs to be implemented.
 * In this project, it's implemented either by `AuthCookiesService` or `AuthTokensService`.
 * In `AppModule` there's a variable which tells Angular which one to choose from, so that
 * all components/services can safely inject the same `AuthService` without knowing which one it is.
 */
export abstract class AuthService {
  abstract register(credentials: { email: string, password: string, name: string, surname: string }): Observable<boolean>;
  abstract login(email: string, password: string): Observable<boolean>;
  abstract fetchUser(forceReload?: boolean): Observable<User>;
  abstract logout(): void;
}
