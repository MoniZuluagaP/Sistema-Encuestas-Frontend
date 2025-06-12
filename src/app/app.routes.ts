import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta.component';
import { EditarEncuestaComponent } from './pages/editar-encuesta/editar-encuesta.component';
import { ResponderEncuestaComponent } from './pages/responder-encuesta/responder-encuesta.component';
import { VerResultadosComponent } from './pages/ver-resultados/ver-resultados.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'crear', component: CrearEncuestaComponent },
  { path: 'encuesta/:codigo/editar', component: EditarEncuestaComponent },
  { path: 'responder/:codigo', component: ResponderEncuestaComponent },
  { path: 'resultados/:codigo', component: VerResultadosComponent },
];
