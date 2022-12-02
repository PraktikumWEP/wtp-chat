import { Component, OnInit, Renderer2 } from '@angular/core';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { IntervalService } from 'src/app/services/interval.service';
import { BackendService } from 'src/app/services/backend.service';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { RendererFactory2, Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['../../../assets/css/components.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {

    public messages: Array<Message> = [];
    public otherUser: string = ''; // GET PASSED FROM FRIENDS
    public input: string = '';

    // DIV für Nachrichten (s. Template) als Kind-Element für Aufrufe (s. scrollToBottom()) nutzen
    @ViewChild('messagesDiv') private myScrollContainer: ElementRef;

     public constructor(private settings: SettingsService, private renderer: Renderer2, private router: Router, private interval: IntervalService, private service: BackendService) { 
        this.myScrollContainer = new ElementRef(null);
    }

    public ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    // scroll chat div to bottom
    private scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { 
        }                 
    }

    public ngOnInit(): void {
        this.scrollToBottom();
        this.interval.setInterval("chat", () => {
            this.service.listMessages(this.otherUser).subscribe((data: Message[]) => { 
                this.messages = data;
             });
            this.show(this.messages);
            this.scrollToBottom();
        });
    }

    // send button
    public send(): void {
        this.service.sendMessage(this.otherUser, this.input);
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
            this.service.removeFriend(this.otherUser);
        }
    }

    // helper for routing
    public changeRoute(route: string): void {
        this.router.navigate([route])
    }

    // display chat history
    public show(messages: Array<Message>): void {
        this.clearMessages();
        messages.forEach( message => {
            this.createMessageElement(message.msg, message.from, message.time);
        })
    }

    // display one chat message
    public createMessageElement(msg: string, from: string, time: number): void {
        // time to string
        let t = new Date(time);
        let timestring = t.toLocaleTimeString("de-DE");

        // check inline attribute
        if (this.settings.getInline()) {
            this.createMessageElementInline(msg, from, timestring);
        }
        else {
            this.createMessageElementDualline(msg, from, timestring);
        }
    }

    // render chat message in one line
    public createMessageElementInline(msg: string, from: string, time: string): void {

        // render outer div
        const chat_message = this.renderer.createElement('div');
        this.renderer.setProperty(chat_message, 'class', 'chat-message mElement');
        this.renderer.appendChild(document.getElementById('chat'), chat_message);

        // render helper div
        const chat_helper_div = this.renderer.createElement('div');
        this.renderer.setProperty(chat_helper_div, 'class', 'chat-helper-div');
        this.renderer.appendChild(chat_message, chat_helper_div);

        // render username
        const chat_message_user = this.renderer.createElement('span');
        this.renderer.setProperty(chat_message_user, 'class', 'chat-message-user');
        this.renderer.appendChild(chat_helper_div, chat_message_user);
        this.renderer.setValue(chat_message_user, from + ":&nbsp");

        // render message text
        const chat_message_text = this.renderer.createElement('span');
        this.renderer.setProperty(chat_message_text, 'class', 'chat-message-text');
        this.renderer.appendChild(chat_helper_div, chat_message_text);
        this.renderer.setValue(chat_message_text, msg);

        // render timestamp
        const time_div = this.renderer.createElement('div');
        this.renderer.setProperty(time_div, 'class', 'time chat-helper-div');
        this.renderer.appendChild(chat_message, time_div);
        this.renderer.setValue(time_div, time);
    }

    // render chat message in two lines
    public createMessageElementDualline(msg: string, from: string, time: string): void {
         // render outer div
         const chat_message = this.renderer.createElement('div');
         this.renderer.setProperty(chat_message, 'class', 'chat-message mElement');
         this.renderer.appendChild(document.getElementById('chat'), chat_message);
 
         // render helper div
         const chat_helper_div = this.renderer.createElement('div');
         this.renderer.setProperty(chat_helper_div, 'class', 'chat-helper-div-column');
         this.renderer.appendChild(chat_message, chat_helper_div);
 
         // render username
         const chat_message_user = this.renderer.createElement('span');
         this.renderer.setProperty(chat_message_user, 'class', 'chat-message-user');
         this.renderer.appendChild(chat_helper_div, chat_message_user);
         this.renderer.setValue(chat_message_user, from + ":&nbsp");
 
         // render message text
         const chat_message_text = this.renderer.createElement('span');
         this.renderer.setProperty(chat_message_text, 'class', 'chat-message-text');
         this.renderer.appendChild(chat_helper_div, chat_message_text);
         this.renderer.setValue(chat_message_text, "&nbsp" + msg);
 
         // render timestamp
         const time_div = this.renderer.createElement('div');
         this.renderer.setProperty(time_div, 'class', 'time chat-helper-div');
         this.renderer.appendChild(chat_message, time_div);
         this.renderer.setValue(time_div, time);
    }

    // clear chat history
    public clearMessages(): void {
        this.removeChilds(document.getElementById('chat'));
    }

    // remove all child nodes from parent HTMLElement
    public removeChilds(parent: HTMLElement | null): void {
        if (parent !== null) {
            while(parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        }
    }
}
