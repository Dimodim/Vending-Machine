import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule],
  selector: 'app-inventory-overview',
  styleUrl: './inventory-overview.component.scss',
  templateUrl: './inventory-overview.component.html',
})
export class InventoryOverviewComponent {
  public readonly productCount = input.required<number>();
  public readonly totalStock = input.required<number>();
}
