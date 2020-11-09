import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {R4} from '@ahryman40k/ts-fhir-types';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getPatients() {
        return this.httpClient.get(environment.queryURI + '/Patient',
            {headers: this.getHeaders()});
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders({
            'Content-Type': 'application/fhir+json'
        });
        return headers;
    }

    getQuestionnaire() {
      return this.httpClient.get<R4.IQuestionnaire>('./assets/questionnaire.json');
    }
}


