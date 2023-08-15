import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManejoPreguntasComponent } from './manejo-preguntas.component';

describe('ManejoPreguntasComponent', () => {
  let component: ManejoPreguntasComponent;
  let fixture: ComponentFixture<ManejoPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManejoPreguntasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManejoPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
