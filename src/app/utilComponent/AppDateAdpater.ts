import {NativeDateAdapter} from '@angular/material/core';
import {MatDateFormats} from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: any): string {
        if (displayFormat === 'input') {
            console.log(date);
            let day: string = date.getDate().toString();
            day = +day < 10 ? '0' + day : day;
            let month: string = (date.getMonth() + 1).toString();
            month = +month < 10 ? '0' + month : month;
            const year = date.getFullYear();
            console.log(year);
            return `${year}/${month}/${day}`;
        }
        return date.toDateString();
    }
}

export const APP_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
    },
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'numeric'},
        dateA11yLabel: {
            year: 'numeric', month: 'long', day: 'numeric'
        },
        monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
};
