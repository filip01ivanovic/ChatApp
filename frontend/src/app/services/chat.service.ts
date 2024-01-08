import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // establishing a connection to the websocket server
    this.socket = io('http://localhost:3000');
  }

  // sends a new message to the websocket server
  sendMessage(message: { username: string; text: string, timestamp: Date }) {
    // console.log("Service: ", message.text);
    this.socket.emit('message', message);
  }

  // retrieves messages from the websocket server when a new user logs in
  getMessages(): Observable<Message[]> {
    return new Observable((observer) => {
      this.socket.emit('getMessages');
      const messagesObservable = fromEvent<Message[]>(this.socket, 'messages');
      messagesObservable.subscribe((messages) => {
        observer.next(messages);
      });
    });
  }

  // listens for the incoming messages from the websocket server
  listenForMessages(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }
}
