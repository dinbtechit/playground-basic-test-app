import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api-service.service';
import {
    IQuestionnaireResponse, RTTI_Questionnaire
} from '@ahryman40k/ts-fhir-types/lib/R4';
import * as E from 'fp-ts/lib/Either';

import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormlyUtilService} from '../services/formly-util.service';
import {QuestionnaireService} from '../services/questionnaire.service';


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

    questionnaireJsonInvalid = false;
    questionnaireLoading = true;
    questionnaireResponseJsonInvalid = false;

    constructor(private apiService: ApiService,
                private formlyUtil: FormlyUtilService,
                private questionnaireService: QuestionnaireService) {
        this.getQuestions();
    }

    ngOnInit(): void {
    }

    getQuestions(): void {
        this.apiService.getQuestionnaire().subscribe((questionnaire) => {
            this.questionnaireLoading = true;
            const decodeQuestionnaire = RTTI_Questionnaire.decode(questionnaire);
            this.questionnaireJsonInvalid = E.isRight(decodeQuestionnaire);
            if (this.questionnaireResponse) {
                this.model = questionnaire;
                this.fieldsDy = this.formlyUtil.convertQuestionnaireToFormlySchema(questionnaire);
            }
            this.questionnaireLoading = false;
        });
    }

    submit() {
        this.questionnaireResponse = this.questionnaireService
            .generateQuestionnaireResponse(this.model, this.formDy.value);
        console.log(JSON.stringify(this.formDy.value));
    }

    reset() {
        this.questionnaireResponse = {resourceType: 'QuestionnaireResponse'};
        this.options.resetModel();
    }
}
