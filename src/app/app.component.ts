import {Component, OnInit} from '@angular/core';
import {ApiService} from '../app/services/api-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    title = 'fhir-app-test';

    constructor() {
    }

    ngOnInit() {
    }
}


