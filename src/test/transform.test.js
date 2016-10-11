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

    describe('.transform()', () => {

        it('should throw an error calling Transform.transform()', (done) => {
            let transform = new Transform(['high'], ',');
            expect(() => transform.transform('')).to.throw(Error);
            done();
        });

    });
});