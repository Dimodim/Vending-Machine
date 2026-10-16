import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/interfaces/product.interface';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests products from the products API', () => {
    const products: Product[] = [
      {
        id: 'lemon-shortbread',
        name: 'Lemon shortbread',
        category: 'Bakery',
        priceCents: 120,
        stock: 12,
        icon: '🍋',
        accent: '#f1e7b9',
      },
    ];
    let receivedProducts: Product[] | undefined;

    service.getProducts().subscribe((result) => (receivedProducts = result));

    const request = httpTestingController.expectOne('/api/products');
    expect(request.request.method).toBe('GET');
    request.flush(products);

    expect(receivedProducts).toEqual(products);
  });
});
