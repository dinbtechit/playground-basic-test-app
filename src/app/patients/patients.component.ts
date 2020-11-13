import {AfterViewInit, Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {ApiService, SearchParameters} from '../services/api-service.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {IBundle_Entry} from '@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Bundle_Entry';
import {IPatient} from '@ahryman40k/ts-fhir-types/lib/R4';
import {map} from 'rxjs/operators';
import {MatSort, Sort} from '@angular/material/sort';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {APP_DATE_FORMATS, AppDateAdapter} from '../utilComponent/AppDateAdpater';
import {ErrorStateMatcher} from '@angular/material/core';

export class SearchFormStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class PatientsComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<IBundle_Entry>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService, @Inject(LOCALE_ID) private locale: string) {
    }

    notAllowedKeys = ['meta', 'text', 'resourceType', 'identifier'];
    footer: any;
    birthDateSearch: any;
    searchForm = new FormGroup({
        nameSearch: new FormControl(
            null, [
                Validators.pattern(/^[a-zA-Z]*$/)
            ]
        ),
        birthDateSearch: new FormControl(
            null,
        )
    });
    matcher = new SearchFormStateMatcher();
    timer: any = {};
    searchLoading = false;
    lastUpdatedDate: Date;

    ngOnInit(): void {
        this.searchLoading = true;
        this.apiService.getPatientsBetween1960To1965().pipe(
            map((it) => it.entry as IBundle_Entry[]),
        ).subscribe(
            data => {
                this.dataSource.data = data as IBundle_Entry[];
                if (data?.length > 0) {
                    const patients = {id: '', name: '', telecom: '', gender: '', birthDate: '', address: ''};
                    const columnsHeader = Object.keys(patients).filter((key) => !this.notAllowedKeys.includes(key));
                    this.displayedColumns = columnsHeader;
                    this.lastUpdatedDate = new Date();
                    this.searchLoading = false;
                    // console.log(data);
                    // console.log(Object.keys(patient).filter((key) => !this.notAllowedKeys.includes(key)));
                } else {
                    console.log('patient table - No data to load');
                }
            }
        );
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        const sortState: Sort = {active: 'birthDate', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'name':
                    return (item.resource as IPatient).name[0].given.reduce((ac, pv) => ac + pv);
                case 'birthDate':
                    return (item.resource as IPatient).birthDate;
                default:
                    return item[property];
            }
        };

        this.dataSource.filterPredicate = (data, filter: string) => {
            const accumulator = (currentTerm, key) => {
                return key === 'name' ? currentTerm + (data.resource as IPatient).name : currentTerm + data[key];
            };
            const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
        };
        this.dataSource.sort = this.sort;
    }

    onSearchInput($event: any) {
        const searchTarget = $event.target.value;
        this.dataSource.filter = searchTarget.trim().toLowerCase();
    }

    submit() {

        if (!this.searchForm.valid) {
            return;
        }

        clearTimeout(this.timer);
        this.searchLoading = true;
        this.timer = setTimeout(() => {
            const searchBy: SearchParameters = {
                name: this.searchForm.value.nameSearch,
                birthdate: this.searchForm.value.birthDateSearch ?
                    formatDate(this.searchForm.value.birthDateSearch, 'yyyy-MM-dd', this.locale)
                    : null
            };

            console.log(JSON.stringify(searchBy));

            if (searchBy.name || searchBy.birthdate) {
                this.apiService.searchPatients(searchBy)
                    .pipe(map((it) => it.entry as IBundle_Entry[]))
                    .subscribe(data => {
                        console.log(data);
                        if (data) {
                            this.dataSource.data = data as IBundle_Entry[];
                        } else {
                            this.dataSource.data = [];
                        }
                        this.searchLoading = false;
                    });
            } else {
                this.apiService.getPatientsBetween1960To1965()
                    .pipe(map((it) => it.entry as IBundle_Entry[]))
                    .subscribe(data => {
                        this.dataSource.data = data as IBundle_Entry[];
                        this.lastUpdatedDate = new Date();
                        this.searchLoading = false;
                    });
            }
        }, 500);

    }
}
