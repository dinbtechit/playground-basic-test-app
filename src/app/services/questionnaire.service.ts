import {Injectable} from '@angular/core';
import {
    IQuestionnaire, IQuestionnaire_Item,
    IQuestionnaireResponse, IQuestionnaireResponse_Answer, IQuestionnaireResponse_Item,
    QuestionnaireResponseStatusKind
} from '@ahryman40k/ts-fhir-types/lib/R4';
import {v1 as uuidv1} from 'uuid';


@Injectable({
    providedIn: 'root'
})
export class QuestionnaireService {

    constructor() {
    }

    /**
     * Generates Questionnaire Response based of Questionnaire and Form Data.
     */
    generateQuestionnaireResponse(questionnaire: IQuestionnaire,
                                  answers: any) {
        const questionnaireResponse: IQuestionnaireResponse = {
            resourceType: 'QuestionnaireResponse',
            identifier: {
                value: uuidv1(),
            },
            questionnaire: questionnaire.url,
            status: QuestionnaireResponseStatusKind._completed,
            authored: new Date().toISOString(),
        };
        let obj: IQuestionnaireResponse_Item[] = [];
        obj = this.mapQrItemsToQrResAnswers(questionnaire, questionnaire.item, obj, answers);
        questionnaireResponse.item = obj;
        console.log(obj);
        return questionnaireResponse;
    }

    /**
     * Maps Form Answer to Questionnaire Answers using linkId
     */
    mapAnswersTo(formAnswers, linkId) {
        if (!linkId) {
            return [];
        }
        const pathArr = linkId.split('.');
        if (linkId.length > 1) {
            pathArr.unshift(linkId[0]);
        }
        return pathArr.reduce((obj, key) =>
            (obj && obj[key] !== 'undefined') ? obj[key] : undefined, formAnswers);
    }

    /**
     * Map Form linkId to Answer Objec
     */
    mapToAnswerObj(answers: any, linkId: string, type: string): IQuestionnaireResponse_Answer {
        let answer: IQuestionnaireResponse_Answer = {};
        if (type === 'boolean') {
            answer = {
                valueBoolean: this.mapAnswersTo(answers, linkId),
            };
        } else if (type === 'string') {
            answer = {
                valueString: this.mapAnswersTo(answers, linkId),
            };
        } else if (type === 'date') {
            answer = {
                valueDate: this.mapAnswersTo(answers, linkId),
            };
        } else if (type === 'dateTime') {
            answer = {
                valueDateTime: this.mapAnswersTo(answers, linkId),
            };
        } else if (type === 'time') {
            answer = {
                valueTime: this.mapAnswersTo(answers, linkId),
            };
        } else if (type === 'uri') {
            answer = {
                valueUri: this.mapAnswersTo(answers, linkId),
            };
        }
        return answer;
    }

    /**
     * Converts Questionnaire Items to QuestionnaireResponse Answers
     *
     */
    mapQrItemsToQrResAnswers(qna: IQuestionnaire,
                             item: IQuestionnaire_Item[],
                             obj: IQuestionnaireResponse_Item[], answers: any)
        : IQuestionnaireResponse_Item[] {
        for (const field of item) {
            if (field.type !== 'group') {
                const it: IQuestionnaireResponse_Item = {
                    linkId: field.linkId,
                    text: field.text,
                    answer: []
                };
                it.answer.push(this.mapToAnswerObj(answers, field.linkId, field.type));
                obj.push(it);
            } else {
                const it: IQuestionnaireResponse_Item = {
                    linkId: field.linkId,
                    text: field.text,
                    item: []
                };
                const group = it.item;
                it.item = this.mapQrItemsToQrResAnswers(qna, field.item, group, answers);
                obj.push(it);
            }
        }
        return obj;
    }
}
