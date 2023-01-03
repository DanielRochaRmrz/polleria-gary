import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  ticketRegister(ticket: any) {
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

}
