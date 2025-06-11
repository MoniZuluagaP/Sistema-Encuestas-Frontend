import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Pregunta } from "../../../../models/pregunta";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { RespuestaOpcionSimple } from "../../../../models/respuesta";

@Component({
  selector: 'app-respuesta-opcion-simple',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './respuesta-opcion-simple.component.html'
})
export class RespuestaOpcionSimpleComponent implements OnChanges {
  @Input() respuestaId!: number;
  @Input() pregunta!: Pregunta;
  @Input() preguntaIndex!: number;
  @Output() anteriorPregunta = new EventEmitter<any>();
  @Output() siguientePregunta = new EventEmitter<any>();

  respuestaForm: FormGroup;
  respuestaGuardada?: RespuestaOpcionSimple

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.respuestaForm = this.fb.group({
      opcionId: [null, Validators.required]
    });
  }

  async ngOnChanges(): Promise<void> {
    try {
      this.respuestaGuardada = await firstValueFrom(
        this.http.get(`http://localhost:3000/respuestas-opcion-simple/${this.respuestaId}/${this.pregunta.id}`)
      ) as RespuestaOpcionSimple;

      if (this.respuestaGuardada) {
        this.respuestaForm.setValue({
          opcionId: this.respuestaGuardada.opcionId
        })

        this.respuestaForm.disable()
      }
    } catch (error) {
      console.error('Error trayendo la respuesta guardada', error)
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
      const opcionId = this.respuestaForm.value.opcionId;

      try {
        if (!this.respuestaGuardada) {
          const res = await firstValueFrom(this.http.post(`http://localhost:3000/respuestas-opcion-simple`, {
            opcionId,
            respuestaId: this.respuestaId,
            preguntaId: this.pregunta.id
          }))

          console.log('RESPUESTAAA', res)
        }
        
        this.respuestaForm.reset();
        this.siguientePregunta.emit();
      } catch (error) {
        console.error('Error al crear la respuesta de opcion simple', error);
      }
    }
  }
}