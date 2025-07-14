import { inject, Injectable } from '@angular/core';
import { Hero } from '../../heroes/interfaces/hero.interface';
import { delay, finalize, map, Observable, of, throwError } from 'rxjs';
import { HEROES_TOKEN } from '../injection-tokens/heroes-token';
import { HERO_ERROR_MESSAGES } from '../../heroes/const/hero-error-messages';
import { LoaderService } from '../loaders/loader-service';
import { PagedResult } from '../../shared/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private _heroes = inject(HEROES_TOKEN);
  private readonly _loaderService = inject(LoaderService);
  private readonly _delayTime = 2000;

  /**
   * Get heroes by page or name
   * @param page Page for paginate heroes
   * @param pageSize Page size for paginate heroes
   * @param name  Search hero by name
   * @returns An array of paginated heroes
   */
  getAll(
    page = 0,
    pageSize = 0,
    name: string = '',
  ): Observable<PagedResult<Hero>> {
    let items: Hero[];

    this._loaderService.show();

    // If name exists, filter by hero's name ignoring uppercase otherwise return all heroes
    const filteredHeroes = name
      ? this._heroes.filter((hero) =>
          hero.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
        )
      : this._heroes;

    // Validate if page and pageSize exists
    const hasPagination = page > 0 && pageSize > 0;

    if (hasPagination) {
      const startIndex = (page - 1) * pageSize;
      items = filteredHeroes.slice(startIndex, startIndex + pageSize!);
    } else {
      items = filteredHeroes;
    }

    const total = filteredHeroes.length;

    return of({ items, total }).pipe(
      delay(this._delayTime),
      map((result) => ({
        items: result.items.map((hero) => ({
          ...hero,
          power: this.normalizePowers(hero),
        })),
        total: result.total,
      })),
      finalize(() => this._loaderService.hide()),
    );
  }

  /**
   * Get hero by id
   * @param heroId Hero's id
   * @returns Observable emitting the found hero or error if not found.
   */
  getById(heroId: number): Observable<Hero> {
    const hero = this._heroes.find((hero) => hero.id === heroId);
    this._loaderService.show();

    return hero
      ? of(hero).pipe(
          delay(this._delayTime),
          finalize(() => this._loaderService.hide()),
        )
      : this.throwError(HERO_ERROR_MESSAGES.NO_RESULTS_FOUND).pipe(
          delay(this._delayTime),
          finalize(() => this._loaderService.hide()),
        );
  }

  /**
   * Update an existing hero
   * @param id The id of the hero to update
   * @param changes Partial hero data containing the fields to update
   * @returns Observable emitting the updated hero or an error if the hero is not found.
   */
  update(id: number, changes: Partial<Omit<Hero, 'id'>>): Observable<Hero> {
    const index = this._heroes.findIndex((h) => h.id === id);
    this._loaderService.show();

    // Check if was found
    if (index === -1) {
      // Throws an error if isn't found
      return this.throwError(HERO_ERROR_MESSAGES.UPDATE_ERROR);
    }

    const updatedHero = { ...this._heroes[index], ...changes };

    // Update heroes array immutably to maintain state integrity
    this._heroes = [
      ...this._heroes.slice(0, index),
      updatedHero,
      ...this._heroes.slice(index + 1),
    ];
    return of(updatedHero).pipe(
      delay(this._delayTime),
      finalize(() => this._loaderService.hide()),
    );
  }

  /**
   * Create a new hero
   * @param hero New hero's data
   * @returns Observable with the new hero, throws an error if data is empty
   */
  create(hero: Omit<Hero, 'id'>): Observable<Hero> {
    // Generate a new id
    const newId = this.generateId();
    const newHero = { id: newId, ...hero };
    this._loaderService.show();

    // If required data has no present, throw an error
    if (!hero.name?.trim() || !hero.universe?.trim()) {
      return this.throwError(HERO_ERROR_MESSAGES.CREATE_ERROR);
    }
    // Update heroes array immutably to maintain state integrity
    this._heroes = [...this._heroes, newHero];

    return of(newHero).pipe(
      delay(this._delayTime),
      finalize(() => this._loaderService.hide()),
    );
  }

  /**
   * Delete a hero
   * @param heroId Hero's id
   * @returns Observable emitting true is hero was deleted or false if not.
   */
  delete(heroId: number): Observable<boolean> {
    // Find hero to delete
    const index = this._heroes.findIndex((hero) => hero.id === heroId);
    this._loaderService.show();

    // If wasn't founded throws an error
    if (index === -1) {
      return this.throwError(HERO_ERROR_MESSAGES.DELETE_ERROR);
    }

    // Otherwise, filter all heroes except that one whose was deleted
    // Update heroes array immutably to maintain state integrity
    this._heroes = this._heroes.filter((hero) => hero.id !== heroId);

    return of(true).pipe(
      delay(this._delayTime),
      finalize(() => this._loaderService.hide()),
    );
  }

  /**
   * Throws an error
   * @param message A message to show
   * @returns Observable with an error
   */
  private throwError(message: string): Observable<never> {
    this._loaderService.show();
    return throwError(() => new Error(message)).pipe(
      delay(this._delayTime),
      finalize(() => this._loaderService.hide()),
    );
  }

  /**
   * Normalizes a hero's powers.
   * @param hero The hero whose powers will be normalized.
   * @returns An array of normalized powers.
   */
  private normalizePowers(hero: Hero): string[] {
    return hero.power?.map((p) => p ?? 'Powerless') ?? ['No power'];
  }

  /**
   * Generate a new unique incremental id
   * @returns A new id number
   */
  private generateId(): number {
    const id =
      this._heroes.length > 0
        ? Math.max(...this._heroes.map((hero) => hero.id)) + 1
        : 1;
    return id;
  }
}
