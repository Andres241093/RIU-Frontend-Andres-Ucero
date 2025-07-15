import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingCount = 0; // Counter to track active requests and avoid flickering
  private readonly loaderSubject = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this.loaderSubject.asObservable();

  /**
   * Increments the request count and shows the loader only when the first request starts.
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.loaderSubject.next(true);
    }
  }

  /**
   * Decrements the request count and hides the loader only when all requests have completed.
   * Ensures the loader stays visible while there are pending requests.
   */
  hide(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
      if (this.loadingCount === 0) {
        this.loaderSubject.next(false);
      }
    }
  }
}
