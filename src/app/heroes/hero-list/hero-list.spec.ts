import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { HeroList } from './hero-list';
import { provideRouter, RouterLink } from '@angular/router';
import { HeroesService } from '../services/heroes.service';
import { DestroyRef } from '@angular/core';
import { HEROES_RESPONSE_MOCK } from '../test/mocks/hero-mock';
import { of, throwError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { HeroSearchBarStub } from '../test/stubs/hero-search-bar-stub';
import { HeroTableStub } from '../test/stubs/hero-table-stub';
import { HeroFormStub } from '../test/stubs/hero-form-stub';
import { MaterialModule } from '../../shared/modules/material-module/material-module';
import { ModalService } from '../../core/services/modal-service';
import { DialogConfig } from '../../shared/interfaces/dialog-config.interface';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const heroesSpy = jasmine.createSpyObj('HeroesService', [
      'getAll',
      'delete',
    ]);
    const modalSpy = jasmine.createSpyObj('ModalService', ['open']);
    const destroySpy = jasmine.createSpyObj('DestroyRef', ['onDestroy']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    heroesSpy.getAll.and.returnValue(of({ items: [], total: 0 }));
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    });

    await TestBed.configureTestingModule({
      imports: [HeroList],
      providers: [
        provideRouter([{ path: 'heroes/new', component: HeroFormStub }]),
        { provide: HeroesService, useValue: heroesSpy },
        { provide: ModalService, useValue: modalSpy },
        { provide: DestroyRef, useValue: destroySpy },
      ],
    })
      .overrideComponent(HeroList, {
        set: {
          imports: [
            RouterLink,
            MaterialModule,
            HeroTableStub,
            HeroSearchBarStub,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
    heroesServiceSpy = TestBed.inject(
      HeroesService,
    ) as jasmine.SpyObj<HeroesService>;
    modalServiceSpy = TestBed.inject(
      ModalService,
    ) as jasmine.SpyObj<ModalService>;
    fixture.detectChanges();
  });

  // -------------------------
  //  Test if each method return correct data
  // -------------------------

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHeroes in ngOnInit with default params', () => {
    spyOn(component, 'getHeroes');
    component.ngOnInit();

    expect(component.getHeroes).toHaveBeenCalledWith();
  });

  it('should open delete modal and call heroesService.delete when confirmed', () => {
    const hero = HEROES_RESPONSE_MOCK.items[3];
    modalServiceSpy.open.and.callFake(
      (dialogConfig: DialogConfig, callback?: () => void) => {
        expect(dialogConfig.content).toBe(hero.name);
        if (callback) callback();
      },
    );
    heroesServiceSpy.delete.and.returnValue(of(true));
    component.openDeleteDialog(hero);

    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(heroesServiceSpy.delete).toHaveBeenCalledWith(hero.id);
  });

  it('should set dataSource and totalData in getHeroes on success', fakeAsync(() => {
    heroesServiceSpy.getAll.and.returnValue(of(HEROES_RESPONSE_MOCK));
    component.getHeroes(1, 5, '');

    tick();

    expect(component.dataSource()).toEqual(HEROES_RESPONSE_MOCK.items);
    expect(component.totalData()).toBe(HEROES_RESPONSE_MOCK.total);
    expect(component.isLoading()).toBe(false);
  }));

  it('searchHeroes should disable paginator and call getHeroes with no pagination and search value', () => {
    spyOn(component, 'getHeroes');
    component.searchHeroes('batman');

    expect(component.showPaginator()).toBe(false);
    expect(component.getHeroes).toHaveBeenCalledWith(0, 0, 'batman');
  });

  it('resetValues should enable paginator and call getHeroes with default params', () => {
    spyOn(component, 'getHeroes');
    component.resetValues();

    expect(component.showPaginator()).toBe(true);
    expect(component.getHeroes).toHaveBeenCalledWith();
  });

  it('getPage should call getHeroes with pageEvent values', () => {
    spyOn(component, 'getHeroes');
    const pageEvent: PageEvent = { pageIndex: 2, pageSize: 10, length: 0 };
    component.getPage(pageEvent);

    expect(component.getHeroes).toHaveBeenCalledWith(3, 10);
  });

  // -------------------------
  // Tests to handle errors and invalid values
  // -------------------------

  it('getHeroes should set isLoading to false on error and log error', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    heroesServiceSpy.getAll.and.returnValue(
      throwError(() => new Error('Error in service!')),
    );
    component.getHeroes();
    tick();

    expect(component.isLoading()).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  }));

  it('searchHeroes with empty string should still call getHeroes with no pagination', () => {
    spyOn(component, 'getHeroes');
    component.searchHeroes('');

    expect(component.showPaginator()).toBe(false);
    expect(component.getHeroes).toHaveBeenCalledWith(0, 0, '');
  });
});
