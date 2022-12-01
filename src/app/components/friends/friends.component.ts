import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/Friend';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class FriendsComponent implements OnInit {
    public user: User = new User();
    public freinds: Friend[] = [];

    public constructor(private router: Router, private service: BackendService) {
        this.service.loadCurrentUser()
        .subscribe((res: User | null) => {
            if(res != null) {
                this.user = res;
                console.log(this.user);
            }
            else {
                //this.router.navigate(["/"]);
            }
        })

    this.service.loadFriends()
        .subscribe((res: Array<Friend>) => {
            console.log(res);
        })
    }

    public ngOnInit(): void {
    }
}
