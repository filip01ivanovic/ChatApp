import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ServerResponse } from '../models/serverResponse';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router){}

  username: string = ""
  password: string = ""

  register() {
    this.userService.register(this.username, this.password).subscribe(
      (response: ServerResponse) => {
        console.log(response);
        alert(response.text);
        if (response.status == true) { // succesful register
          this.username = ""
          this.password = ""
        }
      },
      (error) => { // error
        console.error("Error during registration: ", error);
        alert("An unexpected error occurred. Please try again later.")
      }
    );
  }
  
  // navigate to login page
  goToLogin() {
    this.router.navigate([''])
  }
}
