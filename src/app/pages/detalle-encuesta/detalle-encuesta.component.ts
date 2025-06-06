import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-encuesta.component.html',
  styleUrls: ['./detalle-encuesta.component.css']
})
export class DetalleEncuestaComponent {
  @Input() encuesta?: {
    nombre: string;
    fecha_vencimiento: string;
    email: string;
    codigo_unico: string;
  };

  @Input() error?: string;
}
