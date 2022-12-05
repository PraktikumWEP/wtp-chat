import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/Profile';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class SettingsComponent implements OnInit {
    firstName: string = '';
    lastName: string = '';
    coffeeOrTea: string = 'Neither';
    description: string = '';
    inlineString: string = '';
    inline: boolean = true;
    user: any = new Object();

    public constructor(private service: BackendService, private router: Router) {
        this.service.loadCurrentUser()
            .subscribe((res) => {
                if(res != null) {
                    this.user = res;
                    this.firstName = this.user.firstName;
                    this.lastName = this.user.lastName;
                    this.coffeeOrTea = this.user.coffeeOrTea;
                    this.description = this.user.description;
                    this.inline = (this.user.layout  === 'inline') ? true : false;
                }
            })
    }

    public ngOnInit(): void {
    }

    public saveSettings(): void {
        let inlineString: string = this.inline ? 'inline' : 'dualline';
        let profile = new Profile(this.firstName, this.lastName, this.coffeeOrTea, this.description, inlineString); 
        this.service.saveCurrentUserProfile(profile)
            .subscribe((res: boolean) => {
                if(res) {
                    console.log("profile saved");
                    this.friends();
                }
            })
    }

    public friends(): void {
        this.changeRoute('/friends');
    }

    // helper for routing
    private changeRoute(route: string): void {
        this.router.navigate([route])
    }

    // setters
    public setInline(b: boolean): void {
        this.inline = b;
    }
}


