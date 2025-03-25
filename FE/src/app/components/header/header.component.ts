import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  categoryService = inject(CategoryService);
  categoryList:Category[]=[];
  ngOnInit(){
    this.categoryService.getCategories().subscribe(result=>{
      this.categoryList = result
    })
  }
}
