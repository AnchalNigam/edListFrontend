import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdListsComponent } from './ed-lists.component';

describe('EdListsComponent', () => {
  let component: EdListsComponent;
  let fixture: ComponentFixture<EdListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
