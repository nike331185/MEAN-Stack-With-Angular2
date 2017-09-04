import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message: String;
  messageClass: String;
  processing: boolean = false;
  emailValid: boolean;
  emailMessage: String;
  usernameValid: boolean;
  usernameMessage: String;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {   //建立表格
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username:   ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password:   ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm:  ['',Validators.required],
    },{ validator: this.matchingPasswords('password','confirm')})
  }
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      console.log("1")
      return null; // Return as valid email
    } else {
      console.log("2")
      return { 'validateUsername': true } // Return as invalid email
    }
  }
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }
  matchingPasswords(password, confirm) {
    return function(group: FormGroup){
      console.log("group.controls",group.controls);
      if(group.controls[password].value === group.controls[confirm].value) {
        return null;
      }
      else {
        return { 'matchingPasswords': true } 
      }
    }
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  onRegisterSubmit() {
    this.processing = true;  //當案提交後禁止提交
    this.disableForm();
    //console.log(this.form.get('email').value); 取得表單的值
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    }
    this.authService.registerUser(user).subscribe(data => {
      // Resposne from registration attempt 
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() =>{
          this.router.navigate(['/login']);
        }, 2000);

      }
      console.log(" data.message",data); // Set a success message
    });
  }

  checkEmail() {
    const email = this.form.get('email').value;
    this.authService.checkEmail(email).subscribe(data => {
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername() {
    const username = this.form.get('username').value;
    this.authService.checkUsername(username).subscribe(data => {
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }
}
