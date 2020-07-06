import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
