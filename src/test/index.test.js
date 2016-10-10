import {expect, should} from 'chai';
import * as traderjs from '../index';

should();

describe('index.js', () => {
    describe('.prices()', () => {
        it('should retrieve NASD:GOOG - 2d - 86400', (done) => {
            let config = {
                symbol: 'NASD:GOOG',
                interval: 86400,
                period: '2d',
                fields: ['d','o','c','l','h','v']
            };
            traderjs.prices(config, (data) => {
                data.should.not.be.null;
                data.data.should.have.length(2);
                expect(data.columns).to.be.eql(['DATE','CLOSE','HIGH','LOW','OPEN','VOLUME']);
                done();
            });
        });

    });
});
