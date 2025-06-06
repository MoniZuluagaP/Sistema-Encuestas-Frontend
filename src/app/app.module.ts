import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CrearEncuestaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'crear-encuesta', component: CrearEncuestaComponent }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
