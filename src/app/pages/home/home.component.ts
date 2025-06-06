import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>Bienvenido a Encuestalandia</h2>
    <p>Tu sistema de encuestas anónimas.</p>
    <a routerLink="/crear-encuesta" class="boton">Crear una nueva encuesta</a>
  `
})
export class HomeComponent {}
