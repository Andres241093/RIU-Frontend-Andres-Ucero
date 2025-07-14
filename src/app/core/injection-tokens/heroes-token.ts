import { InjectionToken } from '@angular/core';
import { Hero } from '../../heroes/interfaces/hero.interface';
import { HEROES } from '../../heroes/const/hero-data';

export const HEROES_TOKEN = new InjectionToken<Hero[]>('HEROES_TOKEN', {
  providedIn: 'root',
  factory: () => HEROES,
});
