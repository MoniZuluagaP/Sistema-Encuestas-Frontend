import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Encuesta } from '../../models/encuesta';
import { CommonModule } from '@angular/common';
import { RespuestaAbiertaComponent } from "./componentes/respuesta-abierta/respuesta-abierta.component";
import { Pregunta } from '../../models/pregunta';
import { Respuesta } from '../../models/respuesta';
import { RespuestaOpcionSimpleComponent } from './componentes/respuesta-opcion-simple/respuesta-opcion-simple.component';
import { RespuestaOpcionMultipleComponent } from './componentes/respuesta-opcion-multiple/respuesta-opcion-multiple.component';

@Component({
  selector: 'app-responder-encuesta',
  imports: [CommonModule, RespuestaAbiertaComponent, RespuestaOpcionSimpleComponent, RespuestaOpcionMultipleComponent],
  templateUrl: './responder-encuesta.component.html',
  styleUrl: './responder-encuesta.component.css'
})
export class ResponderEncuestaComponent implements OnInit {
  codigo: string;
  encuesta?: Encuesta;
  preguntas?: Pregunta[]
  respuesta?: Respuesta;

  encuestaIniciada = false;
  preguntaActivaIndex = 0

  get preguntaActiva() {
    return this.preguntas ? this.preguntas[this.preguntaActivaIndex]: null
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.codigo = this.route.snapshot.paramMap.get('codigo')!;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.encuesta = await firstValueFrom(this.http.get(`http://localhost:3000/encuesta/${this.codigo}`)) as Encuesta;
      this.preguntas = this.encuesta?.preguntas?.sort((a, b) => a.numero > b.numero ? 1 : -1);

      console.log('Repuesta del backed:', { encuesta: this.encuesta })
    } catch (error) {
      console.error('Error al traer la encuesta', error)
    }
  }

  async comenzarEncuesta() {
    try {
      this.respuesta = await firstValueFrom(this.http.post(`http://localhost:3000/respuestas`, { codigoEncuesta: this.codigo })) as Respuesta;
      this.encuestaIniciada = true;
    } catch (error) {
      console.error('Error al crear el registro de respuestas', error)
    }
  }

  siguientePregunta() {
    this.preguntaActivaIndex++;
  }

  anteriorPregunta() {
    this.preguntaActivaIndex--;
  }
}
