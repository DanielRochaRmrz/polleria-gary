import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AuthResponse, AuthUser, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string) {
    const url = `${this.baseUrl}/login`;
    const body = { usuario, password };
    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.status) {
          localStorage.setItem('token', resp.auth_token!);
          this._usuario = {
            status: resp.status!,
            usuario: resp.usuario!,
          };
        }
      }),
      map((resp) => resp.status),
      catchError((err) => of(err.error.message))
    );
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/valid-token`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Usuario>(url, { headers }).pipe(
      map((resp) => {
        this._usuario = {
          status: resp.status!,
          usuario: resp.usuario!,
        };

        return resp.status;
      }),
      catchError((err) => of(false))
    );
  }
}
