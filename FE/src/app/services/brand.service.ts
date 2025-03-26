import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Brand } from '../types/brand';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  
  http = inject(HttpClient)
  constructor() { }

  getBrands(){
    return this.http.get<Brand[]>(environment.apiUrl+'/brand');
  }
  getBrandsById(id:string){
    return this.http.get<Brand>(environment.apiUrl+'/brand/' + id);
  }
  addBrand(name: string) {
    if (!name || name.trim().length < 2) {
      return throwError(() => new Error('Brand name must be at least 2 characters'));
    }
    
    return this.http.post<Brand>(`${environment.apiUrl}/brand`, { name }).pipe(
      catchError(error => {
        console.error('Add brand error:', error);
        return throwError(() => new Error('Failed to add brand. Please try again.'));
      })
    );
  }
  updateBrand(id:string, name:string){
    return this.http.put<Brand>(environment.apiUrl+'/brand/'+id ,{
      name:name
    })
  }
  deleteBrandById(id:string){
    return this.http.delete<Brand>(environment.apiUrl+'/brand/' + id)
  }
}
