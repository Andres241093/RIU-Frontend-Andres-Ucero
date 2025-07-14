import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroList } from './hero-list';
import { provideRouter } from '@angular/router';
import { HeroFormStub } from '../stubs/hero-form-stub/hero-form-stub';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
      providers: [
        provideRouter([{ path: 'heroes/new', component: HeroFormStub }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
