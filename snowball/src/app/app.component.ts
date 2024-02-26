import { ApplicationRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChallengesOverviewComponent } from './challenges-overview/challenges-overview.component';
import { HeaderComponent } from './header/header.component';
import { OWGameListener, OWWindow } from '@overwolf/overwolf-api-ts/dist';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ChallengesOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  desktopWindow = new OWWindow('Main');
  mainWindow = new OWWindow("bg");
  title = 'snowball';

  trayMenu = {
    menu_items: [
      {
        label: 'Exit',
        id: 'exit',
      },
    ],
  };

  constructor(private ref: ApplicationRef) {
    setInterval(() => {
      ref.tick();
    }, 100);

    this.setOverwolfMechanisms();
  }

  private setOverwolfMechanisms() {
    overwolf.os.tray.setMenu(this.trayMenu, () => { });
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
        this.desktopWindow.hide();
      }
    });
  }
}
