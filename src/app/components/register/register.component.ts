import { Component, OnInit} from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

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

    public constructor(private service: BackendService) { 
    }

    public ngOnInit(): void {
    }

    public checkUsername() {
        const minUsernameLength = 3;

        if(this.username.length < minUsernameLength) {
            this.userError = "Username must be at least " + minUsernameLength + " characters";
            //setErrorFor(username, message);
        }
        else {
            this.service.userExists(this.username)
            .subscribe((res: boolean) => {
                if(res == true) {
                    this.userError = "Username " + this.username + " is already taken";
                    //setErrorFor(username, message);
                }
                else {
                    this.userError = "";
                    this.usernameOk = true;
                }
            })
            //this.userError = "";
            //setSuccessFor(username);
        }
    }

    public checkPassword1() {
        const minPasswordLength = 8;

        if(this.password1.length < minPasswordLength) {
            this.passError1 = "Password must be at least " + minPasswordLength + " characters";
            //setErrorFor(password1, message);
        }
        else {
            this.passError1 = "";
            //setSuccessFor(password1);
            this.password1Ok = true;
        }
    }

    public checkPassword2() {
        const minPasswordLength = 8;

        if(this.password1.length < minPasswordLength) {
            this.passError2 = "";
            //setErrorFor(password2, message);
        }
        else if(this.password1 !== this.password2) {
            this.passError2 = "Passwords do not match";
            //setErrorFor(password2, message);
        }
        else {
            this.passError2 = "";
            //setSuccessFor(password2);
            this.password2Ok = true;
        }
    }

    public register() {
        console.log("we can click the button once there are no errors");
        // call service
    }
}