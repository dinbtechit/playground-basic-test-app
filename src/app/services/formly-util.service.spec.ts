import { TestBed } from '@angular/core/testing';

import { FormlyUtilService } from './formly-util.service';

describe('FormlyUtilService', () => {
  let service: FormlyUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormlyUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
