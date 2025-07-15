import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material-module/material-module';
import { RouterLink } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { NoDataFound } from '../no-data-found/no-data-found';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-table',
  imports: [MaterialModule, RouterLink, NoDataFound],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
})
export class HeroTable {
  public dataSource = input.required<Hero[]>();
  public isLoading = input.required<boolean>();
  public deleteEvent = output<Hero>();
  public desktopColumns = signal([
    'id',
    'name',
    'power',
    'universe',
    'options',
  ]);
  public mobileColumns = signal(['name', 'options']);

  private breakpointObserver = inject(BreakpointObserver);

  deleteHero(hero: Hero): void {
    this.deleteEvent.emit(hero);
  }

  /**
   * Computes the displayed columns based on whether the screen size matches small breakpoints.
   */
  displayedColumns = computed(() =>
    this.isSmallScreen()?.matches
      ? this.mobileColumns()
      : this.desktopColumns(),
  );

  /**
   * Check resolution to show columns in small and xsmall screens
   */
  private isSmallScreen = toSignal(
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
    { initialValue: undefined },
  );
}
