import Transform from '../transform/transform';
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
});