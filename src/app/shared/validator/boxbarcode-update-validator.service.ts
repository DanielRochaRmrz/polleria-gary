import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxbarcodeUpdateValidatorService implements AsyncValidator {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const id_box = localStorage.getItem('id_box');
    const boxBarcode = control.value;
    const url = `${this.baseUrl}/boxbarcode-valid-update/${boxBarcode}/${id_box}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<any>(url, { headers }).pipe(
      delay(1000),
      map((resp) => {
        return resp.status === false ? null : { barcodeRegistrado: true };
      })
    );
  }

}
