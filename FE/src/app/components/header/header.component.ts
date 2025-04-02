import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    FormsModule,
    CommonModule 
   ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit { 
  customerService = inject(CustomerService);
  authService = inject(AuthService);
  router = inject(Router); 

  categoryList: Category[] = [];
  searchTerm: string = ''; 

  private categorySubscription: Subscription | undefined; 

  ngOnInit() {
    this.getCategories();
  }


  getCategories() {
    this.categorySubscription = this.customerService.getCategories().subscribe((result) => {
      this.categoryList = result;
    });
  }

  onSearch(): void { 
    const trimmedSearchTerm = this.searchTerm.trim(); 
    console.log(`Header onSearch triggered. Term: '${trimmedSearchTerm}'`);

    if (trimmedSearchTerm) {
      this.router.navigate(['/products'], { 
        queryParams: { search: trimmedSearchTerm } 
      });
    } else {
      this.router.navigate(['/products']);
    }
    // this.searchTerm = '';
  }

  searchCategory(id: string) {
    this.searchTerm = ""; 
    this.router.navigate(['/products'], { queryParams: { categoryId: id } });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}