import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormthemComponent } from './formthem.component';

describe('FormthemComponent', () => {
  let component: FormthemComponent;
  let fixture: ComponentFixture<FormthemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormthemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormthemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
