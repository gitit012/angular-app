import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, take, switchMap } from 'rxjs/operators';
import { of } from "rxjs";

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('--- AdminGuard Executing ---'); // Add logging

    // Use the isLoggedIn$ observable first
    return authService.isLoggedIn$.pipe(
        take(1), // Important: Take only the current value and complete
        switchMap(isLoggedIn => {
            console.log('AdminGuard: isLoggedIn =', isLoggedIn); // Log status
            if (isLoggedIn) {
                // If logged in, check isAdmin$
                return authService.isAdmin$.pipe(
                    take(1),
                    map(isAdmin => {
                        console.log('AdminGuard: isAdmin =', isAdmin); // Log status
                        if (isAdmin) {
                            console.log('AdminGuard: Access GRANTED');
                            return true; // Allow access if admin
                        } else {
                            console.warn('AdminGuard: Access DENIED (Not Admin)');
                            router.navigateByUrl('/'); // Redirect non-admins
                            return false; // Deny access
                        }
                    })
                );
            } else {
                // If not logged in
                console.warn('AdminGuard: Access DENIED (Not Logged In)');
                router.navigateByUrl('/login'); // Redirect to login
                return of(false); // Deny access (return Observable<false>)
            }
        })
    );
};