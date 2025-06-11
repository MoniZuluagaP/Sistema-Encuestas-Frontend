import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Pregunta } from '../../../../models/pregunta';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RespuestaOpcionMultiple } from '../../../../models/respuesta';

@Component({
  selector: 'app-respuesta-opcion-multiple',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './respuesta-opcion-multiple.component.html',
})
export class RespuestaOpcionMultipleComponent implements OnChanges, OnInit {
  @Input() respuestaId!: number;
  @Input() pregunta!: Pregunta;
  @Input() preguntaIndex!: number;
  @Output() anteriorPregunta = new EventEmitter<any>();
  @Output() siguientePregunta = new EventEmitter<any>();

  respuestaForm: FormGroup;
  respuestaGuardada?: RespuestaOpcionMultiple;

  get opcionFormArray() {
    return this.respuestaForm.get('opcionIds') as FormArray<FormControl>;
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    console.log('PREGUNTAAAA', this.pregunta);
    this.respuestaForm = this.fb.group({});
  }

  ngOnInit(): void {
    console.log('PREGUNTAAAA2', this.pregunta);
    this.respuestaForm = this.fb.group({
      opcionIds: this.fb.array(this.pregunta.opciones!.map(() => false)),
    });
  }

  async ngOnChanges(): Promise<void> {
    try {
      this.respuestaGuardada = (await firstValueFrom(
        this.http.get(
          `http://localhost:3000/respuestas-opcion-multiple/${this.respuestaId}/${this.pregunta.id}`
        )
      )) as RespuestaOpcionMultiple;
      if (this.respuestaGuardada) {
        this.respuestaGuardada.opcionIds.forEach((id) => {
          const index = this.pregunta.opciones!.findIndex(
            (opcion) => opcion.id === id
          );

          (this.respuestaForm.get('opcionIds') as FormArray)
            .at(index)
            .setValue(true);
        });
        this.respuestaForm.disable();
      }
    } catch (error) {
      console.error('Error trayendo la respuesta guardada', error);
    }
  }

  clickEnAnteriorPregunta() {
    this.anteriorPregunta.emit();
  }

  async guardarRespuesta() {
    if (this.respuestaForm.disabled) {
      this.respuestaForm.reset();
      this.respuestaForm.enable();
      this.siguientePregunta.emit();
    }

    if (this.respuestaForm.valid) {
      const opcionIds = this.respuestaForm.value.opcionIds
        .map((checked: boolean, i: number) =>
          checked ? this.pregunta.opciones![i].id : null
        )
        .filter((v: number | null) => v !== null);

      try {
        if (!this.respuestaGuardada) {
          await firstValueFrom(
            this.http.post(`http://localhost:3000/respuestas-opcion-multiple`, {
              opcionIds,
              respuestaId: this.respuestaId,
              preguntaId: this.pregunta.id,
            })
          );
        }

        this.respuestaForm.reset();
        this.siguientePregunta.emit();
      } catch (error) {
        console.error('Error al crear la respuesta de opcion multiple', error);
      }
    }
  }
}
