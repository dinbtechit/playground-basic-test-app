import { PatientDetailsPipe } from './patient-details.pipe';

describe('PatientDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new PatientDetailsPipe();
    expect(pipe).toBeTruthy();
  });
});
