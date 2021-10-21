import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthServiceForTokens } from './refresh-token/auth-service-for-tokens';
import { AuthTokensService } from './auth-tokens.service';

@NgModule({
  imports: [
    CommonModule,
    RefreshTokenModule
  ],
  providers: [
    {
      provide: AuthServiceForTokens,
      useExisting: AuthTokensService
    }
  ],
})
export class AuthTokensModule {
  constructor(@Optional() @SkipSelf() self: AuthTokensModule) {
    if (self) {
      throw new Error('AuthTokensModule imported more than once.')
    }
  }
}
