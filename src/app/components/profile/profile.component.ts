import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class ProfileComponent implements OnInit {

    otherUser: string = '';
    description: string = '';
    coffeeOrTea: string = '';
    name = '';

    public constructor(private service: BackendService, private router: Router) { 
    }

    public ngOnInit(): void {
    }

    // remove friend breadcrumb
    public removeFriend(): void {
        console.log("remove");
        if(confirm("Do you really want to remove " + this.otherUser + " from your friendlist")) {
            this.service.removeFriend(this.otherUser);
        }
    }

    public chat(): void {
        this.changeRoute('/chat');
    }

    // helper for routing
    private changeRoute(route: string): void {
        this.router.navigate([route]);
    }
}

