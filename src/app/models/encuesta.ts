export interface Encuesta {
  nombre: string; // este campo es "titulo" en el front, pero "nombre" en el back
  preguntas: Pregunta[];
}

export interface Pregunta {
  texto: string;
  tipo: 'text' | 'multiple' | 'boolean';
  descripcion?: string;
  requerido?: boolean;
}
