import {expect} from 'chai';
import Writer from '../transform/writer/writer';

describe('transform/writer/writer.js', () => {

    describe('.write()', () => {

        it('should throw an Error', (done) => {
            let writer = new Writer();
            expect(() => {writer.write();}).to.throw(Error);
            done();
        });

    });

    describe('.filename', () => {

        it('should set and get a value for filename', (done) => {
            let writer = new Writer();
            writer.filename = 'arq.txt';
            expect(writer.filename).to.be.equal('arq.txt');
            done();
        });

    });
});