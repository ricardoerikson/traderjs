import JsonTransform from '../transform/json-transform';
import {expect} from 'chai';

describe('transform/json-transform.js', () => {
    describe('constructor()', () => {

        it('should create an object and access its properties', (done) => {
            let transform = new JsonTransform(['HIGH', 'LOW', 'OPEN', 'CLOSE', 'VOLUME', 'DATE'], ',');
            expect(transform.separator).to.be.eql(',');
            expect(transform.params).to.be.eql(['HIGH', 'LOW', 'OPEN', 'CLOSE', 'VOLUME', 'DATE']);
            done();
        });

        it('should also with with no parameters in the constructor of JsonTransform', (done) => {
            let transform = new JsonTransform();
            expect(transform.separator).to.be.eql(',');
            expect(transform.params).to.be.eql(['date','close','high','low','open','volume']);
            done();
        });

        it('should care about case in parameters', (done) => {
            let transform = new JsonTransform(['date','close','high','low','open','volume'], ',');
            expect(transform.params).to.not.eql(['DATE','CLOSE','HIGH','LOW','OPEN','VOLUME']);
            done();
        });

    });

    describe('._transformLine()', () => {

        it('should return an object with properties', (done) => {
            let line = '1475784000000,776.86,780.48,775.54,779,1070692';
            let params = ['date','close','high','low','open','volume'];
            let transform = new JsonTransform(params, ',');
            let object = transform._transformLine(line);
            expect(object).to.have.all.keys('date','close','high','low','open','volume');
            expect(object).to.have.deep.property('date', '1475784000000');
            expect(object).to.have.deep.property('volume', '1070692');
            done();
        });

        it('should not throw an error when accessing the overwritten method JsonTransform._transformLine()', (done) => {
            let jsonTransform = new JsonTransform(['high'], ',');
            expect(() => jsonTransform._transformLine('')).not.to.throw(Error);
            done();
        });

    });

    describe('.transform()', () => {

        let data = ['1475784000000,776.86,780.48,775.54,779,1070692', '1,2,3,4,5,6'];
        let transform = new JsonTransform();

        it('should return an array of objects', (done) => {
            transform.transform(data, (object) => {
                expect(object).to.be.an('Array');
                expect(object).to.have.length(2);
                done();
            });
        });

        it('each object should have keys and values', (done) => {
            transform.transform(data, (object) => {
                expect(object).to.have.deep.property('[0].date', '1475784000000');
                expect(object).to.have.deep.property('[0].close', '776.86');
                expect(object).to.have.deep.property('[0].high', '780.48');
                expect(object).to.have.deep.property('[0].low', '775.54');
                expect(object).to.have.deep.property('[0].open', '779');
                expect(object).to.have.deep.property('[0].volume', '1070692');
                expect(object).to.have.deep.property('[1].date', '1');
                expect(object).to.have.deep.property('[1].volume', '6');
                done();
            });
        });
    });
});