import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarratopComponent } from './barratop.component';

describe('BarratopComponent', () => {
  let component: BarratopComponent;
  let fixture: ComponentFixture<BarratopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarratopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarratopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
