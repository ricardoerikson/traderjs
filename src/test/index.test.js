import {expect, should} from 'chai';
import {traderjs, configObject} from '../index';


should();

describe('index.js', () => {
    describe('Traderjs.config()', () => {
        it('should retrieve data using STOCKEXC:STOCK as symbol', (done) => {
            traderjs
                .config({symbol: 'NASD:GOOG', interval: 86400, period: '2d', fields: ['d','o','c','l','h','v'] })
                .do((data) => {
                    expect(data).not.be.null;
                    done();
                });
        });
        it('should retrieve data using only STOCK as symbol', (done) => {
            traderjs
                .config({symbol: 'GOOG', interval: 86400, period: '2d', fields: ['d','o','c','l','h','v'] })
                .do((data) => {
                    expect(data).not.be.null;
                    done();
                });
        });
    });

    describe('.configObject()', () => {
        it('should return object with the following attributes: [q,x]', (done) => {
            let params = configObject({symbol: 'NASD:GOOG'});
            params.should.have.all.keys('x','q');
            done();
        });

        it('should return object with only attribute q', (done) => {
            let params = configObject({symbol: 'GOOG'});
            expect(params['q']).not.to.be.null;
            expect(params['q']).not.to.be.undefined;
            params.should.not.have.any.keys('i', 'p', 'x', 'f');
            done();
        });
    });

});
