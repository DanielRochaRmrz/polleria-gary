import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Boxes, GetBox } from '../interfaces/boxes.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getBoxes(): Observable<Boxes> {
    const url = `${this.baseUrl}/boxes`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Boxes>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  boxRegister(product: any) {
    const url = `${this.baseUrl}/box-register`;
    const body = product;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post<any>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  getBox(id_box: number): Observable<GetBox> {
    const url = `${this.baseUrl}/box-show/${id_box}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<GetBox>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  updateBox(box: any, id_box: number): Observable<GetBox> {
    const url = `${this.baseUrl}/box-update/${id_box}`;
    const body = box;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.put<GetBox>(url, body, { headers }).pipe(
      map((resp) => {
        console.log(resp);

        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  deleteBox(id_box: number) {
    const url = `${this.baseUrl}/box-delete/${id_box}`;
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
