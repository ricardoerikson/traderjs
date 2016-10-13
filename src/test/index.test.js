import {expect, should} from 'chai';
import {traderjs, configObject} from '../index';
import JsonTransform from '../transform/json-transform';
import nock from 'nock';
import fs from 'fs';

should();

describe('index.js', () => {

    describe('Traderjs.config()', () => {

        before((done) => {
            fs.readFile(`${__dirname}/../data/nasd-goog-2-86400-2d-doclhv.txt`, 'utf8', (err, data) => {
                nock('http://www.google.com')
                    .persist()
                    .filteringPath(/[xqifp]=[^&]*/g)
                    .get('/finance/getprices')
                    .query(true)
                    .reply(200, data);
                done();
            });
        });

        after((done) => {
            nock.cleanAll();
            done();
        });

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

    describe('.transformer()', () => {
        before((done) => {
            fs.readFile(`${__dirname}/../data/nasd-goog-1-86400-2d-doclhv.txt`, 'utf8', (err, data) => {
                nock('http://www.google.com')
                    .persist()
                    .filteringPath(/[xqifp]=[^&]*/g)
                    .get('/finance/getprices')
                    .query(true)
                    .reply(200, data);
                done();
            });
        });

        after((done) => {
            nock.cleanAll();
            done();
        });

        let config = {symbol: 'NASD:GOOG', interval: 86400, period: '2d', fields: ['d','o','c','l','h','v'] };

        it('should return an array of objects', (done) => {
            traderjs
                .config(config)
                .transformer(new JsonTransform())
                .do((data) => {
                    expect(data).to.have.length(2);
                    done();
                });
        });

        it('should return an array of objects with keys and values', (done) => {
            traderjs
                .config(config)
                .transformer(new JsonTransform())
                .do((data) => {
                    expect(data).to.have.deep.property('[0].date', '1475784000000');
                    expect(data).to.have.deep.property('[1].volume', '933158');
                    done();
                });
        });

        it('should throw a TypeError', (done) => {
            class A {}
            let a = new A();
            expect(() => {traderjs.transform(a);}).to.throw(TypeError);
            done();
        });

    });

});
