import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
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
    duallineString: string = '';
    inline: boolean = true;

    public constructor(private service: BackendService, private router: Router) {
    }

    public ngOnInit(): void {
    }

    public saveSettings(): void {
        let inlineString: string = this.inline ? 'inline' : 'dualline';
        let profile = new Profile(this.firstName, this.lastName, this.coffeeOrTea, this.description, inlineString); 
        this.service.saveCurrentUserProfile(profile);
    }

    public friends(): void {
        this.changeRoute('/friends');
    }

    // helper for routing
    private changeRoute(route: string): void {
        this.router.navigate([route])
    }

    // setters
    public setInline(): void {
        this.inline = true;
    }

    public setDualLine(): void {
        this.inline = false;
    }
}


