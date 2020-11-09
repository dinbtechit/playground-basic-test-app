import {Component, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/core';

@Component({
    selector: 'app-object-type',
    template: `
        <br><br>
        <mat-card-title *ngIf="to.label" style="font-size: large">
            {{ to.label }}
        </mat-card-title>
        <p *ngIf="to.description">{{ to.description }}</p>
        <div *ngIf="showError && formControl.errors">
            <formly-validation-message [field]="field"></formly-validation-message>
        </div>
        <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    `,
    styles: []
})
export class ObjectTypeComponent extends FieldType {
}
