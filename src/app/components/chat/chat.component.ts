import { Component, OnInit, Renderer2 } from '@angular/core';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { IntervalService } from 'src/app/services/interval.service';
import { BackendService } from 'src/app/services/backend.service';
import { Message } from 'src/app/models/Message';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services/context.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['../../../assets/css/components.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {

    public messages: Array<Message> = [];
    public messagesOldCount: number = 0;
    public otherUser: string = this.context.currentChatUsername;
    public input: string = '';
    public inline: boolean = true;
    public user: any = new Object();

    // DIV für Nachrichten (s. Template) als Kind-Element für Aufrufe (s. scrollToBottom()) nutzen
    @ViewChild('messagesDiv') private myScrollContainer: ElementRef;

     public constructor( private context: ContextService, private renderer: Renderer2, private router: Router, private interval: IntervalService, private service: BackendService) { 
        this.myScrollContainer = new ElementRef(null);
        this.interval.setInterval("chat", () => {
            this.service.listMessages(this.otherUser).subscribe((data: Message[]) => { 
                this.messagesOldCount = this.messages.length;
                this.messages = data;
            });
            this.show();
            this.scrollToBottom();
        });
        this.service.loadCurrentUser()
            .subscribe((res) => {
                if(res != null) {
                    this.user = res;
                    this.inline = (this.user.layout === 'inline') ? true : false;
                }
            })
    }

    public ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    // scroll chat div to bottom
    private scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) {}                 
    }

    public ngOnInit(): void {
        this.scrollToBottom();
    }

    // send button
    public send(): void {
        this.service.sendMessage(this.otherUser, this.input)
            .subscribe(
                // do nothing
            )
        this.input = '';
    }

    // back breadcrumb
    public friends(): void {
        this.changeRoute('/friends');
    }

    // profile breadcrumb
    public profile(): void {
        this.changeRoute('/profile');
    }

    // remove friend breadcrumb
    public removeFriend(): void {
        if(confirm("Do you really want to remove " + this.otherUser + " from your friendlist")) {
            this.service.removeFriend(this.otherUser)
                .subscribe((res: boolean) => {
                    if(res) {
                        this.changeRoute("/friends");
                    }
                })
        }
    }

    // helper for routing
    public changeRoute(route: string): void {
        this.interval.clearIntervals();
        this.router.navigate([route]);
    }

    // display chat history
    public show(): void {
        if(this.messages.length !== this.messagesOldCount) {
            this.clearMessages();
            this.messages.forEach( message => {
                this.createMessageElement(message.msg, message.from, message.time);
            })
        }
    }

    // display one chat message
    public createMessageElement(msg: string, from: string, time: number): void {
        // time to string
        let t = new Date(time);
        let timestring = t.toLocaleTimeString("de-DE");

        /* structure:
        <div class='chat-message'>
            <div class='chat-helper-div'> <!--or chat-helper-div-column-->
                <div class='chat-message-user'></div>
                <div class='chat-message-text'></div>
            </div>
            <div class='time chat-helper-div'></div>
        </div>
        */

        // render outer div
        const chat_message = this.renderer.createElement('div');
        this.renderer.addClass(chat_message, 'chat-message');
        this.renderer.addClass(chat_message, 'mElement');
        this.renderer.appendChild(document.getElementsByClassName('chat')[0], chat_message);

        // render helper div
        const chat_helper_div = this.renderer.createElement('div');
        this.renderer.appendChild(chat_message, chat_helper_div);

        // render username
        const chat_message_user = this.renderer.createElement('span');
        this.renderer.addClass(chat_message_user, 'chat-message-user');
        this.renderer.appendChild(chat_helper_div, chat_message_user);
        chat_message_user.innerHTML = from + ":&nbsp";

        // render message text
        const chat_message_text = this.renderer.createElement('span');
        this.renderer.addClass(chat_message_text, 'chat-message-text');
        this.renderer.appendChild(chat_helper_div, chat_message_text);
        
        // render timestamp
        const time_div = this.renderer.createElement('div');
        this.renderer.addClass(time_div, 'time');
        this.renderer.addClass(time_div, 'chat-helper-div');
        this.renderer.appendChild(chat_message, time_div);
        time_div.innerHTML = timestring;

        // conditional inline
        if (this.inline) {
            this.renderer.addClass(chat_helper_div, 'chat-helper-div');
            chat_message_text.innerHTML = msg;
        }
        else {
            this.renderer.addClass(chat_helper_div, 'chat-helper-div-column');
            chat_message_text.innerHTML = "&nbsp" + msg;
        }
    }

    // clear chat history
    public clearMessages(): void {
        this.removeChilds(document.getElementsByClassName('chat')[0]);
    }

    // remove all child nodes from parent HTMLElement
    public removeChilds(parent: Element | null): void {
        if (parent !== null) {
            while(parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        }
    }
}
