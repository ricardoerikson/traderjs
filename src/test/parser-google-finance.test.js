import {expect, should} from 'chai';
import fs from 'fs';
import GoogleFinanceParser from '../parsers/google-finance.js';

should();

describe('parsers/google-finance.js', () => {

    // 86400s interval - 2 days - DATE,OPEN,CLOSE,LOW,HIGH,VOLUME
    describe('NASD:GOOG-1', () => {
        let finance;
        before((done) => {
            fs.readFile(`${__dirname}/../data/nasd-goog-1-86400-2d-doclhv.txt`, 'utf8', (err, data) => {
                finance = new GoogleFinanceParser(data);
                done();
            });
        });

        describe('.parse()', () => {
            it('should expect columns to be [DATE,CLOSE,HIGH,LOW,OPEN,VOLUME]', (done) => {
                finance.parse(({columns}) => {
                    expect(columns).to.be.eql(['DATE','CLOSE','HIGH','LOW','OPEN','VOLUME']);
                    expect(columns).to.have.length(6);
                    done();
                });
            });

            it('should expect starting timestamp to be 1475784000000', (done) => {
                finance.parse(({startingTimestamp}) => {
                    expect(startingTimestamp).to.be.eql(1475784000000);
                    done();
                });
            });

            it('starting timestamp from data should be equal to 1475784000000', (done) => {
                finance.parse(({data}) => {
                    let startDate = data[0].split(',')[0];
                    expect(startDate).to.be.equal('1475784000000');
                    done();
                });
            });

            it('timestamp on second line should be 1475870400000', (done) => {
                finance.parse(({data}) => {
                    let secondDate = data[1].split(',')[0];
                    expect(secondDate).to.be.eql('1475870400000');
                    done();
                });
            });

            it('volume should be 1070692 on the fist line', (done) => {
                finance.parse(({data}) => {
                    let firstVolume = data[0].split(',')[5];
                    expect(firstVolume).to.be.eql('1070692');
                    done();
                });
            });
        });

    });

    describe('NASD:GOOG-2', () => {
        let finance;
        before((done) => {
            // Empty data
            fs.readFile(`${__dirname}/../data/nasd-goog-2-86400-2d-doclhv.txt`, 'utf8', (err, data) => {
                finance = new GoogleFinanceParser(data);
                done();
            });
        });
        describe('.parse()', () => {
            it('data should be empty', function (done) {
                finance.parse(({data}) => {
                    data.should.be.empty;
                    done();
                });
            });
        });

    });

});

