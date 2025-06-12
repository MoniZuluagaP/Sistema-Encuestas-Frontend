import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormularioPreguntaComponent } from './componentes/formulario-pregunta/formulario-pregunta.component';
import { Pregunta } from '../../models/pregunta';
import { PreguntaComponent } from './componentes/pregunta/pregunta.component';
import { CommonModule } from '@angular/common';
import { Encuesta } from '../../models/encuesta';

@Component({
  selector: 'app-editar-encuesta',
  imports: [CommonModule, PreguntaComponent, FormularioPreguntaComponent, ReactiveFormsModule],
  templateUrl: './editar-encuesta.component.html',
  styleUrl: './editar-encuesta.component.css'
})
export class EditarEncuestaComponent implements OnInit {
  encuesta?: Encuesta;
  preguntas: Pregunta[] = []
  encuestaForm: FormGroup;
  codigo: string;
  editarEncuesta = false

  encuestaConRespuestas = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.codigo = this.route.snapshot.paramMap.get('codigo')!;

    this.encuestaForm = this.fb.group({
      nombre: [this.encuesta?.nombre, Validators.required],
      fecha_vencimiento: [this.encuesta?.fecha_vencimiento, Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.encuesta = (await firstValueFrom(this.http.get(`http://localhost:3000/encuesta/${this.codigo}`))) as Encuesta

      this.encuestaConRespuestas =  this.encuesta.preguntas.some(pregunta => pregunta.respuestas && pregunta.respuestas.length > 0);

      if (this.encuestaConRespuestas) {
        return;
      }

      this.preguntas = this.encuesta.preguntas.sort((a, b) => a.numero > b.numero ? 1 : -1);

      const fecha = new Date(this.encuesta?.fecha_vencimiento);
      const fechaFormateada = fecha.toISOString().split('T')[0];

      this.encuestaForm.setValue({
        nombre: this.encuesta?.nombre,
        fecha_vencimiento: fechaFormateada
      })

    } catch (error) {
      console.log('ERROR', error)
    }
  }

  async actualizarEncuesta() {
    if (this.encuestaForm.valid) {
      const datos = this.encuestaForm.value;

      console.log('Enviando datos al backend:', datos);  // Log antes de enviar

      try {
        const encuestaNueva = await firstValueFrom(this.http.patch(`http://localhost:3000/encuesta/${this.encuesta?.id}`, datos)) as any;
        this.encuesta = { ...this.encuesta, ...(encuestaNueva.data as Encuesta) };
        this.editarEncuesta = false;
      } catch (error) {
        console.error('Error al actualizar la encuesta:', error);  // Log error
      }
    } else {
      console.warn('Formulario inválido');
    }
  }

  async activarDesactivarEncuesta() {
    try {
      const encuestaNueva = await firstValueFrom(this.http.patch(`http://localhost:3000/encuesta/${this.encuesta?.id}`, {
        activa: !this.encuesta?.activa
      })) as any;
      
      this.encuesta = { ...this.encuesta, ...(encuestaNueva.data as Encuesta) };
    } catch (error) {
      console.error('Error al activar/desactivar la encuesta:', error);  // Log error
    }
  }

  clickEnEditar() {
    this.editarEncuesta = true;
  }

  agregarPregunta(pregunta: Pregunta) {
    this.preguntas.push(pregunta);
    this.preguntas = this.preguntas.sort((a, b) => a.numero > b.numero ? 1 : -1);
  }

  actualizarPregunta(pregunta: Pregunta) {
    const index = this.preguntas.findIndex(p => p.id === pregunta.id);
    this.preguntas[index] = pregunta;
    this.preguntas = this.preguntas.sort((a, b) => a.numero > b.numero ? 1 : -1);
  }
  
  eliminarPregunta(pregunta: Pregunta) {
    const index = this.preguntas.findIndex(p => p.id === pregunta.id);
    this.preguntas.splice(index, 1)
  }
}
