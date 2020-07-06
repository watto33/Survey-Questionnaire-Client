import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Injectable()
export class QuestionnaireGuard implements CanActivate, OnDestroy {
  surveyStatus;
  surveyStatusListnerSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.surveyStatus = this.authService.getSurveyStatus();
    this.surveyStatusListnerSubscription = this.authService
      .getSurveyStatusListener()
      .subscribe((surveyStatus) => {
        this.surveyStatus = surveyStatus;
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAttempted = this.authService.getSurveyStatus();
    if (isAttempted) {
      this.router.navigate(['/']);
    }
    return !isAttempted;
  }

  ngOnDestroy() {
    this.surveyStatusListnerSubscription.unsubscribe();
  }
}
