import { NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { Challenge } from '../../model/challenge';
import { ChallengesService } from '../services/challenges.service';
import { ChallengeUtils } from '../utils/challengeUtils';

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
export class ChallengesOverviewComponent {
  displayedColumns: string[] = ['name', 'description', 'level', 'category'];
  filteredData = new MatTreeNestedDataSource<ChallengeNode>();
  allData: ChallengeNode[];
  treeControl = new NestedTreeControl<ChallengeNode>((node) => node.children);

  @Output() challengeChosen = new EventEmitter<Challenge>();

  chUtils = ChallengeUtils;

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
        let hasChildren = node.children.length > 0;
        let challengeMatches = this.challengeContains(
          node.challenge,
          filterValue
        );
        let children = hasChildren
          ? this.mapFilteredData(
              node.children,
              filterValue,
              parentMatched || challengeMatches
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
      (challenge.childrenIds.length == 0 &&
        (challenge.description.toLowerCase().includes(value) ||
          challenge.category.toLowerCase().includes(value)))
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
