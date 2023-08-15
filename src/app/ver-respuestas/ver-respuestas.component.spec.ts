import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRespuestasComponent } from './ver-respuestas.component';

describe('VerRespuestasComponent', () => {
  let component: VerRespuestasComponent;
  let fixture: ComponentFixture<VerRespuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerRespuestasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
