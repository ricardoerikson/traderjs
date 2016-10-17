import {expect} from 'chai';
import RawTransform from '../transform/raw-transform';
import Writer from '../transform/writer/writer';

describe('transform/raw-transform.js', () => {
    let params = ['date','close','high','low','open','volume'];

    describe('.constructor()', () => {

        it('should have a "newSeparator" property', (done) => {
            let transformer = new RawTransform(['data'], ',', ';');
            expect(transformer.newSeparator).to.be.equal(';');
            done();
        });

        it('should have newSeparator equals to ","', (done) => {
            let transformer = new RawTransform(['data'], ',');
            expect(transformer.newSeparator).to.be.eql(',');
            done();
        });

        it('should have "separator" and "params" properties', (done) => {
            let transformer = new RawTransform(['data'], ',', ';');
            expect(transformer.separator).to.be.eql(',');
            expect(transformer.params).to.be.eql(['data']);
            done();
        });

        it('default constructor should work', (done) => {
            let transformer = new RawTransform();
            expect(transformer.separator).to.be.equal(',');
            expect(transformer.newSeparator).to.be.equal(',');
            expect(transformer.params).to.be.eql(['date','close','high','low','open','volume']);
            done();
        });

    });

    describe('._transformLine()', () => {
        let data = '1,2,3,4,5,6';

        it('should return transformed text using a "comma" separator', (done) => {
            let transformer = new RawTransform(params, ',');
            let transformed = transformer._transformLine(data);
            expect(transformed).to.be.eql('1,2,3,4,5,6');
            done();
        });

        it('should return transformed text using a "comma" separator as passed in the constructor', (done) => {
            let transformer = new RawTransform(params, ',', ',');
            let transformed = transformer._transformLine(data);
            expect(transformed).to.be.eql('1,2,3,4,5,6');
            done();
        });

        it('should return the transformed text using a "semi colon" separator', (done) => {
            let transformer = new RawTransform(params, ',', ';');
            let transformed = transformer._transformLine(data);
            expect(transformed).to.be.eql('1;2;3;4;5;6');
            done();
        });
    });

    describe('.transform()', () => {
        let data = ['1,2,3,4,5,6', '7,8,9,10,11,12'];

        it('transformed array of objects whould have size 2 using "," as new separator', (done) => {
            let transformer = new RawTransform(params, ',', ',');
            transformer.transform(data, (transformed) => {
                expect(transformed).to.have.length(2);
                done();
            });
        });

        it('transformed array of objects whould have size 2 using ";" as new separator', (done) => {
            let transformer = new RawTransform(params, ',', ';');
            transformer.transform(data, (transformed) => {
                expect(transformed).to.have.length(2);
                done();
            });
        });

        it('transformed array of objects whould have size 2 using "," as default new separator', (done) => {
            let transformer = new RawTransform(params, ',');
            transformer.transform(data, (transformed) => {
                expect(transformed).to.have.length(2);
                done();
            });
        });

    });

    describe('.writer', () => {
        let transform = new RawTransform();
        it('should be an instance of Writer', (done) => {
            expect(transform.writer).to.be.an.instanceof(Writer);
            done();
        });
    });


});