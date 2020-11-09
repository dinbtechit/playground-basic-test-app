import {TestBed} from '@angular/core/testing';

import {QuestionnaireService} from './questionnaire.service';

let service: QuestionnaireService;
fdescribe('QuestionnaireService', () => {
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

fdescribe('QuestionnaireService Test Answer Object', () => {

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

    it('when type and linkId is null', () => {
        const linkId = null;
        const type = null;
        expect(service.mapToAnswerObj(answer, linkId, type)).toEqual({});
    });
});
