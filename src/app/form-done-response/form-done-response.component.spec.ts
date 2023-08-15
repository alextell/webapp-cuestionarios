import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDoneResponseComponent } from './form-done-response.component';

describe('FormDoneResponseComponent', () => {
  let component: FormDoneResponseComponent;
  let fixture: ComponentFixture<FormDoneResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDoneResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDoneResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
