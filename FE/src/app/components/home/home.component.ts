import { Component, inject, AfterViewInit } from '@angular/core'; // Added AfterViewInit
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit {
  customerService = inject(CustomerService);
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  private swiperInitialized = false;


  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe(result => {
      this.featuredProducts = result;
    });
    this.customerService.getNewProducts().subscribe(result => {
      this.newProducts = result;
    });
  }

  ngAfterViewInit() {
    this.initializeSwiperIfNeeded();
  }

  private initializeSwiperIfNeeded() {
    if (this.swiperInitialized || !this.featuredProducts.length || !this.newProducts.length) return;

    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      Object.assign(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: true,
        pagination: { clickable: true },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
      
      (swiperEl as any).initialize();
      this.swiperInitialized = true;
    }
  }
}
