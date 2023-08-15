import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRespuestasComponent } from './info-respuestas.component';

describe('InfoRespuestasComponent', () => {
  let component: InfoRespuestasComponent;
  let fixture: ComponentFixture<InfoRespuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoRespuestasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
