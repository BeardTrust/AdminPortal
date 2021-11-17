import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "@services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  async onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    try{
      let response = await this.authService.login(email, password)
        .subscribe((response: any) => {
          const token = response.headers.get('Authorization');
          const userId = response.headers.get('BTUID');
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          this.authService.setLoginStatus(true);
          this.router.navigate(['/']);
        },
          (error) => {
          console.log("error");
          this.authService.isLoggedIn = false;
          });
    } catch(e) {
      console.log(e);
    }
  }
}
