import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe} from '@angular/common'

@Component({
  selector: 'app-customer-profile',
  imports: [AsyncPipe],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent {
  authService = inject(AuthService)
}
