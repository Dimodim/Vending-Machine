import { Component, inject } from '@angular/core';
import { CheckoutPanelComponent } from './checkout-panel/checkout-panel.component';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';
import { VendingMachineService } from '../../services/vending-machine.service';

@Component({
  imports: [CheckoutPanelComponent, ProductCatalogComponent],
  selector: 'app-shop',
  styleUrl: './shop.component.scss',
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  protected readonly machine = inject(VendingMachineService);
}
