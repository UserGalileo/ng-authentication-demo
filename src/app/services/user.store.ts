import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';

/**
 * Just a convenience service
 */
@Injectable({ providedIn: 'root' })
export class UserStore {

  private _user$ = new BehaviorSubject<User | null>(null);
  public user$ = this._user$.asObservable();

  setUser(user: User): void {
    this._user$.next(user);
  }

  removeUser(): void {
    this._user$.next(null);
  }
}
