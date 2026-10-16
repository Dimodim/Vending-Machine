import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import {
  FormField,
  form,
  max,
  min,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductDraft } from '../../../models/interfaces/product-draft.interface';

type ProductEditorModel = Omit<ProductDraft, 'price'> & { price: string };

function toEditorModel(draft: ProductDraft): ProductEditorModel {
  return { ...draft, price: String(draft.price) };
}

@Component({
  imports: [FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  selector: 'app-product-editor',
  styleUrl: './product-editor.component.scss',
  templateUrl: './product-editor.component.html',
})
export class ProductEditorComponent implements OnChanges {
  private readonly formModel = signal<ProductEditorModel>({
    name: '',
    category: 'Snack',
    price: '',
    stock: 5,
    icon: '🍪',
    accent: '#f2ddca',
  });

  protected readonly form = form(this.formModel, (path) => {
    required(path.name, { message: 'Enter a product name.' });
    required(path.price, {
      message: 'Enter a price greater than zero with up to two decimal places.',
    });
    pattern(path.price, /^\d+(?:\.\d{1,2})?$/, {
      message: 'Enter a price greater than zero with up to two decimal places.',
    });
    validate(path.price, ({ value }) => {
      const priceCents = Number(value()) * 100;
      return Number.isSafeInteger(priceCents) && priceCents > 0
        ? null
        : {
            kind: 'price',
            message: 'Enter a price greater than zero with up to two decimal places.',
          };
    });
    required(path.stock, { message: 'Stock must be a whole number between 0 and 15.' });
    min(path.stock, 0, { message: 'Stock must be a whole number between 0 and 15.' });
    max(path.stock, 15, { message: 'Stock must be a whole number between 0 and 15.' });
    validate(path.stock, ({ value }) =>
      Number.isInteger(value())
        ? null
        : { kind: 'stock', message: 'Stock must be a whole number between 0 and 15.' },
    );
  });

  protected readonly productIcons = [
    { value: '🍋', label: 'Lemon' },
    { value: '🍓', label: 'Strawberry' },
    { value: '🍪', label: 'Cookie' },
    { value: '🍵', label: 'Tea' },
    { value: '🥐', label: 'Croissant' },
    { value: '🍑', label: 'Peach' },
    { value: '🍫', label: 'Chocolate' },
    { value: '🧃', label: 'Juice' },
    { value: '🍎', label: 'Apple' },
    { value: '🍌', label: 'Banana' },
    { value: '🥨', label: 'Pretzel' },
    { value: '🥪', label: 'Sandwich' },
    { value: '🧁', label: 'Cupcake' },
    { value: '🥤', label: 'Drink' },
    { value: '🍿', label: 'Popcorn' },
  ] as const;

  @Input({ required: true }) public draft!: ProductDraft;
  @Input() public editing = false;
  @Input() public feedback = '';
  @Output() public save = new EventEmitter<ProductDraft>();
  @Output() public cancel = new EventEmitter<void>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['draft'] && this.draft) {
      this.form().reset(toEditorModel(this.draft));
    }
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.save.emit({ ...this.formModel() });
    });
  }
}
