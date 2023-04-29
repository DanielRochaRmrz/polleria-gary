import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Tickets } from '../interfaces/tickets.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Tickets> {
    const url = `${this.baseUrl}/tickets`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Tickets>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

}
