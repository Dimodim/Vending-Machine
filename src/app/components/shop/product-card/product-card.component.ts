import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../models/interfaces/product.interface';

@Component({
  imports: [MatButtonModule, MatCardModule],
  selector: 'app-product-card',
  styleUrl: './product-card.component.scss',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) public product!: Product;
  @Input() public selected = false;
  @Input({ required: true }) public formatCents!: (cents: number) => string;
  @Output() public productSelected = new EventEmitter<Product>();

  protected select(): void {
    this.productSelected.emit(this.product);
  }
}
