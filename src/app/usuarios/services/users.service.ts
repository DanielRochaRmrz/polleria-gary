import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Usuarios, GetUsuario } from '../interfaces/users.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  userRegister(user: any) {
    const url = `${this.baseUrl}/user-register`;
    const body = user;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post<any>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  userUpdate(user: any, id_user: number): Observable<GetUsuario>  {
    const url = `${this.baseUrl}/user-update/${id_user}`;
    const body = user;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.put<GetUsuario>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  getUsers(): Observable<Usuarios> {
    const url = `${this.baseUrl}/users`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ); 

    return this.http.get<Usuarios>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  getUser(id_user: number): Observable<GetUsuario> {
    const url = `${this.baseUrl}/user-show/${id_user}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ); 

    return this.http.get<GetUsuario>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  userDelete(id_user: number) {
    const url = `${this.baseUrl}/user-delete/${id_user}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.delete<any>(url, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }
}
