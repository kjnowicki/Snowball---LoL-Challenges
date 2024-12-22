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
import { HttpClient } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ChampSelectService } from './services/champ.select.service';
import { ChampSelectSession } from '../model/session';
import { ChampSelectComponent } from './champ-select/champ-select.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ChallengesOverviewComponent,
    ChallengeDetailsComponent,
    MatProgressBarModule,
    ProfileComponent,
    ChampSelectComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  desktopWindow = new OWWindow('Main');
  mainWindow = new OWWindow('bg');
  champSelectWindow = new OWWindow('chSelect');
  currentWindow: string = '';
  title = 'snowball';
  dataLoaded = false;
  gameLaunched = true;
  session: ChampSelectSession | undefined = undefined;

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
    private ddService: DataDragonService,
    private chSelect: ChampSelectService
  ) {
    setInterval(() => {
      ref.tick();
    }, 200);

    overwolf.windows.getCurrentWindow((win) => {
      this.currentWindow = win.window.name;
    });
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
    setInterval(() => {
      this.chSelect.getSessionIfPresent();
    }, 1500); 

    this.chSelect.champSelectSession.subscribe((session) => {
      this.session = session;
      if (session == undefined) {
        this.champSelectWindow.getWindowState().then((state) => {
          if (
            state.window_state_ex != overwolf.windows.enums.WindowStateEx.closed &&
            state.window_state_ex != overwolf.windows.enums.WindowStateEx.minimized
          ) {
            this.champSelectWindow.close();
            this.mainWindow.restore();
          }
        });
      } else {
        this.champSelectWindow.getWindowState().then((state) => {
          if (
            state.window_state_ex == overwolf.windows.enums.WindowStateEx.closed || 
            state.window_state_ex == overwolf.windows.enums.WindowStateEx.hidden
          ) {
            this.champSelectWindow.restore();
            this.mainWindow.hide();
          }
        });
      }
    });
  }

  chooseChallengeEvent(challenge: Challenge) {
    this.chosenChallenge = challenge;
    this.currentNavigationSwitch = NavigationSwitch.CH_DETAILS;
  }

  navigate(navigationSwitch: NavigationSwitch) {
    this.currentNavigationSwitch = navigationSwitch;
  }
}

export enum NavigationSwitch {
  START,
  CH_OVERVIEW,
  CH_DETAILS,
}
