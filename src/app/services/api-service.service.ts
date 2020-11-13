import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {R4} from '@ahryman40k/ts-fhir-types';
import {IBundle} from '@ahryman40k/ts-fhir-types/lib/R4';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getPatients() {
        return this.httpClient.get<IBundle>(environment.queryURI + '/Patient',
            {headers: this.getHeaders()});
    }


    /**
     * http://hapi.fhir.org/baseR4/Patient?birthdate=ge1960&birthdate=le1965
     */
    getPatientsBetween1960To1965() {
        return this.httpClient.get<IBundle>(environment.queryURI + '/Patient',
            {
                headers: this.getHeaders(),
                params: this.getParams()
            });
    }

    /**
     * Example http://hapi.fhir.org/baseR4/Patient?
     * birthdate=ge1960&birthdate=le1965
     * @param searchBy family, given and birthdate
     *                 &_filter=family eq "aaron" or given eq "aaron" and birthdate gt "1960-01-01"
     */
    searchPatients(searchBy: SearchParameters) {
        const urlPath = '/Patient';
        return this.httpClient.get<IBundle>(environment.queryURI + urlPath,
            {
                headers: this.getHeaders(),
                params: this.getSearchParams(searchBy),
            });
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders({
            'Content-Type': 'application/fhir+json'
        });
        return headers;
    }

    /**
     * Example URL - http://hapi.fhir.org/baseR4/Patient?birthdate=1965-12-10
     * @param searchBy family, given and birthdate
     *                 &_filter=family eq "aaron" or given eq "aaron" and birthdate gt "1960-01-01"
     */
    getSearchParams(searchBy: SearchParameters): HttpParams {
        let params = this.getParams();
        console.log(searchBy ? true : false);
        let paramsValue = '';
        if (searchBy.name) {
            paramsValue = paramsValue + `family eq "${searchBy.name}" or given eq "${searchBy.name}"`;
        }
        if (searchBy.birthdate) {
            paramsValue = paramsValue + ((paramsValue.length > 1) ? ` and ` : '');
            paramsValue = paramsValue + `birthdate eq "${searchBy.birthdate}"`;
        }
        console.log(paramsValue);
        const encoder = new HttpUrlEncodingCodec();
        console.log(encoder.encodeValue(paramsValue));
        params = params.append('_filter', paramsValue);
        return params;
    }

    private getParams(): HttpParams {
        const params = new HttpParams()
            .append('birthdate', 'ge1960')
            .append('birthdate', 'le1965');
        return params;
    }

    getQuestionnaire() {
        return this.httpClient.get<R4.IQuestionnaire>('./assets/questionnaire.json');
    }
}

export interface SearchParameters {
    name: string;
    birthdate: string;
}


