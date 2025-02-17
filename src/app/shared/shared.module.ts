import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    InputTextModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    TabViewModule,
    InputTextModule
  ]
})
export class SharedModule { }
