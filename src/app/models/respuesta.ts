import { Encuesta } from "./encuesta";

export interface Respuesta {
  id: number;
  encuesta: Encuesta;
}

export interface RespuestaAbierta {
  id: number;
  texto: string;
}

export interface RespuestaOpcionSimple {
  id: number;
  opcionId: number;
}

export interface RespuestaOpcionMultiple {
  id: number;
  opcionIds: number[];
}