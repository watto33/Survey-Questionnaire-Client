import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from './../../environments/environment';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  REQUEST_URL = environment.url + 'auth/';
  private token;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();
  public surveyStatusListner = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  surveyStatus: boolean;
  private userName;

  createUser(name: string, email: string, password: string): void {
    const authData: AuthData = { name, email, password };
    this.http.post(`${this.REQUEST_URL}signup`, authData).subscribe(
      (responseData) => {
        this.router.navigate(['auth/login']);
      },
      (err) => {
        this.authStatusListner.next(false);
      }
    );
  }

  login(email: string, password: string): void {
    const authData = { email, password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        surveyStatus: boolean;
        userName: string;
      }>(`${this.REQUEST_URL}login`, authData)
      .subscribe(
        (responseData) => {
          this.token = responseData.token;
          if (this.token) {
            const expiresIn = responseData.expiresIn;
            this.setAuthTimer(expiresIn);
            this.isAuthenticated = true;
            this.userId = responseData.userId;
            this.userName = responseData.userName;
            this.surveyStatus = responseData.surveyStatus;
            this.surveyStatusListner.next(this.surveyStatus);
            this.authStatusListner.next(true);
            const currentDateTime = new Date();
            const expirationDate = new Date(
              currentDateTime.getTime() + expiresIn * 1000
            );
            this.saveAuthData(
              this.token,
              expirationDate,
              this.surveyStatus,
              this.userName
            );
            this.router.navigate(['/']);
          }
        },
        (err) => {
          this.authStatusListner.next(false);
        }
      );
  }

  autoLogin(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const currentDateTime = new Date();
    const expiresIn =
      authInformation.expirationDate.getTime() - currentDateTime.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userName = authInformation.userName;
      this.surveyStatus = JSON.parse(authInformation.surveyStatus);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
      this.surveyStatusListner.next(JSON.parse(authInformation.surveyStatus));
    }
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.userName = undefined;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }
  getUserName() {
    return this.userName;
  }

  getAuthStatusListener() {
    return this.authStatusListner.asObservable();
  }

  getSurveyStatusListener() {
    return this.surveyStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getSurveyStatus() {
    return this.surveyStatus;
  }

  setSurveyStatus(status) {
    this.surveyStatus = status;
    this.surveyStatusListner.next(this.surveyStatus);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    surveyStatus,
    userName: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('surveyStatus', surveyStatus);
    localStorage.setItem('userName', userName);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('surveyStatus');
    localStorage.removeItem('userName');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const surveyStatus = localStorage.getItem('surveyStatus');
    const userName = localStorage.getItem('userName');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      surveyStatus: surveyStatus,
      userName: userName,
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => this.logout(), duration * 1000);
  }
}
