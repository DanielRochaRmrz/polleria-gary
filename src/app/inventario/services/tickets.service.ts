import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { TicketDetails, Tickets } from '../interfaces/tickets.interface';

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

  getTicket(ticket_id: number): Observable<TicketDetails> {
    const url = `${this.baseUrl}/ticket-show/${ticket_id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<TicketDetails>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  printTicket(data: any) {
    const url = `${this.baseUrl}/ticket-print`;
    const body = data;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post<any>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(err => (err.error))
    )
  }

  deleteTicket(id_ticket: number) {
    const url = `${this.baseUrl}/ticket-delete/${id_ticket}`;
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
