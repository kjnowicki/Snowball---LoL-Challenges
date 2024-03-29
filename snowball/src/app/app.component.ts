import { ApplicationRef, Component } from '@angular/core';
import { ChallengesOverviewComponent } from './challenges-overview/challenges-overview.component';
import { HeaderComponent } from './header/header.component';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import { ChallengeDetailsComponent } from './challenge-details/challenge-details.component';
import { Challenge } from '../model/challenge';
import { ChallengesService } from './services/challenges.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LcuService } from './services/lcu.service';
import { ChampionsService } from './services/champions.service';
import { DataDragonService } from './services/data-dragon.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ChallengesOverviewComponent,
    ChallengeDetailsComponent,
    MatProgressBarModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  desktopWindow = new OWWindow('Main');
  mainWindow = new OWWindow('bg');
  title = 'snowball';
  dataLoaded = false;
  gameLaunched = true;

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

  constructor(
    private ref: ApplicationRef,
    private chService: ChallengesService,
    private lcuService: LcuService,
    private champsService: ChampionsService,
    private http: HttpClient,
    private ddService: DataDragonService
  ) {
    setInterval(() => {
      ref.tick();
    }, 200);

    ddService.setHttpClient(http).updateDD();
    chService.challenges.subscribe(() => (this.dataLoaded = true));

    this.setOverwolfMechanisms();

    overwolf.games.launchers.getRunningLaunchersInfo((data) => {
      if (data.launchers.filter((l) => l.classId == 10902).length > 0) {
      } else {
        this.gameLaunched = false;
      }
      overwolf.games.launchers.onLaunched.addListener((data) => {
        if (data.classId == 10902) {
          this.gameLaunched = true;
          this.lcuService.updateInfo();
        }
      });
    });
  }

  private setOverwolfMechanisms() {
    if (!window.location?.search?.includes('gamelaunchevent')) {
      this.desktopWindow.restore();
    }
    overwolf.extensions.onAppLaunchTriggered.addListener((launchEvent) => {
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

    overwolf.games.launchers.onUpdated.addListener(() => {
      this.chService.updateChallenges();
      this.champsService.updateChampions();
      this.champsService.updateChampionMastery();
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
