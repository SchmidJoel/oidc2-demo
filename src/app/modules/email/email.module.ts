import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs'; 

import { AuthenticationModule } from '../authentication';
import { EmailEditorComponent } from './components/email-editor/email-editor.component';
import { EmailViewComponent } from './components/email-view/email-view.component';
import { PgpImportComponent } from './components/pgp-import/pgp-import.component';
import { EmailComponent } from './pages/email/email.component';
import { EmailService } from './services/email/email.service';
import { PgpService } from './services/pgp/pgp.service';

@NgModule({
  imports: [
    AuthenticationModule,
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
    TextFieldModule,
  ],
  declarations: [
    EmailComponent,
    EmailEditorComponent,
    EmailViewComponent,
    PgpImportComponent,
  ],
  providers: [
    EmailService,
    PgpService,
  ],
  exports: [
    EmailComponent,
  ],
})
export class EmailModule { }
