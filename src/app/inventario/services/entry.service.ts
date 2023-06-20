import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BoxOrProduct } from '../interfaces/entry.interface';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  ticketRegister(ticket: any) {
    console.log(ticket);

    const url = `${this.baseUrl}/ticket-register`;
    const body = ticket;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post<any>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => (err.error))
    )
  }

  getBoxOrProduct(barcode: string): Observable<BoxOrProduct> {
    const url = `${this.baseUrl}/product-show-barcode/${barcode}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<BoxOrProduct>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  ticketPrint() {
    const url = `${this.baseUrl}/ticket-print`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<BoxOrProduct>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

}
