import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../models/interfaces/product.interface';

@Component({
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  selector: 'app-inventory-product-list',
  styleUrl: './inventory-product-list.component.scss',
  templateUrl: './inventory-product-list.component.html',
})
export class InventoryProductListComponent {
  @Input() public products: Product[] = [];
  @Input() public loading = false;
  @Input({ required: true }) public formatCents!: (cents: number) => string;
  @Output() public edit = new EventEmitter<Product>();
  @Output() public remove = new EventEmitter<Product>();
}
