import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGroupAsAdminComponent } from './join-group-as-admin.component';

describe('JoinGroupAsAdminComponent', () => {
  let component: JoinGroupAsAdminComponent;
  let fixture: ComponentFixture<JoinGroupAsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinGroupAsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGroupAsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
