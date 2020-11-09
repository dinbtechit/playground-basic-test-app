import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {AppComponent} from './app.component';

const routes: Routes = [
   { path: 'qna', component: QuestionnaireComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
