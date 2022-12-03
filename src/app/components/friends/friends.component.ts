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
    public friends: Friend[] = [];
    public searchValue: string = "";
    public searchList: string[] = [];

    public constructor(private router: Router, private service: BackendService, private interval: IntervalService) {
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

        //this.interval.setInterval("test", () => this.services());
    }

    public services() {
        this.service.loadFriends()
            .subscribe((res: Array<Friend>) => {
                console.log(res);
            })
    }

    public searchFriend() {
        let friends: string[] = [];

        this.service.listUsers()
            .subscribe((res: Array<string>) => {
                friends = res;
                console.log(friends);
                this.searchList = friends.filter(friend => {
                    if(this.searchValue.length > 0) {
                        if(friend.includes(this.searchValue)) {
                            console.log(friend);
                            return friend;
                        }
                    }
                })
                console.log(this.searchList);
        })

    }

    
         /*   // add click handler on each entry for auto complete
            list.childNodes.forEach(child => {
                child.addEventListener("click", () => {
                    input.value = child.innerHTML
                    list.style.display = "none";
                    list.innerHTML = "";
                    input.className = 'input';
                }) 
            })
        } */


    public ngOnInit(): void {
    }
}
