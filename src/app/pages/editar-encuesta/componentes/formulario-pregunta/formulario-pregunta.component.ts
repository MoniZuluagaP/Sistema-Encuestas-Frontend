import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TipoRespuesta } from '../../../../utils/const';
import { Pregunta } from '../../../../models/pregunta';
import { FormularioOpcionesComponent } from '../formulario-opciones/formulario-opciones.component';
import { firstValueFrom } from 'rxjs';
import { Opcion } from '../../../../models/opcion';

@Component({
  selector: 'app-formulario-pregunta',
  imports: [CommonModule, ReactiveFormsModule, FormularioOpcionesComponent],
  templateUrl: './formulario-pregunta.component.html',
})
export class FormularioPreguntaComponent implements AfterViewInit {
  @Input() encuestaId!: number;
  @Input() pregunta?: Pregunta;
  @Output() preguntaCreada = new EventEmitter<any>();
  @Output() cancelarModificar = new EventEmitter<any>();

  public preguntaForm: FormGroup;
  public opcionesForm: FormGroup;
  public tipos = Object.entries(TipoRespuesta).map(([key, value]) => ({ label: key, value }));;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.preguntaForm = this.fb.group({
      numero: [this.pregunta?.numero || null, Validators.required],
      texto: [this.pregunta?.texto || null, Validators.required],
      tipo: [this.pregunta?.tipo || null, [Validators.required]]
    });

    this.opcionesForm = this.fb.group({
      opciones: this.fb.array([]),
    });
  }

  ngAfterViewInit(): void {
    this.preguntaForm.setValue({
      numero: this.pregunta?.numero,
      texto: this.pregunta?.texto,
      tipo: this.pregunta?.tipo,
    })

    this.pregunta?.opciones?.forEach(opcion => {
      (this.opcionesForm.get('opciones') as FormArray).push(this.fb.control(opcion.texto, Validators.required));
    })
  }

  async actualizarPregunta() {
    if (this.preguntaForm.valid) {
      const datos = this.preguntaForm.value;

      console.log('Enviando datos al backend:', datos);  // Log antes de enviar

      const tieneOpciones = datos.tipo === TipoRespuesta.OPCION_MULTIPLE || datos.tipo === TipoRespuesta.OPCION_SIMPLE;
      let opciones;

      if (tieneOpciones) {
        opciones = this.opcionesForm.value.opciones as Opcion[];

        if (this.opcionesForm.invalid || opciones.length <= 0) {
          console.warn('Formulario de opciones inválido');
          return;
        }
      }

      if (this.pregunta) {
        try {
          const preguntaActualizada = await firstValueFrom(this.http.patch(`http://localhost:3000/preguntas/${this.pregunta.id}`, datos)) as any;
          console.log('Respuesta del backend:', preguntaActualizada);  // Log respuesta exitosa
          
          if (tieneOpciones && opciones) {
            const opcionesActuales = this.pregunta.opciones?.length || 0;
            const opcionesNuevas = opciones.slice(opcionesActuales, opciones.length);
            let numeroOpcion = opcionesActuales + 1
            this.pregunta.opciones = this.pregunta.opciones ?? [];

            for (const opcion of opcionesNuevas) {
              const opcionNueva = await firstValueFrom(this.http.post('http://localhost:3000/opcion', {
                texto: opcion,
                numero: numeroOpcion,
                preguntaId: this.pregunta.id,
              })) as Pregunta;

              this.pregunta.opciones.push(opcionNueva)
              numeroOpcion++;
            }
          }
          
          this.preguntaCreada.emit({...this.pregunta, ...preguntaActualizada.data}); // Emite al padre
          this.preguntaForm.reset(); // Limpia formulario
          
          this.opcionesForm = this.fb.group({
            opciones: this.fb.array([]),
          });
        } catch (error) {
          console.error('Error al actualizar pregunta:', error);  // Log error
        }
      }
    } else {
      console.warn('Formulario inválido');
    }
  }

  async crearPregunta() {
    if (this.preguntaForm.valid) {
      const datos = this.preguntaForm.value;

      console.log('Enviando datos al backend:', datos);  // Log antes de enviar

      const tieneOpciones = datos.tipo === TipoRespuesta.OPCION_MULTIPLE || datos.tipo === TipoRespuesta.OPCION_SIMPLE;
      let opciones;

      if (tieneOpciones) {
        opciones = this.opcionesForm.value.opciones as Opcion[];

        if (this.opcionesForm.invalid || opciones.length <= 0) {
          console.warn('Formulario de opciones inválido');
          return;
        }
      }

      try {
        const preguntaNueva = await firstValueFrom(this.http.post('http://localhost:3000/preguntas', {
          ...datos,
          encuestaId: this.encuestaId
        })) as Pregunta;

        console.log('Respuesta del backend:', preguntaNueva);  // Log respuesta exitosa

        if (tieneOpciones && opciones) {
          let numeroOpcion = 1
          preguntaNueva.opciones = [];

          for (const opcion of opciones) {
            const opcionNueva = await firstValueFrom(this.http.post('http://localhost:3000/opcion', {
              texto: opcion,
              numero: numeroOpcion,
              preguntaId: preguntaNueva.id,
            })) as Pregunta;

            preguntaNueva.opciones.push(opcionNueva)
            numeroOpcion++;
          }
        }

        this.preguntaCreada.emit(preguntaNueva); // Emite al padre
        this.preguntaForm.reset(); // Limpia formulario
        
        this.opcionesForm = this.fb.group({
          opciones: this.fb.array([]),
        });

      } catch (error) {
        console.error('Error al crear pregunta:', error);  // Log error
      }
    } else {
      console.warn('Formulario inválido');
    }
  }

  cancelar() {
    this.cancelarModificar.emit()
  }
}
