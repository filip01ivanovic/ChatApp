import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ServerResponse } from '../models/serverResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // sending a post request for user login
  login(username: string, password: string) {
    const data={
      username: username,
      password: password
    }
    return this.http.post<ServerResponse>("http://localhost:3000/login", data)
  }

  // sending a post request for user register
  register(username: string, password: string) {
    const data={
      username: username,
      password: password
    }
    return this.http.post<ServerResponse>("http://localhost:3000/register", data)
  }
}
