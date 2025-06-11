import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Pregunta } from "../../../../models/pregunta";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { RespuestaAbierta } from "../../../../models/respuesta";

@Component({
  selector: 'app-respuesta-abierta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './respuesta-abierta.component.html'
})
export class RespuestaAbiertaComponent implements OnChanges {
  @Input() respuestaId!: number;
  @Input() pregunta!: Pregunta;
  @Input() preguntaIndex!: number;
  @Output() anteriorPregunta = new EventEmitter<any>();
  @Output() siguientePregunta = new EventEmitter<any>();

  respuestaForm: FormGroup;
  respuestaGuardada?: RespuestaAbierta

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.respuestaForm = this.fb.group({
      texto: [null, Validators.required]
    });
  }

  async ngOnChanges(): Promise<void> {
    try {
      this.respuestaGuardada = await firstValueFrom(
        this.http.get(`http://localhost:3000/respuestas-abiertas/${this.respuestaId}/${this.pregunta.id}`)
      ) as RespuestaAbierta;

      if (this.respuestaGuardada) {
        this.respuestaForm.setValue({
          texto: this.respuestaGuardada.texto
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
      const texto = this.respuestaForm.value.texto;

      try {
        if (!this.respuestaGuardada) {
          await firstValueFrom(this.http.post(`http://localhost:3000/respuestas-abiertas`, {
            texto,
            respuestaId: this.respuestaId,
            preguntaId: this.pregunta.id
          }))
        }
        
        this.respuestaForm.reset();
        this.siguientePregunta.emit();
      } catch (error) {
        console.error('Error al crear la respuesta abierta', error);
      }
    }
  }
}