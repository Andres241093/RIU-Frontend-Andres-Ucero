import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../loaders/loader-service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
/**
 * This interceptor is prepared to show/hide loader on HTTP requests.
 * Currently, the app uses local data without HTTP, so this interceptor
 * will activate once a real or simulated backend is implemented.
 */
export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.show();

  return next(req).pipe(
    tap({
      next: () => loaderService.hide(),
      error: () => loaderService.hide(),
    }),
  );
};
