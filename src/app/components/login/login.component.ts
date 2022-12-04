import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class LoginComponent implements OnInit {
    public username: string = "";
    public password: string = "";
    public error: string = "";
    
    public constructor(private router: Router, private service: BackendService) { 
    }

    public ngOnInit(): void {
    }

    public changeRoute(route: string): void {
        this.router.navigate([route])
    }

    public login(): void {
        this.service.login(this.username, this.password)
            .subscribe((res: boolean) => {
                if(res) {
                    console.log("login successfull!");
                    this.changeRoute('/friends');
                }
                else {
                    console.log("login failed!");
                    this.error = "Authentication failed";
                }
            })
    }
}
