import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Products, GetProduct, Product, GetProducts } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  productRegister(product: any) {
    const url = `${this.baseUrl}/product-register`;
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

  getProducts(): Observable<Products> {
    const url = `${this.baseUrl}/products`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Products>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  getProduct(id_product: number | undefined): Observable<GetProduct> {
    const url = `${this.baseUrl}/product-show/${id_product}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<GetProduct>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  getProductByProvider(id_provider: number): Observable<GetProducts> {
    const url = `${this.baseUrl}/product-provider/${id_provider}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<GetProducts>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  getProductBarcode(barcode: string): Observable<GetProduct> {
    const url = `${this.baseUrl}/product-show-barcode/${barcode}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<GetProduct>(url, { headers }).pipe(
      map((resp) => {
        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  updateProduct(product: any, id_product: number): Observable<GetProduct> {
    console.log('product -->', product);

    const url = `${this.baseUrl}/product-update/${id_product}`;
    const body = product;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.put<GetProduct>(url, body, { headers }).pipe(
      map((resp) => {
        console.log(resp);

        return resp
      }),
      catchError(err => of(err.error))
    );
  }

  deleteProduct(id_product: number) {
    const url = `${this.baseUrl}/product-delete/${id_product}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.delete<any>(url, { headers }).pipe(
      map(resp => resp),
      catchError(err => of(err.error))
    )
  }

  search(termino: string): Observable<Product[]> {
    const url = `${this.baseUrl}/search-product/${termino}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    return this.http.get<Product[]>(url, { headers }).pipe(
      map((resp) => {
        console.log(resp);
        return resp
      }),
      catchError(err => {
        console.log(err);
        return of(err.error);
      })
    );
  }

}
