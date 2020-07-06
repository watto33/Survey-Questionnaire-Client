import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated;
  private authListenerSubscription: Subscription;
  private surveyListenerSubscription: Subscription;
  surveyIsAttempted;
  userName;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.surveyIsAttempted = this.authService.getSurveyStatus();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.surveyIsAttempted = this.authService.getSurveyStatus();
        this.userName = this.authService.getUserName();
      });

    this.surveyListenerSubscription = this.authService
      .getSurveyStatusListener()
      .subscribe((surveyIsAttempted) => {
        this.surveyIsAttempted = surveyIsAttempted;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
    this.surveyListenerSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
