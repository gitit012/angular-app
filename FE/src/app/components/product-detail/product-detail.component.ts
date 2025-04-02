import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule,ProductCardComponent,RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
customerService = inject(CustomerService)
route = inject(ActivatedRoute)
product!: Product;
mainImage!:string;
similarProducts:Product[]=[]
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
}
