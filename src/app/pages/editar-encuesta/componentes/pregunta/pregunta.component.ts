import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pregunta } from '../../../../models/pregunta';
import { FormularioPreguntaComponent } from '../formulario-pregunta/formulario-pregunta.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pregunta',
  imports: [CommonModule, FormularioPreguntaComponent],
  templateUrl: './pregunta.component.html',
  styleUrl: './pregunta.component.css'
})
export class PreguntaComponent {
  @Input() pregunta!: Pregunta;
  @Output() preguntaActualizada  = new EventEmitter<Pregunta>();
  @Output() preguntaEliminada  = new EventEmitter<Pregunta>();

  editarPregunta = false

  constructor(private http: HttpClient) {
  }
  
  actualizarPregunta(pregunta: Pregunta) {
    this.pregunta = pregunta;
    this.editarPregunta = false;
    this.preguntaActualizada.emit(pregunta)
  }
  
  clickEnEditar() {
    this.editarPregunta = true;
  }

  cancelarModificar() {
    this.editarPregunta = false;
  }

  async clickEliminar() {
    await firstValueFrom(this.http.delete(`http://localhost:3000/preguntas/${this.pregunta.id}`))
    this.preguntaEliminada.emit(this.pregunta);
  }
}
