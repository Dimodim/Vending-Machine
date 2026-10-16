import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../models/interfaces/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  imports: [MatCardModule, MatProgressSpinnerModule, ProductCardComponent],
  selector: 'app-product-catalog',
  styleUrl: './product-catalog.component.scss',
  templateUrl: './product-catalog.component.html',
})
export class ProductCatalogComponent {
  @Input({ required: true }) public products: Product[] = [];
  @Input() public loading = false;
  @Input() public error = '';
  @Input() public selectedProductId: string | null = null;
  @Input({ required: true }) public formatCents!: (cents: number) => string;
  @Output() public productSelected = new EventEmitter<Product>();
}
