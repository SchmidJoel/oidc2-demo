import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IdentityMenuComponent } from './components/identity-menu/identity-menu.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { IdentityService } from './services/identity/identity.service';
import { OidcRedirectComponent } from './pages/oidc-redirect/oidc-redirect.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [
    IdentityMenuComponent,
    OidcRedirectComponent,
    ProfileImageComponent,
  ],
  providers: [
    IdentityService,
  ],
  exports: [
    IdentityMenuComponent,
    OidcRedirectComponent,
    ProfileImageComponent,
  ],
})
export class AuthenticationModule { }
