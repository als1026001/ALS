import { TestBed } from '@angular/core/testing';

import { BaoCo } from './bao-co';

describe('BaoCo', () => {
    let service: BaoCo;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BaoCo);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
