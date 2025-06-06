import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-encuesta.component.html',
  styleUrls: ['./crear-encuesta.component.css']
})
export class CrearEncuestaComponent {
  encuestaForm: FormGroup;
  resultado: any = null;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  crearEncuesta() {
    if (this.encuestaForm.valid) {
      const datos = this.encuestaForm.value;

      console.log('Enviando datos al backend:', datos);  // Log antes de enviar

      this.http.post('http://localhost:3000/encuesta', datos).subscribe({
        next: (res: any) => {
          console.log('Respuesta del backend:', res);  // Log respuesta exitosa
          this.resultado = res;
          this.mensaje = '✅ Encuesta creada exitosamente.';
        },
        error: (err) => {
          console.error('Error al enviar la encuesta:', err);  // Log error
          this.mensaje = '❌ Error al enviar la encuesta.';
        }
      });
    } else {
      console.warn('Formulario inválido');
      this.mensaje = '⚠️ Por favor, complete todos los campos correctamente.';
    }
  }
}
