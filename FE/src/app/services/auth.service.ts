import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userNameSubject = new BehaviorSubject<string | null>(this.userName);
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());
  private isAdminSubject = new BehaviorSubject<boolean>(this.checkAdmin());

  public userName$ = this.userNameSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public isAdmin$ = this.isAdminSubject.asObservable();

  http = inject(HttpClient);

  private checkToken(): boolean {
    return !!localStorage.getItem("token");
  }

  private checkAdmin(): boolean {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).isAdmin : false;
  }

  login(email: string, password: string) {
    return this.http.post(environment.apiUrl + "/auth/login", { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        this.updateAllStates();
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.updateAllStates();
  }

  private updateAllStates() {
    this.userNameSubject.next(this.userName);
    this.isLoggedInSubject.next(this.checkToken());
    this.isAdminSubject.next(this.checkAdmin());
  }

  get isLoggedIn() {
    return this.checkToken();
  }

  get isAdmin() {
    return this.checkAdmin();
  }

  get userName() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).name : null;
  }
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(environment.apiUrl + "/auth/register", {
      name, email, password
    });
  }
  

}