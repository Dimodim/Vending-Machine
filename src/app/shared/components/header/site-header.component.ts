import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  imports: [MatTabsModule, RouterLink, RouterLinkActive],
  selector: 'app-site-header',
  styleUrl: './site-header.component.scss',
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {}
