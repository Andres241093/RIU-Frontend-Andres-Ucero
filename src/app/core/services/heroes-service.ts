import { Injectable } from '@angular/core';
import { Hero } from '../../heroes/hero.interface';
import { delay, Observable, of, throwError } from 'rxjs';
import { HEROES } from '../../heroes/const/hero-data';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private heroes = [...HEROES];
  private delayTime = 2000;

  /**
   * Get all heroes
   * @returns Observable with all heroes array
   */
  getAll(): Observable<Hero[]> {
    return of(this.heroes).pipe(delay(this.delayTime));
  }

  /**
   * Search hero by name
   * @param name hero's name
   * @returns Observable with a heroes array that matches with your search
   */
  search(name: string): Observable<Hero[]> {
    const heroes = this.heroes.filter((hero) =>
      hero.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );

    return of(heroes).pipe(delay(this.delayTime));
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
      : this.throwError('No hero found!').pipe(delay(this.delayTime));
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
      return this.throwError('Hero not found');
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
   * @returns Observable with the new hero
   */
  create(hero: Omit<Hero, 'id'>): Observable<Hero> {
    // Generate a new id
    const newId = this.generateId();
    const newHero = { id: newId, ...hero };
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
      return this.throwError('Error deleting hero!');
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
