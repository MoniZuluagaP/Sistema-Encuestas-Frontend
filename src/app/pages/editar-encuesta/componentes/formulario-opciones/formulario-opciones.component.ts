import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Opcion } from '../../../../models/opcion';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-formulario-opciones',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './formulario-opciones.component.html',
})
export class FormularioOpcionesComponent {
  @Input() opcionesForm!: FormGroup
  @Input() opcionesActuales?: Opcion[];

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  get opciones(): FormArray {
    return this.opcionesForm.get('opciones') as FormArray;
  }

  agregarOpcion() {
    this.opciones.push(this.fb.control('', Validators.required));
  }

  async actualizarOpcion(index: number) {
    const opcionForm = this.opciones.at(index);
    if (opcionForm.valid && this.opcionesActuales) {
      const opcion = opcionForm.value;
      const opcionActual = this.opcionesActuales[index];
      try {
        await firstValueFrom(this.http.patch(`http://localhost:3000/opcion/${this.opcionesActuales[index].id}`, { texto: opcion }))
        this.opcionesActuales[index] = { ...opcionActual, texto: opcion }
      } catch (error) {
        console.error('Error al eliminar opcion:', error);  // Log error
      }
    }
  }

  async eliminarOpcion(index: number) {
    this.opciones.removeAt(index);

    if(this.opcionesActuales) {
      try {
        await firstValueFrom(this.http.delete(`http://localhost:3000/opcion/${this.opcionesActuales[index].id}`))
        this.opcionesActuales.splice(index, 1)
      } catch (error) {
        console.error('Error al eliminar opcion:', error);  // Log error
      }
    }
  }
}