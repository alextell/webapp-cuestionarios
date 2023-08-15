import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarpreguntasComponent } from './agregarpreguntas.component';

describe('AgregarpreguntasComponent', () => {
  let component: AgregarpreguntasComponent;
  let fixture: ComponentFixture<AgregarpreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarpreguntasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarpreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
