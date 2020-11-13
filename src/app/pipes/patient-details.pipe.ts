import {Pipe, PipeTransform} from '@angular/core';
import {IHumanName, IPatient} from '@ahryman40k/ts-fhir-types/lib/R4';

@Pipe({
    name: 'patientDetails'
})
export class PatientDetailsPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): object | string {
        const colName = args[0] as string;
        if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'object') {
            return value;
        }
        return '';
    }

}
