import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharecuestionarioComponent } from './sharecuestionario.component';

describe('SharecuestionarioComponent', () => {
  let component: SharecuestionarioComponent;
  let fixture: ComponentFixture<SharecuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharecuestionarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharecuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
