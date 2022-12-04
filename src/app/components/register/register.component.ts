import { Component, OnInit} from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../../../assets/css/components.css'],
})

export class RegisterComponent implements OnInit {
    public username: string = '';
    public password1: string = '';
    public password2: string = '';

    public userError: string = "";
    public passError1: string = "";
    public passError2: string = "";

    public usernameOk: boolean = false;
    public password1Ok: boolean = false;
    public password2Ok: boolean = false;

    public constructor(private router: Router, private service: BackendService) { 
    }

    public ngOnInit(): void {
    }

    public checkUsername() {
        const minUsernameLength = 3;

        if(this.username.length < minUsernameLength) {
            this.userError = "Username must be at least " + minUsernameLength + " characters";
            this.usernameOk = false;
        }
        else {
            this.service.userExists(this.username)
            .subscribe((res: boolean) => {
                if(res == true) {
                    this.userError = "Username " + this.username + " is already taken";
                    this.usernameOk = false;
                }
                else {
                    this.userError = "";
                    this.usernameOk = true;
                }
            })
        }
    }

    public checkPassword1() {
        const minPasswordLength = 8;
        this.checkPassword2();

        if(this.password1.length < minPasswordLength) {
            this.passError1 = "Password must be at least " + minPasswordLength + " characters";
            this.password1Ok = false;
        }
        else {
            this.passError1 = "";
            this.password1Ok = true;
        }
    }

    public checkPassword2() {
        const minPasswordLength = 8;

        if(this.password1.length < minPasswordLength) {
            this.passError2 = "";
            this.password2Ok = false;
        }
        else if(this.password1 !== this.password2) {
            this.passError2 = "Passwords do not match";
            this.password2Ok = false;
        }
        else {
            this.passError2 = "";
            this.password2Ok = true;
        }
    }

    public changeRoute(route: string): void {
        this.router.navigate([route])
    }

    public register() {
        if (this.password1Ok && this.password2Ok && this.usernameOk) {
            this.service.register(this.username, this.password1)
            .subscribe((res: boolean) => {
                if(res == true) {
                    this.changeRoute('/friends');
                }
                else {
                    console.error("couldnt register");
                }
            })
        }
    }
}