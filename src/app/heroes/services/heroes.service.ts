import { inject, Injectable } from '@angular/core';
import { Hero } from '../../heroes/interfaces/hero.interface';
import { delay, map, Observable, of, throwError } from 'rxjs';
import { HERO_ERROR_MESSAGES } from '../../heroes/const/hero-error-messages';
import { PagedResult } from '../../shared/interfaces/pagination.interface';
import { HEROES_TOKEN } from '../../core/injection-tokens/heroes-token';
import { removeAccents } from '../../shared/utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private heroes = inject(HEROES_TOKEN);
  private readonly delayTime = 1500;

  /**
   * Get heroes by page or name
   * @param page Page for paginate heroes
   * @param pageSize Page size for paginate heroes
   * @param name  Search hero by name
   * @returns An array of paginated heroes
   */
  getAll(
    page: number,
    pageSize: number,
    name: string = '',
  ): Observable<PagedResult<Hero>> {
    let items: Hero[];

    // If name exists, filter by hero's name ignoring uppercase and specials characters otherwise return all heroes
    const filteredHeroes = name
      ? this.heroes.filter((hero) =>
          removeAccents(hero.name.toLocaleLowerCase()).includes(
            name.toLocaleLowerCase(),
          ),
        )
      : this.heroes;

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
      delay(this.delayTime),
      map((result) => ({
        items: result.items.map((hero) => ({
          ...hero,
          power: this.normalizePowers(hero),
        })),
        total: result.total,
      })),
    );
  }

  /**
   * Get hero by id
   * @param heroId Hero's id
   * @returns Observable emitting the found hero or error if not found.
   */
  getById(heroId: number): Observable<Hero> {
    const hero = this.heroes.find((hero) => hero.id === heroId);

    return hero
      ? of(hero).pipe(delay(this.delayTime))
      : this.throwError(HERO_ERROR_MESSAGES.NO_RESULTS_FOUND).pipe(
          delay(this.delayTime),
        );
  }

  /**
   * Update an existing hero
   * @param id The id of the hero to update
   * @param changes Partial hero data containing the fields to update
   * @returns Observable emitting the updated hero or an error if the hero is not found.
   */
  update(id: number, changes: Partial<Omit<Hero, 'id'>>): Observable<Hero> {
    const index = this.heroes.findIndex((h) => h.id === id);

    // Check if was found
    if (index === -1) {
      // Throws an error if isn't found
      return this.throwError(HERO_ERROR_MESSAGES.UPDATE_ERROR);
    }

    const updatedHero = { ...this.heroes[index], ...changes };

    // Update heroes array immutably to maintain state integrity
    this.heroes = [
      ...this.heroes.slice(0, index),
      updatedHero,
      ...this.heroes.slice(index + 1),
    ];
    return of(updatedHero).pipe(delay(this.delayTime));
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

    // If required data has no present, throw an error
    if (!hero.name?.trim() || !hero.universe?.trim()) {
      return this.throwError(HERO_ERROR_MESSAGES.CREATE_ERROR);
    }
    // Update heroes array immutably to maintain state integrity
    this.heroes = [...this.heroes, newHero];

    return of(newHero).pipe(delay(this.delayTime));
  }

  /**
   * Delete a hero
   * @param heroId Hero's id
   * @returns Observable emitting true is hero was deleted or false if not.
   */
  delete(heroId: number): Observable<boolean> {
    // Find hero to delete
    const index = this.heroes.findIndex((hero) => hero.id === heroId);

    // If wasn't founded throws an error
    if (index === -1) {
      return this.throwError(HERO_ERROR_MESSAGES.DELETE_ERROR);
    }

    // Otherwise, filter all heroes except that one whose was deleted
    // Update heroes array immutably to maintain state integrity
    this.heroes = this.heroes.filter((hero) => hero.id !== heroId);

    return of(true).pipe(delay(this.delayTime));
  }

  /**
   * Throws an error
   * @param message A message to show
   * @returns Observable with an error
   */
  private throwError(message: string): Observable<never> {
    return throwError(() => new Error(message)).pipe(delay(this.delayTime));
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
      this.heroes.length > 0
        ? Math.max(...this.heroes.map((hero) => hero.id)) + 1
        : 1;
    return id;
  }
}
