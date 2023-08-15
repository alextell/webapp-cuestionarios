import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioFreeComponent } from './cuestionario-free.component';

describe('CuestionarioFreeComponent', () => {
  let component: CuestionarioFreeComponent;
  let fixture: ComponentFixture<CuestionarioFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuestionarioFreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuestionarioFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
