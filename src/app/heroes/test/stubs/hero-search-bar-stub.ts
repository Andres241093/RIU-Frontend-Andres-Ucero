import { Component, output } from '@angular/core';

@Component({
  selector: 'app-hero-search-bar',
  template: '',
  standalone: true,
})
export class HeroSearchBarStub {
  public searchEvent = output();
  public resetEvent = output();
}
