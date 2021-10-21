import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { HomeComponent } from './components/home.component';
import { AuthTokensModule } from './auth-tokens/auth-tokens.module';
import { AuthCookiesModule } from './auth-cookies/auth-cookies.module';
import { AuthService } from './services/auth.service';
import { AuthTokensService } from './auth-tokens/auth-tokens.service';
import { AuthCookiesService } from './auth-cookies/auth-cookies.service';

const tokensOrCookies: 'tokens' | 'cookies' = 'tokens';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    // @ts-ignore
    tokensOrCookies === 'tokens' ? AuthTokensModule : AuthCookiesModule,
  ],
  providers: [
    {
      provide: AuthService,
      // @ts-ignore
      useExisting: tokensOrCookies === 'tokens' ? AuthTokensService : AuthCookiesService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
