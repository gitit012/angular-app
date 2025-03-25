import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule,MatInputModule, MatButtonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  router = inject(Router)
  name!:string;
  categoryService = inject(CategoryService)
  route = inject(ActivatedRoute)
  isEdit = false;
  id!:string
  ngOnInit(){
    this.id = this.route.snapshot.params["id"]
    console.log(this.id)
    if(this.id){
      this.isEdit=true;
      this.categoryService.getCategoriesById(this.id).subscribe((result:any)=>{
        console.log(result)
        this.name = result.name;
      })
    }
  }
  add(){
    this.categoryService.addCategory(this.name).subscribe((result:any)=>{
      alert("Category added")
      this.router.navigateByUrl('/admin/categories')
    })
  }
  update(){
    this.categoryService.updateCategory(this.id,this.name).subscribe((result:any)=>{
      alert("Category updated")
      this.router.navigateByUrl('/admin/categories')
    })
  }
}
