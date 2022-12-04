import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Profile } from 'src/app/models/Profile';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class ProfileComponent implements OnInit {

    public otherUser: string = this.context.currentChatUsername;
    public user: any = new Object();

    public constructor(private service: BackendService, private router: Router, private context: ContextService) { 
        this.service.loadUser(this.otherUser)
            .subscribe((res) => {
                if(res != null) {
                    this.user = res; // ERROR TypeError: ctx.user.description is undefined
                }
            })
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

