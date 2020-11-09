import {Injectable} from '@angular/core';
import {FormlyJsonschema} from '@ngx-formly/core/json-schema';
import {IQuestionnaire, IQuestionnaire_Item} from '@ahryman40k/ts-fhir-types/lib/R4';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FormlyUtilService {

    field: FormlyFieldConfig = {};

    constructor(private formlyJsonSchema: FormlyJsonschema, private http: HttpClient) {
    }

    public convertQuestionnaireToFormlySchema(qna: IQuestionnaire)
        : FormlyFieldConfig[] {
        let fields = {};
        fields = this.qrItemsToFormly(qna, qna.item, fields);
        const schema: object = {
            title: 'questionnaire',
            type: 'object',
            properties: fields
            /*properties: {
                item_answer : {
                    title: 'Do you have allergies?',
                    type: 'boolean'
                },
                2: {
                    title: 'General Questions',
                    type: 'object',
                    properties: {
                        2.1 : {
                            title: 'What is your Gender?',
                            type: 'string'
                        },
                        2.2: {
                            title: 'What is your date of birth?',
                            type: 'date'
                        },
                        2.3: {
                            title: 'What is your country of birth?',
                            type: 'string'
                        },
                        2.4: {
                            title: 'What is your marital status?',
                            type: 'string'
                        },
                    }
                },
                3: {
                    title: 'Intoxication',
                    type: 'object',
                    properties: {
                        3.1: {
                            title: 'Smoking?',
                            type: 'boolean'
                        },
                        drinking: {
                            title: 'Drinking?',
                            type: 'boolean'
                        },
                    }
                }
            },*/
        };
        this.field = this.formlyJsonSchema.toFieldConfig(schema);
        /*console.log(this.field);*/
        return this.field.fieldGroup;
    }

    /**
     * Questionnaire Items to Formly Schema (Runs Recursively to parse groups within group Item)
     * @param qna a Questionnaire Object
     * @param item items within the Questionnaire
     * @param obj  parsed formly json schema.
     */
    qrItemsToFormly(qna: IQuestionnaire, item: IQuestionnaire_Item[], obj) {
        for (const field of item) {
            if (field.type !== 'group') {
                obj[field.linkId] = {
                    title: field.text,
                    type: field.type,
                };
            } else {
                obj[field.linkId] = {
                    title: field.text,
                    type: 'object',
                    properties: {}
                };
                const group = obj[field.linkId].properties;
                obj[field.linkId].properties = this.qrItemsToFormly(qna, field.item, group);
            }
        }
        /*console.log(Object.entries(obj).length);
        console.log(obj);*/
        return obj;
    }

    /**
     * Questionnaire Items to Formly Schema (Runs only once)
     * @param qna - a Questionnaire object.
     */
    qrItemsToFormlyOnce(qna: IQuestionnaire) {
        const obj = {};
        for (const field of qna.item) {
            if (field.type !== 'group') {
                obj[field.linkId] = {
                    title: field.text,
                    type: field.type,
                };
            } else {
                obj[field.linkId] = {
                    title: field.text,
                    type: 'object',
                    properties: {}
                };
                const group = obj[field.linkId].properties;
                for (const groupItem of field.item) {
                    group[groupItem.linkId] = {
                        title: groupItem.text,
                        type: groupItem.type,
                    };
                }
            }
        }
        return obj;
    }
}
