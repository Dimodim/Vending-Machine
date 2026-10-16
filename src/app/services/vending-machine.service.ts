import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/interfaces/product.interface';
import { ProductDraft } from '../models/interfaces/product-draft.interface';
import { CoinCounts } from '../models/types/coin-counts.type';
import { ProductApiService } from './product-api.service';

const COIN_DENOMINATIONS = [200, 100, 50, 20, 10] as const;
const COIN_FLOAT: CoinCounts = { 200: 4, 100: 8, 50: 10, 20: 10, 10: 10 };
const EMPTY_COINS: CoinCounts = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 };

function emptyProductDraft(): ProductDraft {
  return {
    name: '',
    category: 'Snack',
    price: '',
    stock: 5,
    icon: '',
    accent: '#f2ddca',
  };
}

@Injectable({ providedIn: 'root' })
export class VendingMachineService {
  private readonly productApi = inject(ProductApiService);

  public readonly products = signal<Product[]>([]);
  public readonly loading = signal(true);
  public readonly error = signal('');
  public readonly feedback = signal('');
  public readonly selectedProductId = signal<string | null>(null);
  public readonly insertedCoins = signal<CoinCounts>({ ...EMPTY_COINS });
  public readonly coinFloat = signal<CoinCounts>({ ...COIN_FLOAT });
  public readonly editingProductId = signal<string | null>(null);
  public readonly draft = signal<ProductDraft>(emptyProductDraft());

  public readonly selectedProduct = computed(
    () => this.products().find((product) => product.id === this.selectedProductId()) ?? null,
  );
  public readonly totalStock = computed(() =>
    this.products().reduce((total, product) => total + product.stock, 0),
  );
  public readonly balanceCents = computed(() =>
    COIN_DENOMINATIONS.reduce(
      (total, denomination) => total + denomination * this.insertedCoins()[denomination],
      0,
    ),
  );
  public readonly changeCents = computed(() => {
    const product = this.selectedProduct();
    if (!product || this.balanceCents() < product.priceCents) {
      return null;
    }

    return this.balanceCents() - product.priceCents;
  });
  public readonly changePlan = computed(() => {
    const changeCents = this.changeCents();
    if (changeCents === null) {
      return null;
    }

    const available = { ...this.coinFloat() };
    for (const denomination of COIN_DENOMINATIONS) {
      available[denomination] += this.insertedCoins()[denomination];
    }
    return this.makeChange(changeCents, available);
  });
  public readonly canPurchase = computed(() => {
    const product = this.selectedProduct();
    return (
      !this.loading() &&
      product !== null &&
      product.stock > 0 &&
      this.balanceCents() >= product.priceCents &&
      this.changePlan() !== null
    );
  });

