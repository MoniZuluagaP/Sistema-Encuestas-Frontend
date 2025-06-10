import { Pregunta } from "./pregunta";

export interface Encuesta {
  id?: number;
  nombre: string; // este campo es "titulo" en el front, pero "nombre" en el back
  codigo_respuesta: string; // este campo es "titulo" en el front, pero "nombre" en el back
  codigo_resultados: string; // este campo es "titulo" en el front, pero "nombre" en el back
  fecha_vencimiento: Date;
  preguntas: Pregunta[];
  activa: boolean;
}
