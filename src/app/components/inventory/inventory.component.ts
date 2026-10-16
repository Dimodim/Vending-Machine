import { Component, inject } from '@angular/core';
import { VendingMachineService } from '../../services/vending-machine.service';
import { InventoryOverviewComponent } from './inventory-overview/inventory-overview.component';
import { InventoryProductListComponent } from './inventory-product-list/inventory-product-list.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';

@Component({
  imports: [InventoryOverviewComponent, InventoryProductListComponent, ProductEditorComponent],
  selector: 'app-inventory',
  styleUrl: './inventory.component.scss',
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {
  protected readonly machine = inject(VendingMachineService);
}
