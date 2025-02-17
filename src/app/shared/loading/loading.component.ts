import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
  `],
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule]
})
export class LoadingComponent {}