import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyrespondedComponent } from './alreadyresponded.component';

describe('AlreadyrespondedComponent', () => {
  let component: AlreadyrespondedComponent;
  let fixture: ComponentFixture<AlreadyrespondedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyrespondedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyrespondedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
