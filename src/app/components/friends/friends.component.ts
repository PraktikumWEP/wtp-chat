import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/Friend';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { IntervalService } from 'src/app/services/interval.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class FriendsComponent implements OnInit {
    public user: User = new User();
    public friends: string[] = [];
    public friendReqs: string[] = [];
    public searchValue: string = "";
    public searchList: string[] = [];
    public friendError: string = "";

    public constructor(private router: Router, private service: BackendService, private interval: IntervalService) {
        this.service.loadCurrentUser()
            .subscribe((res: User | null) => {
                if(res != null) {
                    this.user = res;
                    console.log(this.user);
                }
                else {
                    this.changeRoute("/");
                }
            })

        this.interval.setInterval("friends", () => this.services());
    }

    public ngOnInit(): void {
    }
    
    public changeRoute(route: string): void {
        this.interval.clearIntervals();
        this.router.navigate([route]);
    }

    public services(): void {
        this.service.loadFriends()
            .subscribe((res: Array<Friend>) => {
                let nameList: string[] = [];
                let reqList: string[] = [];

                res.forEach((friend: Friend) => {
                    nameList.push(friend.username);
                    if(friend.status == "requested") {
                        reqList.push(friend.username);
                    }
                }); 

                this.friends = nameList;
                this.friendReqs = reqList;
                console.log(res);
            })

        this.service.unreadMessageCounts()
            .subscribe((res: Map<string, number>) => {
                console.log(res);
            })
    }

    public searchFriend(): void {
        let friends: string[] = [];

        this.service.listUsers()
            .subscribe((res: Array<string>) => {
                friends = res;
                this.searchList = friends.filter((friend: string): any => {
                    if(this.searchValue.length > 0) {
                        if(friend.includes(this.searchValue)) {
                            if(!friend.includes(this.user.username)) {
                                return friend;
                            }
                        }
                    }
                })
        })
    }

    public autoComplete(friend: string): void {
        this.searchValue = friend;
    }

    public addFriend(): void {
        this.service.friendRequest(this.searchValue)
            .subscribe((res: boolean) => {
                console.log("add friend send" + res);
            })
    }

    public acceptFriend(username: string): void {
        this.service.acceptFriendRequest(username)
            .subscribe()
    }

    public dismissFriend(username: string): void {
        this.service.dismissFriendRequest(username)
            .subscribe()
    }
}
