import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

// Rutas pricipales
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localeEsMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
