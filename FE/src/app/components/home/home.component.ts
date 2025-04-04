import { Component, inject, AfterViewInit } from '@angular/core'; // Added AfterViewInit
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit {
  customerService = inject(CustomerService);
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  private swiperInitialized = false;
  wishlistService = inject(WishlistService)
  cartService = inject(CartService)


  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe(result => {
      this.featuredProducts = result;
    });
    this.customerService.getNewProducts().subscribe(result => {
      this.newProducts = result;
    });
    this.wishlistService.init()
    this.cartService.init()
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
