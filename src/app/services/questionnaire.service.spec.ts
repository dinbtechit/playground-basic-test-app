import {TestBed} from '@angular/core/testing';

import {QuestionnaireService} from './questionnaire.service';
import {
    IQuestionnaire,
    IQuestionnaireResponse,
    QuestionnaireResponseStatusKind,
    RTTI_Questionnaire
} from '@ahryman40k/ts-fhir-types/lib/R4';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Test} from 'tslint';

let service: QuestionnaireService;
fdescribe('QuestionnaireService should find the Answer with linkId', () => {
    const answer = {
        1: null,
        2: {
            2: {
                1: 'Male',
                2: '2020-11-09',
                3: null,
                4: null
            }
        },
        3: {
            3: {
                1: true,
                2: true
            }
        },
        4: {
            4: {
                4: {
                    1: 'Ma'
                }
            }
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QuestionnaireService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when lineId is 1', () => {
        const linkId = '1';
        expect(service.mapAnswersTo(answer, linkId)).toBe(null);
    });

    it('when linkId is 2.1', () => {
        const linkId = '2.1';
        expect(service.mapAnswersTo(answer, linkId)).toBe('Male');
    });

    it('when linkId is 2.2', () => {
        const linkId = '2.2';
        expect(service.mapAnswersTo(answer, linkId)).toBe('2020-11-09');
    });

    it('when linkId is 2.2.1', () => {
        const linkId = '2.2.1';
        expect(service.mapAnswersTo(answer, linkId)).toBeLessThanOrEqual(0);
    });

    it('when linkId is 4.4.1', () => {
        const linkId = '4.4.1';
        expect(service.mapAnswersTo(answer, linkId)).toBe('Ma');
    });

    it('when linkId is null', () => {
        const linkId = null;
        expect(service.mapAnswersTo(answer, linkId)).toBeLessThanOrEqual(0);
    });
});

fdescribe('QuestionnaireService Generate Answer Object', () => {

    const answer = {
        1: true,
        2: {
            2: {
                1: 'Male',
                2: '2020-11-09',
                3: null,
                4: null
            }
        },
        3: {
            3: {
                1: true,
                2: true
            }
        },
        4: {
            4: {
                4: {
                    1: 'Ma'
                }
            }
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QuestionnaireService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when type is boolean', () => {
        const linkId = '1';
        const type = 'boolean';
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({valueBoolean: true});
    });

    it('when type is string', () => {
        const linkId = '2.1';
        const type = 'string';
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({valueString: 'Male'});
    });

    it('when type is date', () => {
        const linkId = '2.2';
        const type = 'date';
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({valueDate: '2020-11-09'});
    });

    it('when type is null', () => {
        const linkId = '2.2';
        const type = null;
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({});
    });

    it('when type and linkId is null', () => {
        const linkId = null;
        const type = null;
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({});
    });
});

export class TestService {
    constructor(public http: HttpClient) {
    }
}

fdescribe('Should Generate valid QuestionnaireResponse', () => {
    const answer = {
        1: true,
        2: {
            2: {
                1: 'Male',
                2: '2020-11-09',
                3: 'Canada',
                4: 'Single'
            }
        },
        3: {
            3: {
                1: true,
                2: true
            }
        }
    };
    const questionnaire = JSON.parse(JSON.stringify({
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
    const questionnaireResponse: IQuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        identifier: {
            value: 'DYNAMIC_DATA',
        },
        questionnaire: questionnaire.url,
        status: QuestionnaireResponseStatusKind._completed,
        authored: new Date().toISOString(),
        item: [
            {
                linkId: '1',
                text: 'Do you have allergies?',
                answer: [
                    {
                        valueBoolean: true
                    }
                ]
            },
            {
                linkId: '2',
                text: 'General questions',
                item: [
                    {
                        linkId: '2.1',
                        text: 'What is your gender?',
                        answer: [
                            {
                                valueString: 'Male'
                            }
                        ]
                    },
                    {
                        linkId: '2.2',
                        text: 'What is your date of birth?',
                        answer: [
                            {
                                valueDate: '2020-11-09'
                            }
                        ]
                    },
                    {
                        linkId: '2.3',
                        text: 'What is your country of birth?',
                        answer: [
                            {
                                valueString: 'Canada'
                            }
                        ]
                    },
                    {
                        linkId: '2.4',
                        text: 'What is your marital status?',
                        answer: [
                            {
                                valueString: 'Single'
                            }
                        ]
                    }
                ]
            },
            {
                linkId: '3',
                text: 'Intoxications',
                item: [
                    {
                        linkId: '3.1',
                        text: 'Do you smoke?',
                        answer: [
                            {
                                valueBoolean: true
                            }
                        ]
                    },
                    {
                        linkId: '3.2',
                        text: 'Do you drink alchohol?',
                        answer: [
                            {
                                valueBoolean: true
                            }
                        ]
                    }
                ]
            }
        ]
    };
    it('check Resource Type is QuestionnaireResponse', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).resourceType).toBe('QuestionnaireResponse');
    });

    it('check if the identifier is truthy', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).identifier.value).toBeTruthy();
    });


    it('check questionnaire URL', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).questionnaire).toBe(questionnaireResponse.questionnaire);
    });

    it('check status is completed', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).status).toBe(questionnaireResponse.status);
    });

    it('check if question items is truthy', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).item).toBeTruthy();
    });

    it('check if answers is truthy', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).item).toBeTruthy();
    });

    it('check if Answers are correct', () => {
        expect(service.generateQuestionnaireResponse(questionnaire, answer).item).toEqual(questionnaireResponse.item);
    });
});
