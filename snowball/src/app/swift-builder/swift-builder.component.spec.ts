import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftBuilderComponent } from './swift-builder.component';

describe('SwiftBuilderComponent', () => {
  let component: SwiftBuilderComponent;
  let fixture: ComponentFixture<SwiftBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiftBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
