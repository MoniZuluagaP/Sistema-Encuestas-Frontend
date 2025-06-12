import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Respuesta } from '../../models/respuesta';
import { Encuesta } from '../../models/encuesta';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ver-resultados',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ver-resultados.component.html',
  styleUrl: './ver-resultados.component.css',
})
export class VerResultadosComponent implements OnInit {
  encuesta?: Encuesta;
  codigo: string;
  vencimientoForm: FormGroup;

  encuestaConRespuestas = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.codigo = this.route.snapshot.paramMap.get('codigo')!;

    this.vencimientoForm = this.fb.group({
      fecha_vencimiento: ['', Validators.required],
    });
  }

  async ngOnInit() {
    try {
      this.encuesta = (await firstValueFrom(
        this.http.get(`http://localhost:3000/encuesta/${this.codigo}`)
      )) as Encuesta;

      this.encuestaConRespuestas =  this.encuesta.preguntas.some(pregunta => pregunta.respuestas && pregunta.respuestas.length > 0);

      const fecha = new Date(this.encuesta?.fecha_vencimiento);
      const fechaFormateada = fecha.toISOString().split('T')[0];

      this.vencimientoForm.setValue({
        fecha_vencimiento: fechaFormateada
      })
    } catch (error) {
      console.error('Error al traer la encuesta:', error);
    }
  }

  async activarODesactivarEncuesta() {
    try {
      if (!this.encuesta) {
        return;
      }
      const nuevoEstado = !this.encuesta?.activa;
      const respuesta = (await firstValueFrom(
        this.http.patch(
          `http://localhost:3000/encuesta/${this.codigo}/actualizar-estado`,
          { nuevoEstado }
        )
      )) as Encuesta;

      this.encuesta.activa = respuesta.activa;
    } catch (error) {
      console.error('Error al cambiar el estado de la encuesta', error)
    }
  }

  async cambiarFechaDeVencimiento() {
    if (this.vencimientoForm.invalid) {
      console.error('Fecha de vencimiento inválida')
      return;
    }

    const fecha = this.vencimientoForm.value.fecha_vencimiento;

    try {
        if (!this.encuesta) {
          return;
        }
        const respuesta = (await firstValueFrom(
          this.http.patch(
            `http://localhost:3000/encuesta/${this.codigo}/fecha-vencimiento`,
            { fecha }
          )
        )) as Encuesta;

        this.encuesta.fecha_vencimiento = respuesta.fecha_vencimiento;

      } catch (error) {
        console.error('Error al cambiar el estado de la encuesta', error)
      }
  }
  
  async exportarResultados() {
    try {
      const res = await firstValueFrom(this.http.get(`http://localhost:3000/encuesta/exportar/pdf/${this.codigo}`, { responseType: 'blob' }));
      console.log('PDF', res)
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.encuesta?.nombre}-resultados.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al intentar exportar los resultados', error)
    }
  }

  async exportarEstadisticas() {
    try {
      const res = await firstValueFrom(this.http.get(`http://localhost:3000/encuesta/resumen-estadistico-pdf/${this.codigo}`, { responseType: 'blob' }));
      console.log('PDF', res)
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `"${this.encuesta?.nombre}"-estadisticas.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al intentar exportar los resultados', error)
    }
  }
}
