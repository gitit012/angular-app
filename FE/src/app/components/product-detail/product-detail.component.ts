import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule,ProductCardComponent,MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
customerService = inject(CustomerService)
route = inject(ActivatedRoute)
product!: Product;
mainImage!:string;
similarProducts:Product[]=[]
wishlistService = inject(WishlistService)

ngOnInit(){
  this.route.params.subscribe((x:any)=>{
    this.getProductDetail(x.id)
  })
}
getProductDetail(id:string){
  this.customerService.getProductById(id).subscribe((result)=>{
    this.product = result
    this.mainImage= this.product.images[0]
    console.log(this.product)

    this.customerService.getProducts('',this.product.categoryId,'',-1,'',1,4).subscribe(result=>{
      this.similarProducts = result
    })
  })
}

changeImage(url:string) {
  this.mainImage=url
}
get sellingPrice(){
  const discountedPrice =  this.product.price - (this.product.price*Math.abs(this.product.discount/100))
  return new Intl.NumberFormat('en-In').format(Math.ceil(discountedPrice)); 
}
addToWishlist(product:Product){
  console.log(product)
  if(this.isInWishlist(product)){
    this.wishlistService
    .removeFromWishlists(product._id!)
    .subscribe((result)=>{
      this.wishlistService.init()
    });
  }else{
    this.wishlistService
    .addToWishlists(product._id!)
    .subscribe((result)=>{
      this.wishlistService.init()
  })
}
}
isInWishlist(product:Product){
  let isExists = this.wishlistService.wishlists.find(
    x=>x._id==product._id
  );
  if(isExists) return true;
  else return false;    
}

}
