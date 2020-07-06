import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from './../../environments/environment';

import { AuthService } from './../auth/auth.service';

import { Answer } from './answers.model';
import { Questionnaire } from './questionnaire.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private questionnaire: Questionnaire;
  private questionnaireUpdated = new Subject<Questionnaire>();

  REQUEST_URL = environment.url + 'questionnaire/';

  private answers: Answer[];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getQuestionnaire() {
    this.http
      .get<{ message: string; questions: { questionnaire: Questionnaire } }>(
        `${this.REQUEST_URL}questions`
      )
      .subscribe((quesobject) => {
        this.questionnaire = quesobject.questions.questionnaire;
        this.questionnaireUpdated.next({ ...this.questionnaire });
      });
  }

  getQuestionnaireUpdateListner() {
    return this.questionnaireUpdated.asObservable();
  }

  onPushAnswer(form, questions) {
    this.answers = questions.map((question) => {
      if (question.identifier.includes('date')) {
        if (form.value[question.identifier] !== undefined) {
          form.value[question.identifier] = form.value[
            question.identifier
          ].toLocaleDateString();
        }
      }
      return {
        id: question.identifier,
        question: question.headline,
        answer: form.value[question.identifier],
      };
    });

    this.http
      .post<{ message: string }>(`${this.REQUEST_URL}answers`, this.answers)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.authService.setSurveyStatus(true);
        localStorage.setItem('surveyStatus', 'true');
      });
  }
}
