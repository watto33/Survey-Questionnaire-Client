import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Questionnaire } from './../questionnaire.model';

import { QuestionnaireService } from './../questionnaire.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit, OnDestroy {
  constructor(private quesService: QuestionnaireService) {}

  questionnaire: Questionnaire;
  quesSubscription: Subscription;

  isLoading;

  ngOnInit(): void {
    this.isLoading = true;
    this.quesService.getQuestionnaire();
    this.quesSubscription = this.quesService
      .getQuestionnaireUpdateListner()
      .subscribe((questionnaire: Questionnaire) => {
        this.questionnaire = questionnaire;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.quesSubscription.unsubscribe();
  }
}
