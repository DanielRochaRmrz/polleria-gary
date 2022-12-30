import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarcodeUpdateValidatorService implements AsyncValidator {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const id_producto = localStorage.getItem('id_producto');
    const barcode = control.value;
    const url = `${this.baseUrl}/barcode-valid-update/${barcode}/${id_producto}`;
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
