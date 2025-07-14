import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material-module/material-module';
import { Loader } from '../../shared/components/loader/loader';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterOutlet, MaterialModule, Loader],
  templateUrl: './hero-layout.html',
  styleUrl: './hero-layout.scss',
})
export class HeroLayout {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _routeTitle$ = this._router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .pipe(
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

  // Transform observable to signal to avoid async pipe and reduce unnecessary change detection in children (router-outlet)
  public routeTitle = toSignal(this._routeTitle$, { initialValue: '' });
}
