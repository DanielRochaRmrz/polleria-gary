import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetUsuario, User } from 'src/app/usuarios/interfaces/users.interfaces';

import { environment } from 'src/environments/environment';

@Pipe({
  name: 'getUser'
})
export class GetUserPipe implements PipeTransform {

  public user!: User;
  private baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) {}

  async transform(id_user: number) {

    const url = `${this.baseUrl}/user-show/${id_user}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );

    let data = await this.http.get<GetUsuario>(url, { headers }).toPromise();


    return data?.usuario.usuario;
  }

}
