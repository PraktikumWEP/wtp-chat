import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class ProfileComponent implements OnInit {

    otherUser: string = this.context.currentChatUsername;
    description: string = '';
    coffeeOrTea: string = '';
    name = '';

    public constructor(private service: BackendService, private router: Router, private context: ContextService) { 
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

