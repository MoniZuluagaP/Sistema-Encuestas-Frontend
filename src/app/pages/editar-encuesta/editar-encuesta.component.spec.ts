import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEncuestaComponent } from './editar-encuesta.component';

describe('EditarEncuestaComponent', () => {
  let component: EditarEncuestaComponent;
  let fixture: ComponentFixture<EditarEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
