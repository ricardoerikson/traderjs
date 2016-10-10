import {expect, should} from 'chai';
import traderjs from '../index';

should();

describe('index.js', () => {
    describe('fluent interface', () => {
        it('should retrieve NASD:GOOG - 2d - 86400', (done) => {
            let config = {
                symbol: 'NASD:GOOG',
                interval: 86400,
                period: '2d',
                fields: ['d','o','c','l','h','v']
            };
            traderjs
                .config(config)
                .writeTo('nasd-goog.txt')
                .transformer(null)
                .do((data) => {
                    data.should.not.be.null;
                    expect(data.columns).to.be.eql(['DATE','CLOSE','HIGH','LOW','OPEN','VOLUME']);
                    done();
                });
        });
        it('should retrieve with only stock symbol', (done) => {
            let config = {
                symbol: 'GOOG',
                interval: 86400,
                period: '2d',
                fields: ['d','o','c','l','h','v']
            };
            traderjs
                .config(config)
                .writeTo('nasd-goog.txt')
                .transformer(null)
                .do((data) => {
                    data.should.not.be.null;
                    expect(data.columns).to.be.eql(['DATE','CLOSE','HIGH','LOW','OPEN','VOLUME']);
                    done();
                });
        });
    });
});
