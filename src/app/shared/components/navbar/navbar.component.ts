import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @Input() namePage: string = '';
    active: string = 'active';

    get usuario() {
      return this.authService.usuario;
    }




  constructor( private router: Router, private authService: AuthService ) { }

  ngOnInit(): void {
  }

  home() {
    this.router.navigateByUrl('/home');
  }

  users() {
    this.router.navigateByUrl('/users/users');
  }

  providers() {
    this.router.navigateByUrl('/users/providers');
  }

  products() {
    this.router.navigateByUrl('/inventory/products');
  }

  boxes() {
    this.router.navigateByUrl('/inventory/boxes');
  }

  entry() {
    this.router.navigateByUrl('/inventory/entry');
  }

  output() {
    this.router.navigateByUrl('/inventory/output');
  }

  tickets() {
    this.router.navigateByUrl('/inventory/tickets');
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }

}
