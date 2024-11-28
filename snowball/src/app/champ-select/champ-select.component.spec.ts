import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampSelectComponent } from './champ-select.component';

describe('ChampSelectComponent', () => {
  let component: ChampSelectComponent;
  let fixture: ComponentFixture<ChampSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChampSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
