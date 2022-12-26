import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Providers, Provider, GetProvider } from '../interfaces/providers.interface';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  providerRegister(provider: any) {
    const url = `${this.baseUrl}/provider-register`;
    const body = provider;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post<any>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  getProviders(): Observable<Providers> {
    const url = `${this.baseUrl}/providers`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Providers>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  getProvider(id_provider: number): Observable<GetProvider> {
    const url = `${this.baseUrl}/provider-show/${id_provider}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<GetProvider>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  providerUpdate(provider: any, id_provider: number): Observable<GetProvider>  {
    const url = `${this.baseUrl}/provider-update/${id_provider}`;
    const body = provider;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.put<GetProvider>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  providerDelete(id_provider: number) {
    const url = `${this.baseUrl}/provider-delete/${id_provider}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.delete<any>(url, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  search(termino: string): Observable<Provider[]> {
    const url = `${this.baseUrl}/search/${termino}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Provider[]>(url, { headers }).pipe(
      map((resp) => {
        console.log(resp);
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

}
