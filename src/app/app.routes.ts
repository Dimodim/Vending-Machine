import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'shop',
    loadComponent: () =>
      import('./components/shop/shop.component').then((component) => component.ShopComponent),
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./components/inventory/inventory.component').then(
        (component) => component.InventoryComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shop',
  },
  {
    path: '**',
    redirectTo: 'shop',
  },
];
