import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'crear', component: CrearEncuestaComponent }
];
