import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatIconModule, MatButtonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnChanges {
  @Output() clicked = new EventEmitter();
  @Input() currentWindowName: string = "";

  currentWindow: OWWindow = {} as OWWindow;

  maximized: boolean = false;

  header!: HTMLElement;
  close!: HTMLElement;
  maximize!: HTMLElement;
  minimize!: HTMLElement;

  ngOnChanges(): void {
    this.currentWindow = new OWWindow(this.currentWindowName);
  
    this.header = document.getElementById("header")!;
    this.currentWindow.dragMove(this.header);

    this.minimize = document.getElementById("minimizeButton")!;
    this.minimize?.addEventListener('click', () => {
      this.currentWindow.minimize();
    });

    if(this.isChampSelectWindow()) return;

    this.close = document.getElementById("closeButton")!;
    this.close?.addEventListener('click', () => {
      this.currentWindow.hide();
    });

    this.maximize = document.getElementById("maximizeButton")!;
    this.maximize?.addEventListener('click', () => {
      if (!this.maximized) {
        this.currentWindow.maximize();
      } else {
        this.currentWindow.restore();
      }

      this.maximized = !this.maximized;
    });
  }

  isChampSelectWindow() {
    return this.currentWindowName == "chSelect";
  }

  constructor() {
  }
}