  public readonly denominations = COIN_DENOMINATIONS;
  public readonly formatCents = (cents: number) =>
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  public loadProducts(): void {
    this.productApi.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'We could not load the products. Check that the mock API is running and try again.',
        );
        this.loading.set(false);
      },
    });
  }

  public clearFeedback(): void {
    this.feedback.set('');
  }

  public selectProduct(product: Product): void {
    if (product.stock === 0 || this.loading()) {
      return;
    }
    this.selectedProductId.set(product.id);
    this.clearFeedback();
  }

  public insertCoin(denomination: number): void {
    this.insertedCoins.update((coins) => ({ ...coins, [denomination]: coins[denomination] + 1 }));
    this.clearFeedback();
  }

  public resetMachine(): void {
    this.insertedCoins.set({ ...EMPTY_COINS });
    this.selectedProductId.set(null);
    this.feedback.set('Your coins have been returned. No purchase was made.');
  }

  public purchase(): void {
    const product = this.selectedProduct();
    const changeCents = this.changeCents();
    const changePlan = this.changePlan();

    if (!product || !this.canPurchase() || changeCents === null || changePlan === null) {
      this.feedback.set(
        changePlan === null && product && changeCents !== null
          ? 'Sorry, the machine cannot make exact change for this purchase. Try exact payment or reset.'
          : 'Select an available product and insert enough coins to continue.',
      );
      return;
    }

    this.coinFloat.update((coins) => {
      const updated = { ...coins };
      for (const denomination of COIN_DENOMINATIONS) {
        updated[denomination] += this.insertedCoins()[denomination] - changePlan[denomination];
      }
      return updated;
    });
    this.products.update((products) =>
      products.map((item) => (item.id === product.id ? { ...item, stock: item.stock - 1 } : item)),
    );
    this.insertedCoins.set({ ...EMPTY_COINS });
    this.selectedProductId.set(null);
    this.feedback.set(
      `${changeCents > 0 ? `${this.formatCents(changeCents)} change returned.` : 'Exact change received.'}`,
    );
  }

  public editProduct(product: Product): void {
    this.editingProductId.set(product.id);
    this.draft.set({
      name: product.name,
      category: product.category,
      price: (product.priceCents / 100).toFixed(2),
      stock: product.stock,
      icon: product.icon,
      accent: product.accent,
    });
    this.clearFeedback();
  }

  public cancelEdit(): void {
    this.editingProductId.set(null);
    this.draft.set(emptyProductDraft());
  }

  public saveProduct(draft: ProductDraft): void {
    const priceMatch = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(draft.price).trim());
    const priceCents = priceMatch
      ? Number(priceMatch[1]) * 100 + Number((priceMatch[2] ?? '').padEnd(2, '0'))
      : 0;
    const editingId = this.editingProductId();

    if (
      !draft.name.trim() ||
      !Number.isSafeInteger(priceCents) ||
      priceCents < 1 ||
      !Number.isInteger(draft.stock) ||
      draft.stock < 0 ||
      draft.stock > 15
    ) {
      this.feedback.set('Enter a name, valid price, and stock between 0 and 15.');
      return;
    }
    if (
      this.products().some(
        (product) => product.id !== editingId && product.priceCents === priceCents,
      )
    ) {
      this.feedback.set('Each product type needs its own unique price.');
      return;
    }

    const product: Product = {
      id: editingId ?? crypto.randomUUID(),
      name: draft.name.trim(),
      category: draft.category,
      priceCents,
      stock: draft.stock,
      icon: draft.icon || '🍪',
      accent: draft.accent || '#f2ddca',
    };
    this.products.update((products) =>
      editingId
        ? products.map((item) => (item.id === editingId ? product : item))
        : [...products, product],
    );
    this.feedback.set(
      editingId ? `${product.name} updated.` : `${product.name} added to the machine.`,
    );
    this.cancelEdit();
  }

  public deleteProduct(product: Product): void {
    this.products.update((products) => products.filter((item) => item.id !== product.id));
    if (this.selectedProductId() === product.id) {
      this.selectedProductId.set(null);
    }
    this.feedback.set(`${product.name} removed from the machine.`);
  }

  private makeChange(amount: number, available: CoinCounts): CoinCounts | null {
    let remaining = amount;
    const change: CoinCounts = { ...EMPTY_COINS };

    for (const denomination of COIN_DENOMINATIONS) {
      const count = Math.min(Math.floor(remaining / denomination), available[denomination]);
      change[denomination] = count;
      remaining -= count * denomination;
    }

    if (remaining === 0) {
      return change;
    }
    return this.findChangeCombination(0, amount, available, new Map<string, CoinCounts | null>());
  }

  private findChangeCombination(
    index: number,
    remaining: number,
    available: CoinCounts,
    memo: Map<string, CoinCounts | null>,
  ): CoinCounts | null {
    if (remaining === 0) {
      return { ...EMPTY_COINS };
    }
    if (index >= COIN_DENOMINATIONS.length) {
      return null;
    }

    const key = `${index}:${remaining}`;
    if (memo.has(key)) {
      return memo.get(key) ?? null;
    }

    const denomination = COIN_DENOMINATIONS[index];
    const maximumCoins = Math.min(Math.floor(remaining / denomination), available[denomination]);
    for (let count = maximumCoins; count >= 0; count--) {
      const result = this.findChangeCombination(
        index + 1,
        remaining - count * denomination,
        available,
        memo,
      );
      if (result) {
        const plan = { ...result, [denomination]: count };
        memo.set(key, plan);
        return plan;
      }
    }

    memo.set(key, null);
    return null;
  }
}
