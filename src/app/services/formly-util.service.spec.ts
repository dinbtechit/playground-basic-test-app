import {TestBed} from '@angular/core/testing';
import {FormlyUtilService} from './formly-util.service';
import {FormlyJsonschema} from '@ngx-formly/core/json-schema';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('FormlyUtilService', () => {
    let service: FormlyUtilService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormlyUtilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

fdescribe('Formly JSON Schema from Questionnaire Items', () => {
    let service: FormlyUtilService;
    let formlyJsonSchema: FormlyJsonschema;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormlyJsonschema, HttpClient, HttpHandler]
        });
        service = TestBed.inject(FormlyUtilService);
        formlyJsonSchema = TestBed.inject(FormlyJsonschema);
    });

    let questionnaire = JSON.parse(JSON.stringify({
        resourceType: 'Questionnaire',
        id: 'f201',
        url: 'http://hl7.org/fhir/Questionnaire/f201',
        status: 'active',
        subjectType: [
            'Patient'
        ],
        date: '2010',
        item: [
            {
                linkId: '1',
                text: 'Do you have allergies?',
                type: 'boolean'
            },
            {
                linkId: '2',
                text: 'General questions',
                type: 'group',
                item: [
                    {
                        linkId: '2.1',
                        text: 'What is your gender?',
                        type: 'string'
                    },
                    {
                        linkId: '2.2',
                        text: 'What is your date of birth?',
                        type: 'date'
                    },
                    {
                        linkId: '2.3',
                        text: 'What is your country of birth?',
                        type: 'string'
                    },
                    {
                        linkId: '2.4',
                        text: 'What is your marital status?',
                        type: 'string'
                    }
                ]
            },
            {
                linkId: '3',
                text: 'Intoxications',
                type: 'group',
                item: [
                    {
                        linkId: '3.1',
                        text: 'Do you smoke?',
                        type: 'boolean'
                    },
                    {
                        linkId: '3.2',
                        text: 'Do you drink alchohol?',
                        type: 'boolean'
                    }
                ]
            }
        ]
    }));
    const schema: object = {
        title: 'questionnaire',
        type: 'object',
        properties: {
            1: {
                title: 'Do you have allergies?',
                type: 'boolean'
            },
            2: {
                title: 'General Questions',
                type: 'object',
                properties: {
                    2.1: {
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
                    3.2: {
                        title: 'Drinking?',
                        type: 'boolean'
                    },
                }
            }
        },
    };

    it('should return a parsed FormlyConfig[]', () => {
        const fieldsConfig = formlyJsonSchema.toFieldConfig(schema);
        expect(service.convertQuestionnaireToFormlySchema(questionnaire)).toBeTruthy();
    });

    it('should handle when no item exist', () => {

        questionnaire = JSON.parse(JSON.stringify({
            resourceType: 'Questionnaire',
            id: 'f201',
            url: 'http://hl7.org/fhir/Questionnaire/f201',
            status: 'active',
            subjectType: [
                'Patient'
            ],
            date: '2010',
        }));
        const fieldsConfig = formlyJsonSchema.toFieldConfig(schema);
        expect(service.convertQuestionnaireToFormlySchema(questionnaire)).toBeTruthy();
    });
});
