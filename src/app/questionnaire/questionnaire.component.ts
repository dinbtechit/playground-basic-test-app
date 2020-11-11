import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api-service.service';
import {
    IQuestionnaireResponse, QuestionnaireResponseStatusKind, RTTI_Questionnaire, RTTI_QuestionnaireResponse
} from '@ahryman40k/ts-fhir-types/lib/R4';
import * as E from 'fp-ts/lib/Either';

import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormlyUtilService} from '../services/formly-util.service';
import {QuestionnaireService} from '../services/questionnaire.service';
import {delay} from 'rxjs/operators';


@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

    // Dynamic
    formDy = new FormGroup({});
    model: any = {};
    options: FormlyFormOptions = {
        /*  formState: {
              awesomeIsForced: true,
          },*/
    };
    fieldsDy: FormlyFieldConfig[] = [];

    questionnaireResponse: IQuestionnaireResponse = {resourceType: 'QuestionnaireResponse'};

    questionnaireJsonValid = false;
    questionnaireLoading = true;
    questionnaireResponseJsonValid = false;

    constructor(private apiService: ApiService,
                private formlyUtil: FormlyUtilService,
                private questionnaireService: QuestionnaireService) {
    }

    ngOnInit(): void {
        this.getQuestions();
    }

    getQuestions(): void {
        this.apiService.getQuestionnaire().subscribe((questionnaire) => {
            this.questionnaireLoading = true;
            const decodeQuestionnaire = RTTI_Questionnaire.decode(questionnaire);
            this.questionnaireJsonValid = E.isRight(decodeQuestionnaire);
            if (this.questionnaireResponse) {
                this.model = questionnaire;
                this.fieldsDy = this.formlyUtil.convertQuestionnaireToFormlySchema(questionnaire);
            }
            this.questionnaireLoading = false;
        });
    }

    submit() {
        if (this.formDy.valid) {
            this.questionnaireResponse = this.questionnaireService
                .generateQuestionnaireResponse(this.model, this.formDy.value);
            this.questionnaireResponseJsonValid =
                this.questionnaireResponse.status === QuestionnaireResponseStatusKind._completed ? true : false;
        } else {
            this.resetQuestionnaireResponse();
        }
    }

    resetQuestionnaireResponse() {
        this.questionnaireResponse = {resourceType: 'QuestionnaireResponse'};
        this.questionnaireResponseJsonValid = false;
    }

    reset() {
        this.resetQuestionnaireResponse();
        this.options.resetModel();
    }
}
