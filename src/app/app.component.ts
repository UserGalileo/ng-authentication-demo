import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a routerLink="/">Home</a> |
    <a routerLink="/login">Login</a> |
    <a routerLink="/register">Register</a>
    <hr>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
