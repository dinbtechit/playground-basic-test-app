import {Component, OnInit} from '@angular/core';
import {FieldArrayType} from '@ngx-formly/core';

@Component({
    selector: 'app-group',
    template: `
        <div class="mb-3">
            <h1 *ngIf="to.label">{{ to.label }}</h1>
            <p *ngIf="to.description">{{ to.description }}</p>

            <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
                <formly-validation-message [field]="field"></formly-validation-message>
            </div>

            <div *ngFor="let f of field.fieldArray.fieldGroup;let i = index;" class="row">
                <formly-field class="col-10" [field]="f"></formly-field>
            </div>
        </div>
    `,
    styles: []
})
export class GroupComponent extends FieldArrayType {

}
