import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Challenge } from '../../model/challenge';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChallengesService } from '../challenges.service';

@Component({
  selector: 'challenges-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './challenges-overview.component.html',
  styleUrl: './challenges-overview.component.css',
})
export class ChallengesOverviewComponent implements OnInit{
  displayedColumns: string[] = ['name', 'description', 'level', 'category'];
  public _data = new MatTableDataSource<Challenge>();

  @Output() challengeChosen = new EventEmitter<Challenge>();

  constructor(public ref: ApplicationRef, chService: ChallengesService) {
    this._data.data = chService.challengesCached;
    chService.challenges.subscribe(challenges => this._data.data = challenges);
  }

  ngOnInit(): void {
    this._data.filterPredicate = (challenge, filterValue) => {
      return challenge.name.toLowerCase().includes(filterValue.toLowerCase());
    };
  }

  updateFilter(event: Event) {
    this._data.filter = (event.target as HTMLInputElement).value;
  }
}
