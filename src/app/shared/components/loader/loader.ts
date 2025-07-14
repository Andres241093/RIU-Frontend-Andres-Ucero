import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material-module/material-module';
import { LoaderService } from '../../../core/loaders/loader-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [MaterialModule, AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loader {
  private readonly _loaderService = inject(LoaderService);
  public isLoading$ = this._loaderService.loading$;
}
