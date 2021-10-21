# 🔑 Angular Authentication (demo)

> Demonstration of 2 different ways to achieve Authentication in an SPA with a back-end, for instructional purposes.

It contains 2 modules: `AuthCookiesModule` (standard Cookie-based authentication) and `AuthTokensModule` (a-la OAuth, no cookies, just access token and refresh token w/ rotation).

In AppModule, change the value of `tokensOrCookies` to load either of these 2 modules.

### Do you need a backend for testing?
For instructional purposes I've made multiple demos with Node/Express, feel free to use either of these, they should both work out of the box with this project:

- Use [this server](https://github.com/UserGalileo/express-ts-starter/tree/with-authentication) if you want to test the Cookie strategy.
- Use [this server](https://github.com/UserGalileo/express-ts-starter/tree/with-tokens) if you want to test the Tokens strategy.

---
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.
