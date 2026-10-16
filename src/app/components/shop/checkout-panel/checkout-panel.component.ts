import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CoinCounts } from '../../../models/types/coin-counts.type';
import { Product } from '../../../models/interfaces/product.interface';

@Component({
  imports: [DecimalPipe, MatButtonModule, MatCardModule],
  selector: 'app-checkout-panel',
  styleUrl: './checkout-panel.component.scss',
  templateUrl: './checkout-panel.component.html',
})
export class CheckoutPanelComponent {
  @Input() public product: Product | null = null;
  @Input() public selectedProductId: string | null = null;
  @Input() public insertedCoins: CoinCounts = {};
  @Input() public balanceCents = 0;
  @Input() public changeCents: number | null = null;
  @Input() public canPurchase = false;
  @Input() public canMakeChange = false;
  @Input() public feedback = '';
  @Input({ required: true }) public formatCents!: (cents: number) => string;
  @Input() public denominations: readonly number[] = [];
  @Output() public coinInserted = new EventEmitter<number>();
  @Output() public purchase = new EventEmitter<void>();
  @Output() public reset = new EventEmitter<void>();
}
