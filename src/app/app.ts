import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { VendingMachineService } from './services/vending-machine.service';
import { SiteHeaderComponent } from './shared/components/header/site-header.component';

@Component({
  imports: [RouterOutlet, SiteHeaderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly machine = inject(VendingMachineService);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.machine.loadProducts();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.machine.clearFeedback());
  }
}
