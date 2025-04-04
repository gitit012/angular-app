import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../types/cartitem'; // Use your imported type
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-cart',
  imports: [RouterLink, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartService = inject(CartService);

  get cartItems(): CartItem[] {
    return this.cartService.items;
  }

  ngOnInit() {
    this.cartService.init();
  }

  getTotal() {
    const total = this.cartService.items.reduce((sum, item) => 
      sum + this.getDiscountedPrice(item.product) * item.quantity, 0);
    return new Intl.NumberFormat('en-IN').format(total);
  }

  private getDiscountedPrice(product: CartItem['product']): number {
    const discount = product.discount ?? 0;
    const discountedPrice = product.price - (product.price * Math.abs(discount / 100));
    return Math.ceil(discountedPrice);
  }

  getFormattedSellingPrice(product: CartItem['product']): string {
    return new Intl.NumberFormat('en-IN').format(this.getDiscountedPrice(product));
  }

  getFormattedItemTotal(item: CartItem): string {
    const total = this.getDiscountedPrice(item.product) * item.quantity;
    return new Intl.NumberFormat('en-IN').format(total);
  }

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity > 0) {
      this.cartService.addToCart(productId, newQuantity).subscribe(() => {
        this.cartService.init();
      });
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartService.init();
    });
  }

  checkout() {
    alert('Proceeding to checkout...');
  }
}