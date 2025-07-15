import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material-module/material-module';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-search-bar',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './hero-search-bar.html',
  styleUrl: './hero-search-bar.scss',
})
export class HeroSearchBar implements OnInit {
  public searchControl = new FormControl('');
  public searchEvent = output<string>();
  public resetEvent = output<void>();

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.handleChanges();
  }

  onSearchHero(): void {
    const searchValue = this.searchControl.value;
    if (searchValue) this.searchEvent.emit(searchValue.trim());
  }

  /**
   * Reset input and emit reset event
   */
  onReset(): void {
    this.searchControl.patchValue(null);
    this.resetEvent.emit();
  }

  /**
   * Subscribe to input changes and emits different values every 300ms
   */
  private handleChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (value) => {
          if (value === '') this.onReset();
        },
      });
  }
}
