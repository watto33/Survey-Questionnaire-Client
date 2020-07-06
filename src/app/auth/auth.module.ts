import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from './../angular-material.module';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
