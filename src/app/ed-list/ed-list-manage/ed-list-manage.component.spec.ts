import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdListManageComponent } from './ed-list-manage.component';

describe('EdListManageComponent', () => {
  let component: EdListManageComponent;
  let fixture: ComponentFixture<EdListManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdListManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdListManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
