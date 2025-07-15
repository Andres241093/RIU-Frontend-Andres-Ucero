import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HEROES_MOCK } from '../../heroes/test/mocks/hero-mock';
import { Hero } from '../../heroes/interfaces/hero.interface';
import { HERO_ERROR_MESSAGES } from '../../heroes/const/hero-error-messages';
import { HeroesService } from './heroes.service';
import { PagedResult } from '../../shared/interfaces/pagination.interface';
import { HEROES_TOKEN } from '../../core/injection-tokens/heroes-token';

describe('HeroesService', () => {
  let service: HeroesService;
  let paginationDefault: {
    page: number;
    pageSize: number;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HEROES_TOKEN,
          useValue: HEROES_MOCK,
        },
      ],
    });
    service = TestBed.inject(HeroesService);
    paginationDefault = {
      page: 1,
      pageSize: 10,
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------
  //  Test if each method return correct data
  // -------------------------

  it('should return first 5 heroes', fakeAsync(() => {
    const heroes$ = service.getAll(
      paginationDefault.page,
      paginationDefault.pageSize,
    );
    let heroList: Hero[] | undefined;
    heroes$.subscribe({
      next: (heroes) => (heroList = heroes.items),
    });

    tick(service['delayTime']);

    expect(Array.isArray(heroList)).toBeTrue();
    expect(heroList?.length).toBeGreaterThan(0);

    // Verify returned heroes are the first 5 from HEROES_MOCK
    const expectedHeroes = HEROES_MOCK.map((hero) => ({
      ...hero,
      power: service['normalizePowers'](hero),
    })).slice(0, paginationDefault.pageSize);
    expect(heroList).toEqual(jasmine.arrayContaining(expectedHeroes));
  }));

  it('should return paginated heroes with correct total', fakeAsync(() => {
    paginationDefault = {
      ...paginationDefault,
      pageSize: 2,
    };
    const pageSize = paginationDefault.pageSize;

    let pagedResult: PagedResult<Hero> | undefined;
    service.getAll(paginationDefault.page, pageSize).subscribe({
      next: (result) => (pagedResult = result),
    });

    tick(service['delayTime']);

    expect(pagedResult).toBeDefined();
    expect(Array.isArray(pagedResult?.items)).toBeTrue();
    expect(pagedResult?.items.length).toBeLessThanOrEqual(pageSize);
    expect(pagedResult?.total).toBe(HEROES_MOCK.length);

    // Check that each hero has power array with no nulls (mapped to 'Powerless' if null)
    pagedResult?.items.forEach((hero) => {
      expect(Array.isArray(hero.power)).toBeTrue();
      hero.power?.forEach((power) => {
        expect(power).not.toBeNull();
        expect(power).not.toBeUndefined();
      });
    });
  }));

  it('should return correct heroes for page 2', fakeAsync(() => {
    paginationDefault = {
      page: 2,
      pageSize: 2,
    };

    let pagedResult: PagedResult<Hero> | undefined;
    service
      .getAll(paginationDefault.page, paginationDefault.pageSize)
      .subscribe({
        next: (result) => (pagedResult = result),
      });

    tick(service['delayTime']);

    expect(pagedResult).toBeDefined();
    expect(pagedResult?.items.length).toBeLessThanOrEqual(
      paginationDefault.pageSize,
    );

    // Verify that heroes returned correspond to the correct slice of HEROES_MOCK
    const expectedHeroes = HEROES_MOCK.slice(
      (paginationDefault.page - 1) * paginationDefault.pageSize,
      paginationDefault.page * paginationDefault.pageSize,
    );

    expect(pagedResult?.items).toEqual(
      jasmine.arrayContaining(
        expectedHeroes.map((hero) =>
          jasmine.objectContaining({
            id: hero.id,
            name: hero.name,
            universe: hero.universe,
          }),
        ),
      ),
    );
  }));

  it('should return only heroes that match with search value', fakeAsync(() => {
    const searchValue = 'man';
    const heroes$ = service.getAll(
      paginationDefault.page,
      paginationDefault.pageSize,
      searchValue,
    );
    let searchedHeroes: Hero[] | undefined;
    heroes$.subscribe({
      next: (heroes) => (searchedHeroes = heroes.items),
    });

    tick(service['delayTime']);

    expect(Array.isArray(searchedHeroes)).toBeTrue();
    expect(searchedHeroes?.length).toBeGreaterThan(0);

    // Verify if every hero name of search result matches with search value
    searchedHeroes?.forEach((hero: Hero) => {
      const heroName = hero.name.toLocaleLowerCase();
      const heroSearched = searchValue.toLocaleLowerCase();
      expect(heroName.includes(heroSearched)).toBeTrue();
    });
  }));

  it('should return a hero by a given id', fakeAsync(() => {
    const id = 1;
    const hero$ = service.getById(id);
    let selectedHero: Hero | undefined;
    hero$.subscribe({
      next: (hero: Hero) => (selectedHero = hero),
    });

    tick(service['delayTime']);

    // Verify that the searched hero exists in internal heroes array
    const heroInService = service['heroes'].find(
      (hero: Hero) => hero.id === id,
    );
    expect(heroInService).toBeTruthy();
    expect(selectedHero).toEqual(
      jasmine.objectContaining({ ...heroInService }),
    );
  }));

  it('should return an updated hero', fakeAsync(() => {
    const data: Hero = {
      id: 1,
      name: 'Doctor Strange',
      universe: 'Marvel',
      power: ['Magic', 'Time Manipulation'],
    };
    let updatedHero: Hero | undefined;
    const updateHero$ = service.update(data.id, data);
    updateHero$.subscribe((hero: Hero) => (updatedHero = hero));

    tick(service['delayTime']);

    expect(updatedHero).toEqual(jasmine.objectContaining({ ...data }));

    // Verify that the internal heroes array has been updated successfully
    const heroInService = service['heroes'].find(
      (hero: Hero) => hero.id === data.id,
    );
    expect(heroInService).toEqual(
      jasmine.objectContaining({
        ...updatedHero,
      }),
    );
  }));

  it('should return a new created hero', fakeAsync(() => {
    const newHeroData: Omit<Hero, 'id'> = {
      name: 'Wonder Woman',
      universe: 'DC',
      power: ['Super Strength', 'Flight', 'Lasso of Truth'],
    };
    let createdHero: Hero | undefined;
    const newHero$ = service.create(newHeroData);
    newHero$.subscribe({
      next: (newHero) => (createdHero = newHero),
    });

    tick(service['delayTime']);

    expect(createdHero).toEqual(
      jasmine.objectContaining({
        name: newHeroData.name,
        universe: newHeroData.universe,
      }),
    );

    // Checks if both heroes have powers
    newHeroData.power
      ? //If true compare if powers are exactly equals
        expect(createdHero?.power).toEqual(newHeroData.power)
      : // If false power property has to be undefined
        expect(createdHero?.power).toBeUndefined();

    // Verify if new hero was added to internal array
    const heroInService = service['heroes'].find(
      (hero: Hero) => hero.id === createdHero?.id,
    );
    expect(heroInService).toBeDefined();
  }));

  it('should delete an existing hero', fakeAsync(() => {
    const id = 1;
    const isHeroDeleted$ = service.delete(id);
    let isDeleted: boolean | undefined;
    isHeroDeleted$.subscribe({
      next: (isHeroDeleted) => (isDeleted = isHeroDeleted),
    });

    tick(service['delayTime']);

    expect(isDeleted).toBeTrue();

    // Verify if hero was deleted from internal array
    const heroInService = service['heroes'].find(
      (hero: Hero) => hero.id === id,
    );
    expect(heroInService).toBeUndefined();
  }));

  // -------------------------
  // Tests to handle errors and invalid values
  // -------------------------

  it('should return hero name with special characters that match with search value', fakeAsync(() => {
    const searchValue = HEROES_MOCK[17].name;
    const heroes$ = service.getAll(
      paginationDefault.page,
      paginationDefault.pageSize,
      searchValue,
    );
    let searchedHeroes: Hero[] | undefined;
    heroes$.subscribe({
      next: (heroes) => (searchedHeroes = heroes.items),
    });

    tick(service['delayTime']);

    expect(searchedHeroes ? searchedHeroes[0].name : '').toEqual(searchValue);

    // Verify if every hero name of search result matches with search value
    searchedHeroes?.forEach((hero: Hero) => {
      const heroName = hero.name.toLocaleLowerCase();
      const heroSearched = searchValue.toLocaleLowerCase();
      expect(heroName.includes(heroSearched)).toBeTrue();
    });
  }));

  it('should return empty items array if page exceeds total pages', fakeAsync(() => {
    paginationDefault = {
      page: 100,
      pageSize: 5,
    };

    let pagedResult: PagedResult<Hero> | undefined;
    service
      .getAll(paginationDefault.page, paginationDefault.pageSize)
      .subscribe({
        next: (result) => (pagedResult = result),
      });

    tick(service['delayTime']);

    expect(pagedResult).toBeDefined();
    expect(pagedResult?.items.length).toBe(0);
    expect(pagedResult?.total).toBe(HEROES_MOCK.length);
  }));

  it('should handle pageSize larger than total heroes', fakeAsync(() => {
    paginationDefault = {
      page: 1,
      pageSize: HEROES_MOCK.length + 10,
    };
    let pagedResult: PagedResult<Hero> | undefined;
    service
      .getAll(paginationDefault.page, paginationDefault.pageSize)
      .subscribe({
        next: (result) => (pagedResult = result),
      });

    tick(service['delayTime']);

    expect(pagedResult).toBeDefined();
    expect(pagedResult?.items.length).toBe(HEROES_MOCK.length);
    expect(pagedResult?.total).toBe(HEROES_MOCK.length);
  }));

  it('should return an empty array when no heroes match the search term', fakeAsync(() => {
    paginationDefault = {
      page: 1,
      pageSize: service['heroes'].length,
    };
    const searchValue = 'noexisthero';
    const heroes$ = service.getAll(
      paginationDefault.page,
      paginationDefault.pageSize,
      searchValue,
    );
    let searchedHeroes: Hero[] | undefined;
    heroes$.subscribe({
      next: (results) => (searchedHeroes = results.items),
    });

    tick(service['delayTime']);

    expect(Array.isArray(searchedHeroes)).toBeTruthy();
    expect(searchedHeroes?.length).toEqual(0);
  }));

  it('should throw an error if invalid id is passed', fakeAsync(() => {
    const id = 0;
    const hero$ = service.getById(id);
    let error: Error | undefined;
    hero$.subscribe({
      next: () => fail(HERO_ERROR_MESSAGES.TEST_UNEXPECTED_VALUE),
      error: (err) => (error = err),
    });

    tick(service['delayTime']);

    expect(error?.message).toEqual(HERO_ERROR_MESSAGES.NO_RESULTS_FOUND);
  }));

  it('should throw an error if invalid id is passed when hero is updated', fakeAsync(() => {
    const data: Hero = {
      id: 0,
      name: 'Doctor Strange',
      universe: 'Marvel',
      power: ['Magic', 'Time Manipulation'],
    };
    let error: Error | undefined;
    const updateHero$ = service.update(data.id, data);
    updateHero$.subscribe({
      next: () => fail(HERO_ERROR_MESSAGES.TEST_UNEXPECTED_VALUE),
      error: (err) => (error = err),
    });

    tick(service['delayTime']);

    expect(error?.message).toEqual(HERO_ERROR_MESSAGES.UPDATE_ERROR);
  }));

  it('should throw an error if invalid id is passed when hero is created', fakeAsync(() => {
    const newHeroData: Omit<Hero, 'id'> = {
      name: '',
      universe: '',
    };
    const hero$ = service.create(newHeroData);
    let error: Error | undefined;
    hero$.subscribe({
      next: () => fail(HERO_ERROR_MESSAGES.TEST_UNEXPECTED_VALUE),
      error: (err) => (error = err),
    });

    tick(service['delayTime']);

    expect(error?.message).toEqual(HERO_ERROR_MESSAGES.CREATE_ERROR);
  }));

  it('should throw an error if invalid id is passed when hero is deleted', fakeAsync(() => {
    const id = 0;
    const hero$ = service.delete(id);
    let error: Error | undefined;
    hero$.subscribe({
      next: () => fail(HERO_ERROR_MESSAGES.TEST_UNEXPECTED_VALUE),
      error: (err) => (error = err),
    });

    tick(service['delayTime']);

    expect(error?.message).toEqual(HERO_ERROR_MESSAGES.DELETE_ERROR);
  }));
});
