import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // --- Private Helper to get user data safely ---
  private getUserDataFromStorage(): { name: string | null, email: string | null, isAdmin: boolean } {
    // Check if localStorage is available (for SSR safety, though not strictly necessary based on current code)
    const userDataString = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    if (userDataString) {
      try {
        const parsedData = JSON.parse(userDataString);
        return {
          name: parsedData?.name ?? null,
          email: parsedData?.email ?? null,
          isAdmin: parsedData?.isAdmin ?? false
        };
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        // Clear potentially corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Also clear token if user data is bad
        return { name: null, email: null, isAdmin: false };
      }
    }
    return { name: null, email: null, isAdmin: false };
  }

  // --- Get initial state ---
  private initialUserData = this.getUserDataFromStorage();
  private initialTokenExists = typeof window !== 'undefined' ? !!localStorage.getItem("token") : false;

  // --- BehaviorSubjects ---
  private userNameSubject = new BehaviorSubject<string | null>(this.initialUserData.name);
  private userEmailSubject = new BehaviorSubject<string | null>(this.initialUserData.email); // <-- Added for email
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.initialTokenExists);
  private isAdminSubject = new BehaviorSubject<boolean>(this.initialUserData.isAdmin);

  // --- Public Observables ---
  public userName$ = this.userNameSubject.asObservable();
  public userEmail$ = this.userEmailSubject.asObservable(); // <-- Added public observable for email
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public isAdmin$ = this.isAdminSubject.asObservable();

  http = inject(HttpClient);

  // --- Login/Logout/Register Methods ---
  login(email: string, password: string) {
    return this.http.post<{ token: string, user: any }>(environment.apiUrl + "/auth/login", { email, password }).pipe(
      tap((response) => {
        if (response && response.token && response.user) {
            localStorage.setItem("token", response.token);
            // Ensure user data is stored as a string
            localStorage.setItem("user", JSON.stringify(response.user));
            this.updateAllStates(); // Update states after successful login
        } else {
            console.error("Invalid login response structure:", response);
            // Handle error appropriately, maybe throw an error or return an error observable
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.updateAllStates(); // Update states after logout
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(environment.apiUrl + "/auth/register", {
      name, email, password
    });
    // Note: Registration doesn't log the user in automatically here.
    // You might want to chain a login call or update states if registration implies login.
  }

  // --- State Update Method ---
  private updateAllStates() {
    const tokenExists = typeof window !== 'undefined' ? !!localStorage.getItem("token") : false;
    const userData = this.getUserDataFromStorage();

    // Check if the actual logged-in status based on token matches the user data presence
    const derivedIsLoggedIn = tokenExists && !!userData.email; // Example: Consider logged in if token AND email exist

    this.userNameSubject.next(userData.name);
    this.userEmailSubject.next(userData.email); // <-- Update email subject
    this.isLoggedInSubject.next(derivedIsLoggedIn); // Use derived status
    this.isAdminSubject.next(userData.isAdmin && derivedIsLoggedIn); // Admin only if also logged in

     // If token exists but user data is missing (e.g., after manual clear), log out.
    if (tokenExists && !userData.email) {
        console.warn("Token found but user data missing. Logging out.");
        this.logout();
    }
     // If user data exists but token is missing, clear user data.
    else if (!tokenExists && userData.email) {
        console.warn("User data found but token missing. Clearing user data.");
        localStorage.removeItem('user');
         // Re-run update with cleared data
        this.updateAllStates();
    }
  }

  // --- Getters (Optional - observables are preferred) ---
  // You might keep these for specific synchronous needs, but generally prefer the observables ($)
  /*
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue(); // Get current value from subject
  }

  get isAdmin(): boolean {
    return this.isAdminSubject.getValue(); // Get current value from subject
  }

  get userName(): string | null {
    return this.userNameSubject.getValue(); // Get current value from subject
  }

  get userEmail(): string | null {
     return this.userEmailSubject.getValue(); // Get current value from subject
  }
  */
}