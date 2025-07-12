import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, merge, startWith } from 'rxjs';

@Component({
  selector: 'app-hero-layout',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './hero-layout.html',
  styleUrl: './hero-layout.scss',
})
export class HeroLayout {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public readonly routeTitle$ = merge(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
    ),
  ).pipe(
    map(() => {
      let route = this._activatedRoute.root;
      while (route.firstChild) {
        route = route.firstChild;
        console.log(route);
      }
      return route.snapshot.data['title'] || '';
    }),
  );
}
