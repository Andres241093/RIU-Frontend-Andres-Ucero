import { Routes } from '@angular/router';
import { HERO_PATHS, HERO_ROUTE_DATA } from './heroes/const/hero-routes';

export const routes: Routes = [
  {
    path: HERO_PATHS.LIST,
    loadComponent: () =>
      import('./heroes/hero-layout/hero-layout').then((c) => c.HeroLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        data: HERO_ROUTE_DATA.LIST,
        loadComponent: () =>
          import('./heroes/hero-list/hero-list').then((c) => c.HeroList),
      },
      {
        path: HERO_PATHS.CREATE,
        data: HERO_ROUTE_DATA.CREATE,
        loadComponent: () =>
          import('./heroes/hero-form/hero-form').then((c) => c.HeroForm),
      },
      {
        path: HERO_PATHS.EDIT,
        data: HERO_ROUTE_DATA.EDIT,
        loadComponent: () =>
          import('./heroes/hero-form/hero-form').then((c) => c.HeroForm),
      },
    ],
  },
  {
    path: '**',
    redirectTo: HERO_PATHS.LIST,
  },
];
