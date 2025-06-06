import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderEncuestaComponent } from './responder-encuesta.component';

describe('ResponderEncuestaComponent', () => {
  let component: ResponderEncuestaComponent;
  let fixture: ComponentFixture<ResponderEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponderEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
