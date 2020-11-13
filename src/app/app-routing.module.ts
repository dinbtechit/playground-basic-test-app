import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {PatientsComponent} from './patients/patients.component';

const routes: Routes = [
    {path: '', redirectTo: 'pa', pathMatch: 'full'},
    {path: 'qna', component: QuestionnaireComponent},
    {path: 'pa', component: PatientsComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
