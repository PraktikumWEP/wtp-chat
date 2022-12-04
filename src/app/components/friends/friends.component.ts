import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/Friend';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';
import { IntervalService } from 'src/app/services/interval.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class FriendsComponent implements OnInit {
    public user: User = new User();
    public friends: Friend[] = [];
    public friendReqs: Friend[] = [];
    public searchValue: string = "";
    public searchList: string[] = [];
    public friendError: string = "";
    public unread: Map<string, number> = new Map();

    public constructor(private router: Router, private service: BackendService, private interval: IntervalService, private context: ContextService) {
        this.service.loadCurrentUser()
            .subscribe((res: User | null) => {
                if(res != null) {
                    this.user = res;
                }
                else {
                    this.changeRoute("/");
                }
            })

        this.interval.setInterval("friends", () => this.services());
    }

    public ngOnInit(): void {
    }

    public switchChat(route: string, friend: string): void {
        this.context.currentChatUsername = friend;
        this.changeRoute(route);
    }
    
    public changeRoute(route: string, ): void {
        this.interval.clearIntervals();
        this.router.navigate([route]);
    }

    public services(): void {
        this.service.loadFriends()
            .subscribe((res: Array<Friend>) => {
                let reqList: Friend[] = [];
                let acpList: Friend[] = [];

                res.forEach((friend: Friend) => {
                    if(friend.status == "requested") {
                        reqList.push(friend);
                    }
                    if(friend.status == "accepted") {
                        acpList.push(friend);
                    }
                }); 

                this.friendReqs = reqList;
                this.friends = acpList;
            })

        this.service.unreadMessageCounts()
            .subscribe((res: Map<string, number>) => {
                this.unread = res;
            })
    }

    public getUnreadCountOf(friend: string): number {
        let res: number | undefined = this.unread.get(friend);
        return (typeof res === 'number') ? res : 0;
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
                if(res) {
                    console.log("friend request send");
                }
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
