import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material-module/material-module';
import { RouterLink } from '@angular/router';
import { Hero } from '../interfaces/hero.interface';
import { HeroesService } from '../../core/services/heroes.service';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { HeroTable } from '../components/hero-table/hero-table';
import { NgComponentOutlet } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, MaterialModule, NgComponentOutlet, ReactiveFormsModule],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
})
export class HeroList implements OnInit, OnDestroy {
  private readonly _heroesService = inject(HeroesService);
  private readonly _unsubscribe$ = new Subject();
  private NO_PAGINATION = 0;

  public heroTableComponent = HeroTable;
  public dataSource = signal<Hero[]>([]);
  public totalData = signal(0);
  public searchControl = new FormControl('');
  public _defaultPagination = {
    page: 1,
    pageSize: 5,
    hide: false,
  };

  /**
   * Get first 5 heroes when component is rendered and ready
   */
  ngOnInit(): void {
    this.getHeroes();
  }

  /**
   * Fetches paginated or searched heroes data to populate the table.
   *
   * @param page The page number to retrieve. If 0, pagination is disabled and all results are returned.
   * @param pageSize The number of heroes per page. If 0, pagination is disabled and all results are returned.
   * @param searchValue Text to filter heroes by name. If empty, all heroes are returned without filtering.
   */
  getHeroes(
    page = this._defaultPagination.page,
    pageSize = this._defaultPagination.pageSize,
    searchValue = '',
  ): void {
    this._heroesService
      .getAll(page, pageSize, searchValue)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (heroes) => {
          this.dataSource.set(heroes.items);
          this.totalData.set(heroes.total);
        },
      });
  }

  /**
   * Search a hero by name
   */
  searchHeroes(): void {
    const searchValue = this.searchControl.value ?? '';
    this._defaultPagination.hide = true;
    this.getHeroes(this.NO_PAGINATION, this.NO_PAGINATION, searchValue.trim());
  }

  /**
   * Get an specific quantity of heroes
   * @param pageEvent Pagination event with pageIndex and pageSize
   */
  getPage(pageEvent: PageEvent): void {
    const searchValue = this.searchControl.value ?? '';
    this.getHeroes(
      pageEvent.pageIndex + 1,
      pageEvent.pageSize,
      searchValue.trim(),
    );
  }

  reset(): void {
    this._defaultPagination.hide = false;
    this.getHeroes();
  }

  /**
   * Unsubscribe all observables to avoid memory leaks
   */
  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
