import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ServerResponse } from '../models/serverResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private router: Router){}

  username: string = ""
  password: string = ""
  loggedInUsername: string = ""

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('loggedInUsername');

    // check if user is already logged in
    if (storedUsername && this.isValidUsername(storedUsername)) {
      this.loggedInUsername = storedUsername;
      console.log('Logged in as:', this.loggedInUsername)
      this.router.navigate(['chat'])
    }
  }

  // helper function for checking the username
  private isValidUsername(username: string): boolean {
    return username.length > 0;
  }

  login() {
    this.userService.login(this.username, this.password).subscribe(
      (response: ServerResponse) => {
        console.log(response);
        if (response.status == true) { // successful login
          localStorage.setItem("loggedInUsername", response.username)
          this.router.navigate(['chat'])
        }
        else ( // unsuccesful login
          alert(response.text)
        )
      },
      (error) => { // error
        console.error("Error during login: ", error);
        alert("An unexpected error occurred. Please try again later.")
      }
    );
  }

  // navigate to register page
  goToRegister() {
    this.router.navigate(['register'])
  }
}
