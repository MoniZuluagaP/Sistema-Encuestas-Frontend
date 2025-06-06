import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Encuesta {
  id?: number;
  nombre: string;
  fecha_vencimiento: string;
  email: string;
  codigo_unico?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  private apiUrl = 'http://localhost:3000/encuesta';

  constructor(private http: HttpClient) {}

  crearEncuesta(encuesta: Encuesta): Observable<Encuesta> {
    return this.http.post<Encuesta>(this.apiUrl, encuesta);
  }

  obtenerEncuestaPorCodigo(codigo_unico: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.apiUrl}/${codigo_unico}`);
  }
}
