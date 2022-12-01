import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['../../../assets/css/components.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  public login(): void {
    this.changeRoute('/login');      
  }

  public changeRoute(route: string): void {
    this.router.navigate([route])
}

}
