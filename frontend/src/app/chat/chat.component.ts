import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { Message } from '../models/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(private chatService: ChatService, private router: Router) { }

  loggedInUsername: string = ""
  text: string = ""
  timestamp: Date = new Date()
  messages: Message[] = []
  listeningForMessages: Subscription | undefined;
  gettingMessages: Subscription | undefined;

  ngOnInit() {
    // checking if the user is logged in
    const storedUsername = localStorage.getItem('loggedInUsername');
    if (!storedUsername || !this.isValidUsername(storedUsername)) {
      this.router.navigate([''])
    }
    else {
      this.loggedInUsername = storedUsername;
    }
    console.log('Logged in as:', this.loggedInUsername)

    // listening for the incoming messages
    this.listeningForMessages = this.chatService.listenForMessages().subscribe((data) => {
      this.messages.unshift(data);
      // var s = "";
      // for (const m of this.messages) {
      //   s += m.text + " ";
      // }
      // console.log(s);
    })

    // getting all messages
    this.gettingMessages = this.chatService.getMessages().subscribe((data) => {
      this.messages = data;
    });
  }

  // unsubscribing from the the observables
  ngOnDestroy() {
    if (this.listeningForMessages) {
      this.listeningForMessages.unsubscribe();
    }
    if (this.gettingMessages) {
      this.gettingMessages.unsubscribe();
    }
  }

  // helper function for checking the username
  private isValidUsername(username: string): boolean {
    return username.length > 0;
  }

  // sending new message
  sendMessage() {
    if (this.text.length > 0) {
      // console.log("Copmonent: ", this.text);
      this.timestamp = new Date();
      this.chatService.sendMessage({username: this.loggedInUsername, text: this.text, timestamp: this.timestamp});
      this.text = '';
    }
  }

  // logout and navigate to login page
  logOut() {
    localStorage.setItem('loggedInUsername', '');
    this.router.navigate(['']);
  }
}