import { NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { Challenge, Threshold } from '../../model/challenge';
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
    MatButtonModule,
    MatProgressBarModule,
    MatTreeModule,
    MatIconModule,
  ],
  templateUrl: './challenges-overview.component.html',
  styleUrl: './challenges-overview.component.css',
})
export class ChallengesOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'level', 'category'];
  filteredData = new MatTreeNestedDataSource<ChallengeNode>();
  allData: ChallengeNode[];
  treeControl = new NestedTreeControl<ChallengeNode>((node) => node.children);

  @Output() challengeChosen = new EventEmitter<Challenge>();

  constructor(
    public ref: ApplicationRef,
    private chService: ChallengesService
  ) {
    this.allData = this.getChallengesNodes();
    this.filteredData.data = this.allData;
    chService.challenges.subscribe(() => {
      this.allData = this.getChallengesNodes();
      this.filteredData.data = this.allData;
    });
  }

  ngOnInit(): void {
    // this.filteredData.filterPredicate = (challenge, filterValue) => {
    //   return challenge.name.toLowerCase().includes(filterValue.toLowerCase());
    // };
  }

  updateFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.filteredData.data = this.mapFilteredData(this.allData, filterValue);
    if (filterValue == '') this.treeControl.collapseAll();
  }

  mapFilteredData(
    challengesNodes: ChallengeNode[],
    filterValue: string,
    parentMatched: boolean = false
  ): ChallengeNode[] {
    filterValue = filterValue.toLowerCase();
    return challengesNodes
      .filter(
        (node) =>
          parentMatched ||
          this.challengeNodeRecursivelyContains(node, filterValue)
      )
      .map((node) => {
        let children =
          node.children.length > 0
            ? this.mapFilteredData(
                node.children,
                filterValue,
                parentMatched ||
                  this.challengeContains(node.challenge, filterValue)
              )
            : [];
        let newNode = new ChallengeNode(node.challenge, children);
        this.treeControl.expandDescendants(newNode);
        return newNode;
      });
  }

  challengeNodeRecursivelyContains(
    challengeNode: ChallengeNode,
    value: string
  ): boolean {
    let challenge = challengeNode.challenge;
    return (
      this.challengeContains(challenge, value) ||
      challengeNode.children.some((childNode) =>
        this.challengeNodeRecursivelyContains(childNode, value)
      )
    );
  }

  private challengeContains(challenge: Challenge, value: string): boolean {
    return (
      challenge.name.toLowerCase().includes(value) ||
      challenge.description.toLowerCase().includes(value) ||
      challenge.category.toLowerCase().includes(value)
    );
  }

  getChallengesNodes() {
    let topChallenges = this.chService.challengesCached.filter(
      (ch) => ch.parentName == ''
    );
    return topChallenges.map((ch) => this.recursiveChallengeNode(ch));
  }

  recursiveChallengeNode(challenge: Challenge): ChallengeNode {
    return new ChallengeNode(
      challenge,
      this.chService.challengesCached
        .filter((child) => child.parentId == challenge.id)
        .map((child) => this.recursiveChallengeNode(child))
    );
  }

  getChallengeProgress(challenge: Challenge) {
    if (challenge.nextThreshold == 0)
      return `${challenge.currentValue} / ${challenge.currentThreshold}`;
    else {
      let threshold: Threshold | undefined = new Map(Object.entries(challenge.thresholds)).get(challenge.nextLevel);
      if(threshold != undefined) {
        return `${challenge.currentValue} / ${challenge.nextThreshold} (+ ${threshold.rewards.filter(r => r.category == "CHALLENGE_POINTS").at(0)?.quantity} Points)`;
      } else {
        return `${challenge.currentValue} / ${challenge.nextThreshold}`;
      }
    }
  }

  hasChildren = (_: number, node: ChallengeNode) =>
    !!node.children && node.children.length > 0;
}

export class ChallengeNode {
  challenge: Challenge;
  children: ChallengeNode[] = [];

  constructor(challenge: Challenge, children: ChallengeNode[]) {
    this.challenge = challenge;
    this.children = children;
  }
}
