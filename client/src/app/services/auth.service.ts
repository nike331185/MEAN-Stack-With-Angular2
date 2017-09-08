import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authtoken: any;
  user:any;
  options :any;
  domain = "http://localhost:8000/"
  constructor(
    private http: Http
  ) { }

  createAuthenticationHeaders() {   //建立header
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authtoken
      })
    });
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authtoken = token;
  }

  // Function to register user accounts
  registerUser(user) {    //帳號註冊
    return this.http.post(this.domain + 'authentication/register', user).map(res =>{     
      return res.json()});
  }

  checkUsername(username) {   //驗證帳號是否存在
    return this.http.get(this.domain + 'authentication/checkUsername/'+username).map(res =>{
      return res.json()});
  }

  checkEmail(email) {   //驗證信箱是否存在
    return this.http.get(this.domain + 'authentication/checkEmail/'+email).map(res =>{
      return res.json()});
  }

  login(user) {    //前端登入
    return this.http.post(this.domain + 'authentication/login',user).map(res =>{
      return res.json()});
  }


  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authtoken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res =>{
      return res.json()});
  }

  logout() {
    this.authtoken = null;
    this.user = null;
    localStorage.clear();
  }

  
  
  loggedIn() {
    return tokenNotExpired();
  }

}
