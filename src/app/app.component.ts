import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header>
      <h1>Encuestalandia</h1>
      <nav>
        <a routerLink="/" class="boton">Inicio</a>
        <a routerLink="/crear" class="boton">Crear Encuesta</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
