import { ApplicationRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChallengesOverviewComponent } from './challenges-overview/challenges-overview.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ChallengesOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'snowball';

  constructor(private ref: ApplicationRef){
    setInterval(() => {
      ref.tick();
    }, 100);
  }
}
