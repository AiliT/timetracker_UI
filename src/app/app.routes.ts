import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainContentComponent },
    { path: 'statistics', component: StatisticsComponent }
  ];