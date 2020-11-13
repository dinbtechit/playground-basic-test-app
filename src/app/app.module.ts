import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {ApiService} from './services/api-service.service';
import {AppRoutingModule} from './app-routing.module';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FieldArrayType, FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {MaterialModule} from './utilModules/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GroupComponent} from './questionnaire/group/group.component';
import {ObjectTypeComponent} from './questionnaire/group/object/object.type.component';
import {PatientsComponent} from './patients/patients.component';
import { PatientDetailsPipe } from './pipes/patient-details.pipe';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import { MenuComponent } from './menu/menu.component';

@NgModule({
    declarations: [
        AppComponent,
        QuestionnaireComponent,
        GroupComponent,
        ObjectTypeComponent,
        PatientsComponent,
        PatientDetailsPipe,
        MenuComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        NgxJsonViewerModule,
        FormlyModule.forRoot({
            extras: {lazyRender: true},
            validationMessages: [
                {name: 'required', message: 'required'}
            ],
            types: [
                {
                    name: 'boolean',
                    extends: 'checkbox'
                },
                {
                    name: 'string',
                    extends: 'input',
                    defaultOptions: {
                        templateOptions: {
                            maxLength: 1024,
                        }
                    }
                },
                {
                    name: 'date',
                    extends: 'input',
                    defaultOptions: {
                        templateOptions: {
                            type: 'date'
                        }
                    }
                },
                {
                    name: 'dateTime',
                    extends: 'input',
                    defaultOptions: {
                        templateOptions: {
                            type: 'datetime-local'
                        }
                    }
                },
                {
                    name: 'array', component: GroupComponent
                },
                {
                    name: 'object', component: ObjectTypeComponent
                }

            ]
        }),
        FormlyMaterialModule,
        FormsModule
    ],
    providers: [
        ApiService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
