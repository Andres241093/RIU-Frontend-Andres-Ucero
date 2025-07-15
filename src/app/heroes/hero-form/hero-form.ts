import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material-module/material-module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { POWERS } from '../const/powers';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UppercaseDirective } from '../../shared/directives/uppercase.directive';
import { LoaderService } from '../../core/loaders/loader-service';
import { HERO_FORM_ERROR } from '../const/hero-form-errors';
import { HeroesService } from '../services/heroes.service';
import { Hero } from '../interfaces/hero.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../core/services/modal-service';
import {
  HERO_CREATE_ERROR_CONFIG,
  HERO_CREATE_SUCCESS_CONFIG,
  HERO_GET_ID_ERROR_CONFIG,
  HERO_UPDATE_ERROR_CONFIG,
  HERO_UPDATE_SUCCESS_CONFIG,
} from '../const/hero-modal-config';
import { DialogConfig } from '../../shared/interfaces/dialog-config.interface';
import { finalize } from 'rxjs';
import { maxArrayLength } from '../../shared/validators/array-length.validator';

@Component({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    UppercaseDirective,
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
})
export class HeroForm implements OnInit {
  public readonly powers = POWERS;
  public readonly FORM_ERRORS = HERO_FORM_ERROR;
  public maxPowersToCHoose = signal(3);
  public heroId: string | null = null; // To check if form is for edit o create

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly modalService = inject(ModalService);
  private readonly heroesService = inject(HeroesService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);

  heroForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    universe: ['', [Validators.required]],
    power: [null, [maxArrayLength(this.maxPowersToCHoose())]],
  });

  ngOnInit(): void {
    this.checkViewType();
  }

  /**
   * Save a hero
   */
  submit(): void {
    if (this.heroForm.valid) {
      const heroData: Hero = this.heroForm.value;
      const parsedId = Number(this.heroId);

      // Choose correct service method based on view type
      const service$ = this.heroId
        ? this.heroesService.update(parsedId, heroData)
        : this.heroesService.create(heroData);

      // Choose correct modal configuration based on view type
      const modalSuccessConfig: DialogConfig = this.heroId
        ? HERO_UPDATE_SUCCESS_CONFIG
        : HERO_CREATE_SUCCESS_CONFIG;
      const modalErrorConfig: DialogConfig = this.heroId
        ? HERO_UPDATE_ERROR_CONFIG
        : HERO_CREATE_ERROR_CONFIG;

      this.loaderService.show();

      service$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loaderService.hide()),
        )
        .subscribe({
          next: () => {
            // Open success modal and if you click on OK you'll be redirected to home
            this.modalService.open(modalSuccessConfig, () =>
              this.router.navigate(['/home']),
            );
          },
          error: () => {
            // Open error modal and if you click on OK you'll be redirected to home
            this.modalService.open(modalErrorConfig, () =>
              this.router.navigate(['/home']),
            );
          },
        });
    } else {
      // Mark all control as touched if form is invalid. This, to show errors
      this.heroForm.markAllAsTouched();
    }
  }

  /**
   * Disable power list if you reach the limit
   * @param power power to disable in form
   * @returns true if you reach the powers limit, false if you don't
   */
  isPowerDisabled(power: string): boolean {
    const selectedPowers: string[] = this.heroForm.get('power')?.value || [];
    const max = this.maxPowersToCHoose();

    if (selectedPowers.length < max) {
      return false;
    }

    return !selectedPowers.includes(power);
  }

  /**
   * Checks if view is for create or edit
   */
  private checkViewType(): void {
    this.heroId = this.activatedRoute.snapshot.params['id'];
    if (this.heroId) this.getHeroById(this.heroId);
  }

  /**
   * Get Hero by a given id
   * @param id Hero's id
   */
  private getHeroById(id: string): void {
    const parsedId = Number(id);

    this.loaderService.show();

    this.heroesService
      .getById(parsedId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderService.hide()),
      )
      .subscribe({
        next: (hero) =>
          this.heroForm.patchValue({
            ...hero,
            name: hero.name.toUpperCase(), // Show the name in uppercase on the first render
          }),
        error: () =>
          // Open a modal to show an error alert and if you click on OK you'll be redirected to home
          this.modalService.open(HERO_GET_ID_ERROR_CONFIG, () =>
            this.router.navigate(['/home']),
          ),
      });
  }
}
