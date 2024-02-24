import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit{
  currentWindow = new OWWindow("Main");
  maximized: boolean = false;

  header!: HTMLElement;
  close!: HTMLElement;
  maximize!: HTMLElement;
  minimize!: HTMLElement;

  ngAfterViewInit(): void {
    this.header = document.getElementById("header")!;
    this.close = document.getElementById("closeButton")!;
    this.maximize = document.getElementById("maximizeButton")!;
    this.minimize = document.getElementById("minimizeButton")!;

    this.currentWindow.dragMove(this.header);
    this.close.addEventListener('click', () => {
      this.currentWindow.close();
    });

    this.minimize.addEventListener('click', () => {
      this.currentWindow.minimize();
    });

    this.maximize.addEventListener('click', () => {
      if (!this.maximized) {
        this.currentWindow.maximize();
      } else {
        this.currentWindow.restore();
      }

      this.maximized = !this.maximized;
    });
  }

  constructor() {
  }
}
