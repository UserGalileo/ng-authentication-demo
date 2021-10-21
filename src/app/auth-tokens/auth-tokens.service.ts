import { Injectable } from '@angular/core';
import { AuthServiceForTokens } from './refresh-token/auth-service-for-tokens';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { User } from '../models';
import { map, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { UserStore } from '../services/user.store';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthTokensService implements AuthServiceForTokens, AuthService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private userStore: UserStore
  ) {}

  /**
   * Registers a user
   */
  register(credentials: { email: string, password: string, name: string, surname: string }): Observable<any> {
    return this.http.post<boolean>(`${env.apiUrl}/register`, credentials);
  }

  /**
   * Logs the user in, with email and password.
   * Saves tokens in localStorage to persist the user's "session".
   * It also gets the user info and populates the state.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${env.apiUrl}/login`, { email, password }).pipe(
      tap(({ access_token, refresh_token }) => {
        this.saveAccessToken(access_token);
        this.saveRefreshToken(refresh_token);
      }),
      switchMapTo(this.fetchUser()),
    );
  }

  /**
   * Gets the User's info from server and populates the state.
   * This is _the_ way to check if the user is still logged in.
   */
  fetchUser(forceReload = false): Observable<User> {
    return this.userStore.user$.pipe(
      take(1),
      switchMap(user => {
        return (!!user && !forceReload)
          ? of(user)
          : this.http.get<User>(`${env.apiUrl}/me`, {}).pipe(
            tap(u => this.userStore.setUser(u))
          );
      })
    );
  }

  /**
   * Logs out the user, revokes the token, clears the store and navigates to login.
   */
  logout(): void {
    this.http.post(`${env.apiUrl}/logout`, {
      refresh_token: this.getRefreshToken()
    }).subscribe(() => {
      this.userStore.removeUser();
      localStorage.removeItem('rt');
      localStorage.removeItem('at');
      this.router.navigateByUrl('/login');
    })
  }

  /**
   * Implements AuthServiceForTokens
   */
  getAccessToken(): any {
    return localStorage.getItem('at') || '';
  }

  /**
   * Implements AuthServiceForTokens
   */
  getRefreshToken(): any {
    return localStorage.getItem('rt') || '';
  }

  /**
   * Implements AuthServiceForTokens
   */
  onRefreshError() {
    this.logout();
  }

  /**
   * Implements AuthServiceForTokens
   */
  refreshToken(refreshToken: any): Observable<{ accessToken: any; refreshToken: any }> {
    return this.http.post<{ access_token: any, refresh_token: any }>(`${env.apiUrl}/token`, {
      refresh_token: refreshToken
    }).pipe(
      map(res => ({ accessToken: res.access_token, refreshToken: res.refresh_token }))
    );
  }

  /**
   * Implements AuthServiceForTokens
   */
  saveAccessToken(accessToken: any) {
    localStorage.setItem('at', accessToken)
  }

  /**
   * Implements AuthServiceForTokens
   */
  saveRefreshToken(refreshToken: any) {
    localStorage.setItem('rt', refreshToken)
  }
}
