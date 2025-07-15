import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-table',
  template: '',
  standalone: true,
})
export class HeroTableStub {
  public dataSource = input();
  public isLoading = input();
}
