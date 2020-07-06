import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';

import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DialogComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    QuestionnaireModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
