import { ApplicationRef, Component } from '@angular/core';
import { ChallengesOverviewComponent } from './challenges-overview/challenges-overview.component';
import { HeaderComponent } from './header/header.component';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import { ChallengeDetailsComponent } from './challenge-details/challenge-details.component';
import { Challenge } from '../model/challenge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ChallengesOverviewComponent,
    ChallengeDetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  desktopWindow = new OWWindow('Main');
  mainWindow = new OWWindow('bg');
  title = 'snowball';

  trayMenu = {
    menu_items: [
      {
        label: 'Exit',
        id: 'exit',
      },
    ],
  };

  currentNavigationSwitch = NavigationSwitch.START;
  navigationSwitch = NavigationSwitch;

  chosenChallenge: Challenge | undefined;

  constructor(private ref: ApplicationRef) {
    setInterval(() => {
      ref.tick();
    }, 100);

    this.setOverwolfMechanisms();
  }

  private setOverwolfMechanisms() {
    if (!window.location?.search?.includes('gamelaunchevent')) {
      this.desktopWindow.restore();
    }
    overwolf.extensions.onAppLaunchTriggered.addListener(launchEvent => {
      this.desktopWindow.restore();
    });

    overwolf.os.tray.setMenu(this.trayMenu, () => {});
    overwolf.os.tray.onMenuItemClicked.addListener((data) => {
      if (data.item == 'exit') {
        this.mainWindow.close();
      }
    });
    overwolf.os.tray.onTrayIconDoubleClicked.addListener(() => {
      this.desktopWindow.restore();
    });

    overwolf.games.launchers.onTerminated.addListener((data) => {
      if (data.classId == 10902) {
        this.mainWindow.close();
      }
    });
  }

  chooseChallengeEvent(challenge: Challenge) {
    this.chosenChallenge = challenge;
    this.currentNavigationSwitch = NavigationSwitch.CH_DETAILS;
  }
}

export enum NavigationSwitch {
  START,
  CH_DETAILS,
}
