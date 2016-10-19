import {expect, should} from 'chai';
import traderjs from '../index';
import nock from 'nock';
import fs from 'fs';
import dd from 'debug';

should();

describe('index.js', () => {

    let config = {symbol: 'NASD:GOOG', interval: 86400, period: '2d', fields: ['d','o','c','l','h','v'] };

    describe('.config()', () => {

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
                .temporal((data) => {
                    expect(data).not.be.null;
                    done();
                });
        });
        it('should retrieve data using only STOCK as symbol', (done) => {
            traderjs
                .config({symbol: 'GOOG', interval: 86400, period: '2d', fields: ['d','o','c','l','h','v'] })
                .temporal((data) => {
                    expect(data).not.be.null;
                    done();
                });
        });
    });

    describe('.config() with long periods', () => {

        before((done) => {
            fs.readFile(`${__dirname}/../data/bvmf-petr4-1-86400-30d-doclhv.txt`, 'utf8', (err, data) => {
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

        it('should not have length 29', (done) => {
            traderjs
                .config({symbol: 'BVMF:PETR4', interval: 86400, period: '30d', fields: ['d','o','c','l','h','v'] })
                .transformer('json')
                .temporal( (data) => {
                    expect(data).to.have.length(29);
                    done();
                });
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

        it('should throw a TypeError', (done) => {
            expect(() => {traderjs.transformer(1);}).to.throw(Error);
            done();
        });

        it('should return an array of objects having length 2', (done) => {
            traderjs
                .config(config)
                .transformer('json')
                .temporal((data) => {
                    expect(data).to.have.length(2);
                    expect(data[0]).to.be.an('object');
                    done();
                });
        });

        it('should return an array of strings having length 2', (done) => {
            traderjs
                .config(config)
                .transformer('raw')
                .temporal((data) => {
                    expect(data).to.have.length(2);
                    expect(data[0]).to.be.a('string');
                    done();
                });
        });

        it('should return an array of strings with separator ";"', (done) => {
            let params = ['date','close','high','low','open','volume'];
            traderjs
                .config(config)
                .transformer('raw', params, ',', ';')
                .temporal((data) => {
                    expect(data).to.have.deep.property('[0]', '1475784000000;776.86;780.48;775.54;779;1070692');
                    done();
                });
        });

        it('should return an array of objects with keys and values', (done) => {
            traderjs
                .config(config)
                .transformer('json')
                .temporal((data) => {
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

    describe('.writer()', () => {
        let tempFolder = null;
        before((done) => {
            fs.readFile(`${__dirname}/../data/nasd-goog-1-86400-2d-doclhv.txt`, 'utf8', (err, data) => {
                nock('http://www.google.com')
                    .persist()
                    .filteringPath(/[xqifp]=[^&]*/g)
                    .get('/finance/getprices')
                    .query(true)
                    .reply(200, data);
                fs.mkdtemp('/tmp/', (err, folder) => {
                    tempFolder = folder;
                    done();
                });
            });
        });

        it('should create a file with content in JSON format', (done) => {
            let file = tempFolder.concat('/file.json');
            traderjs
                .config(config)
                .transformer('json')
                .writeTo(file)
                .temporal((transformedData, filename) => {
                    expect(transformedData).to.have.length(2);
                    expect(file).to.be.eql(filename);
                    dd('app:writer')('file has been written to: ' + filename);
                    fs.readFile(file, 'utf8', (err, data) => {
                        let jsonData = JSON.parse(data);
                        expect(jsonData).to.have.length(2);
                        expect(jsonData).to.have.deep.property('[0].date', '1475784000000');
                        expect(jsonData).to.have.deep.property('[1].volume', '933158');
                        done();
                    });
                });
        });

        it('should create a file with content in raw text format', (done) => {
            let file = tempFolder.concat('/file.dat');
            traderjs
                .config(config)
                .transformer('raw')
                .writeTo(file)
                .temporal((transformedData, filename) => {
                    expect(transformedData).to.have.length(2);
                    expect(filename).to.be.eql(file);
                    dd('app:writer')('file has been written to: ' + filename);
                    fs.readFile(file, 'utf8', (err, data) => {
                        expect(data.split(`\n`)).to.have.length(3);
                        expect(data.split(`\n`)).to.have.deep.property('[0]','1475784000000,776.86,780.48,775.54,779,1070692');
                        done();
                    });
                });
        });

    });

});
