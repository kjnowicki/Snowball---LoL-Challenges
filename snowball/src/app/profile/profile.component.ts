import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  model
} from '@angular/core';
import { NavigationSwitch } from '../app.component';
import { MatDividerModule } from '@angular/material/divider';
import { SummonerService } from '../services/summoner.service';
import { MatButtonModule } from '@angular/material/button';
import { ChallengesService } from '../services/challenges.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Challenge } from '../../model/challenge';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChallengeUtils } from '../utils/challengeUtils';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements AfterViewInit {
  @Output() navigate = new EventEmitter<NavigationSwitch>();
  @Output() challengeChosen = new EventEmitter<Challenge>();

  profileName: string;

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  chDisplayedColumns: string[] = ['name', 'progress', 'ptg', 'prio'];
  chDataSource: MatTableDataSource<ChallengeSummary> =
    new MatTableDataSource<ChallengeSummary>([]);
  readonly showPointless = model(false);

  chUtil = ChallengeUtils;

  constructor(
    summonerService: SummonerService,
    private challengesService: ChallengesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.profileName = summonerService.summoner?.displayName ?? '...';
    this.updateData();

    challengesService.challenges.subscribe(data => {
      this.chDataSource.data = this.mapChallenges(data);
    });
  }

  ngAfterViewInit() {
    this.chDataSource.paginator = this.paginator;
    this.chDataSource.sort = this.sort;
  }

  goToChallenges() {
    this.navigate.emit(NavigationSwitch.CH_OVERVIEW);
  }

  mapChallenges(challenges: Challenge[]): ChallengeSummary[] {
    return challenges.filter(ch => ch.nextLevel != "" && !ch.childrenIds.length).map(ch => {
      let progress = this.getProgress(ch);
      let ptg = this.chUtil.getNextPointsReward(ch);
      return {
        chRef: ch,
        name: ch.name,
        description: ch.description,
        progress: progress,
        ptg: ptg,
        nextLevel: ch.nextLevel,
        prio: progress * ptg
      };
    }).filter(ch => this.showPointless() || ch.ptg > 0);
  }

  updateData() {
    this.chDataSource.data = this.mapChallenges(ChallengesService.challengesCached);
  }

  getProgress(challenge: Challenge) {
    if (challenge.nextThreshold <= 0) return 100;
    let progress = challenge.currentValue / challenge.nextThreshold;
    return progress;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

interface ChallengeSummary {
  chRef: Challenge;
  name: string;
  description: string;
  progress: number;
  ptg: number;
  nextLevel: string;
  prio: number;
}