import { TestBed, inject } from '@angular/core/testing';

import { EdListService } from './ed-list.service';

describe('EdListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EdListService]
    });
  });

  it('should be created', inject([EdListService], (service: EdListService) => {
    expect(service).toBeTruthy();
  }));
});
