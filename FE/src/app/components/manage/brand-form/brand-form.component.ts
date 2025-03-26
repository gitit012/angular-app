import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name!: string;
  brandsService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  id!: string;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.brandsService.getBrandsById(this.id).subscribe({
        next: (result) => this.name = result.name,
        error: (err) => console.error('Failed to load brand', err)
      });
    }
  }

  add() {
    this.brandsService.addBrand(this.name).subscribe({
      next: () => {
        alert('Brand added');
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err) => {
        console.error('Add error:', err);
        alert('Failed to add brand: ' + (err.error?.message || err.message));
      }
    });
  }

  update() {
    this.brandsService.updateBrand(this.id, this.name).subscribe({
      next: () => {
        alert('Brand updated');
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update brand: ' + (err.error?.message || err.message));
      }
    });
  }
}