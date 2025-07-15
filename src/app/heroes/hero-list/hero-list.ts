import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material-module/material-module';
import { RouterLink } from '@angular/router';
import { Hero } from '../interfaces/hero.interface';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { HeroTable } from '../components/hero-table/hero-table';
import { HeroSearchBar } from '../components/hero-search-bar/hero-search-bar';
import { HeroesService } from '../services/heroes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../core/services/modal-service';
import {
  HERO_DELETE_ERROR_CONFIG,
  HERO_DELETE_MODAL_CONFIG,
  HERO_DELETE_SUCCESS_CONFIG,
} from '../const/hero-modal-config';
import { DialogConfig } from '../../shared/interfaces/dialog-config.interface';

@Component({
  imports: [RouterLink, MaterialModule, HeroSearchBar, HeroTable],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
})
export class HeroList implements OnInit {
  public dataSource = signal<Hero[]>([]);
  public totalData = signal(0);
  public isLoading = signal(false);
  public showPaginator = signal(true);

  private readonly heroesService = inject(HeroesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);
  private searchValue = '';
  private readonly paginationConfig = {
    page: 1,
    pageSize: 10,
    noPagination: 0,
  };

  /**
   * Get heroes when component is rendered and ready
   */
  ngOnInit(): void {
    this.getHeroes();
  }

  /**
   * Fetches paginated or searched heroes data to populate the table.
   *
   * @param page The page number to retrieve. First page by default. If 0, pagination is disabled and all results are returned.
   * @param pageSize The number of heroes per page. 5 page size by default. If 0, pagination is disabled and all results are returned.
   * @param searchValue Text to filter heroes by name. If empty, all heroes are returned without filtering.
   */
  getHeroes(
    page = this.paginationConfig.page,
    pageSize = this.paginationConfig.pageSize,
    searchValue = '',
  ): void {
    this.isLoading.set(true);
    this.heroesService
      .getAll(page, pageSize, searchValue)
      .pipe(
        // Unsubscribe when component is destroyed
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (heroes) => {
          this.dataSource.set(heroes.items);
          this.totalData.set(heroes.total);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  /**
   * Open delete modal
   * @param hero Hero data to show in modal and retrieve id to delete
   */
  openDeleteDialog(hero: Hero): void {
    const config: DialogConfig = {
      ...HERO_DELETE_MODAL_CONFIG,
      content: hero.name,
    };
    this.modalService.open(config, () => this.deleteHero(hero));
  }

  /**
   * Search a hero by name and disable pagination
   */
  searchHeroes(name: string): void {
    this.searchValue = name;
    this.showPaginator.set(false);
    this.getHeroes(
      this.paginationConfig.noPagination,
      this.paginationConfig.noPagination,
      name,
    );
  }

  /**
   * Show paginator again an fetch 5 first heroes
   */
  resetValues(): void {
    this.showPaginator.set(true);
    this.getHeroes();
  }

  /**
   * Get an specific quantity of heroes
   * @param pageEvent Pagination event with pageIndex and pageSize
   */
  getPage(pageEvent: PageEvent): void {
    this.getHeroes(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  /**
   * Delete a hero
   * @param id id from hero whose be deleted
   */
  private deleteHero(hero: Hero): void {
    const configSuccess = {
      ...HERO_DELETE_SUCCESS_CONFIG,
      content: hero.name,
    };
    this.isLoading.set(true);
    this.heroesService
      .delete(hero.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.modalService.open(configSuccess, () =>
            this.searchHeroes(this.searchValue),
          );
        },
        error: () => {
          this.modalService.open(HERO_DELETE_ERROR_CONFIG);
          this.isLoading.set(false);
        },
      });
  }
}
