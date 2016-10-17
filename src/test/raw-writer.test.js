import RawWriter from '../transform/writer/raw-writer';
import {expect} from 'chai';
import fs from 'fs';

describe('transform/writer/raw-writer.js', () => {

    let tempFolder;
    before((done) => {
        fs.mkdtemp('/tmp/', (err, folder) => {
            tempFolder = folder;
            done();
        });
    });

    describe('RawWriter', () => {

        describe('.write()', () => {

            it('should write to a file', (done) => {
                let content = ['1,2,3,4,5,6', '7,8,9,10,11,12'];
                let file = tempFolder.concat('/file.dat');
                let rawWriter = new RawWriter();
                rawWriter.filename = file;
                rawWriter.write(content, () => {
                    fs.readFile(file, 'utf8', (err, data) => {
                        let expected = ['1,2,3,4,5,6', '7,8,9,10,11,12', ''];
                        let actual = data.toString().split(`\n`);
                        expect(actual).to.be.eql(expected);
                        done();
                    });
                });
            });

            it('should accept only Array as content', (done) => {
                let content = '1,2,3,4,5,6';
                let file = tempFolder.concat('/file.dat');
                let rawWriter = new RawWriter();
                rawWriter.filename = file;
                expect(() => {rawWriter.write(content, null);}).to.throw(TypeError);
                done();
            });

        });

    });

});