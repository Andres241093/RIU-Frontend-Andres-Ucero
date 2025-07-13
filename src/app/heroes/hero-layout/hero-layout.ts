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
      // Emit an initial value so the route title is available on component initialization
      startWith(null),
    ),
  ).pipe(
    map(() => {
      // Start from the root activated route
      let route = this._activatedRoute.root;

      // Traverse to the deepest child route
      while (route.firstChild) {
        route = route.firstChild;
      }

      // Return the title from route data or an empty string if none exists
      return route.snapshot.data['title'] ?? '';
    }),
  );
}
