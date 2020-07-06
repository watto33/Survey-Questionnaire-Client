import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/dialog/dialog.component';

import { QuestionnaireService } from '../questionnaire.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  questions = [];
  answers = [];

  isLoading;
  quesSubscription: Subscription;

  constructor(
    private quesService: QuestionnaireService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.quesService.getQuestionnaire();
    this.quesSubscription = this.quesService
      .getQuestionnaireUpdateListner()
      .subscribe((questionnaire) => {
        this.questions = questionnaire.questions;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.quesSubscription.unsubscribe();
  }

  clear(i): void {
    this.answers[i] = undefined;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.quesService.onPushAnswer(form, this.questions);
    form.resetForm();
    this.answers = [];
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Dialog result: Your response has been recorded');
    });
  }
}
