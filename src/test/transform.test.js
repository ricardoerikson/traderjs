import Transform from '../transform/transform';
import Writer from '../transform/writer/writer';
import {expect} from 'chai';

describe('transform/transform.js', () => {

    describe('.constructor()', () => {

        it('should work with no parameters in the constructor of Transform', (done) => {
            let transform = new Transform();
            expect(transform.separator).to.be.eql(',');
            expect(transform.params).to.be.eql(['date','close','high','low','open','volume']);
            done();
        });

    });

    describe('._transformLine()', () => {

        it('should throw an error calling Transform._transformLine()', (done) => {
            let transform = new Transform(['high'], ',');
            expect(() => transform._transformLine('')).to.throw(Error);
            done();
        });

    });

    describe('.transform()', () => {

        it('should throw an error when calling Transform.transform()', (done) => {
            let transform = new Transform();
            expect(() => transform.transform(null, ()=>{ return ''; })).to.throw(Error);
            done();
        });
    });

    describe('.writer', () => {

        it('should be null', (done) => {
            let transform = new Transform();
            expect(transform.writer).to.be.null;
            done();
        });

        it('should throw an Error', (done) => {
            let transform = new Transform();
            expect(() => {transform.writer = 'something';}).to.throw(Error);
            done();
        });

        it('should not throw Error', (done) => {
            let transform = new Transform();
            let writer = new Writer();
            expect(() => {transform.writer = writer;}).not.to.throw(Error);
            done();
        });
    });
});