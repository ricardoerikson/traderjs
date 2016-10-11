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

    describe('.transform()', () => {

        it('should return an object with properties', (done) => {
            let line = '1475784000000,776.86,780.48,775.54,779,1070692';
            let params = ['date','close','high','low','open','volume'];
            let transform = new JsonTransform(params, ',');
            let object = transform.transform(line);
            expect(object).to.have.all.keys('date','close','high','low','open','volume');
            expect(object).to.have.deep.property('date', '1475784000000');
            expect(object).to.have.deep.property('volume', '1070692');
            done();
        });

        it('should not throw an error when accessing the overwritten method JsonTransform.transform()', (done) => {
            let jsonTransform = new JsonTransform(['high'], ',');
            expect(() => jsonTransform.transform('')).not.to.throw(Error);
            done();
        });

    });
});