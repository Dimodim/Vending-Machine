import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Product } from '../models/interfaces/product.interface';
import { ProductDraft } from '../models/interfaces/product-draft.interface';
import { ProductApiService } from './product-api.service';
import { VendingMachineService } from './vending-machine.service';

const testProduct: Product = {
  id: 'lemon-shortbread',
  name: 'Lemon shortbread',
  category: 'Bakery',
  priceCents: 120,
  stock: 2,
  icon: '🍋',
  accent: '#f1e7b9',
};

const testDraft: ProductDraft = {
  name: 'Almond croissant',
  category: 'Bakery',
  price: '2.20',
  stock: 7,
  icon: '🥐',
  accent: '#efd9b9',
};

describe('VendingMachineService', () => {
  let service: VendingMachineService;
  let getProducts: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getProducts = vi.fn(() => of([testProduct]));
    TestBed.configureTestingModule({
      providers: [VendingMachineService, { provide: ProductApiService, useValue: { getProducts } }],
    });
    service = TestBed.inject(VendingMachineService);
  });

  it('loads products into the shared signal state', () => {
    service.loadProducts();

    expect(getProducts).toHaveBeenCalledOnce();
    expect(service.products()).toEqual([testProduct]);
    expect(service.loading()).toBe(false);
    expect(service.totalStock()).toBe(2);
  });

  it('exposes a useful message when product loading fails', () => {
    getProducts.mockReturnValue(throwError(() => new Error('API offline')));

    service.loadProducts();

    expect(service.loading()).toBe(false);
    expect(service.error()).toContain('could not load the products');
  });

  it('does not select unavailable products', () => {
    service.loading.set(false);
    service.products.set([{ ...testProduct, stock: 0 }]);

    service.selectProduct(service.products()[0]);

    expect(service.selectedProductId()).toBeNull();
  });

  it('calculates the balance from inserted coin denominations', () => {
    service.insertCoin(100);
    service.insertCoin(50);

    expect(service.balanceCents()).toBe(150);
  });

  it('completes a purchase, decrements stock, and returns change', () => {
    service.products.set([testProduct]);
    service.loading.set(false);
    service.selectProduct(testProduct);
    service.insertCoin(200);

    expect(service.canPurchase()).toBe(true);

    service.purchase();

    expect(service.products()[0].stock).toBe(1);
    expect(service.insertedCoins()).toEqual({ 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 });
    expect(service.selectedProductId()).toBeNull();
    expect(service.feedback()).toContain('change returned');
  });

  it('rejects a product with an invalid price or stock', () => {
    service.saveProduct({ ...testDraft, price: '0', stock: 16 });

    expect(service.products()).toEqual([]);
    expect(service.feedback()).toContain('valid price');
  });

  it('rejects duplicate product prices', () => {
    service.products.set([testProduct]);

    service.saveProduct({ ...testDraft, price: '1.20' });

    expect(service.products()).toEqual([testProduct]);
    expect(service.feedback()).toContain('unique price');
  });

  it('adds a valid product to the signal state', () => {
    service.saveProduct(testDraft);

    expect(service.products()).toHaveLength(1);
    expect(service.products()[0]).toMatchObject({
      name: 'Almond croissant',
      priceCents: 220,
      stock: 7,
      icon: '🥐',
    });
    expect(service.feedback()).toContain('added to the machine');
  });

  it('deletes a product and clears its selection', () => {
    service.products.set([testProduct]);
    service.selectedProductId.set(testProduct.id);

    service.deleteProduct(testProduct);

    expect(service.products()).toEqual([]);
    expect(service.selectedProductId()).toBeNull();
    expect(service.feedback()).toContain('removed from the machine');
  });
});
