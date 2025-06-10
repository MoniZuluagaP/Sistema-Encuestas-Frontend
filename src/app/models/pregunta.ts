import { TipoRespuesta } from "../utils/const";
import { Opcion } from "./opcion";

export interface Pregunta {
  id?: number;
  numero: number;
  texto: string;
  tipo: TipoRespuesta;
  encuestaId: number;
  opciones?: Opcion[]
}
