import JsonWriter from '../transform/writer/json-writer';
import {expect} from 'chai';
import fs from 'fs';

describe('transform/writer/json-writer.js', () => {
    let tempFolder;
    before((done) => {
        fs.mkdtemp('/tmp/', (err, folder) => {
            tempFolder = folder;
            done();
        });
    });

    describe('JsonWriter', () => {

        describe('.constructor()', () => {
            it('should set the values of the properties', (done) => {
                let jsonWriter = new JsonWriter();
                jsonWriter.filename = 'file.txt';
                expect(jsonWriter.filename).to.be.eql('file.txt');
                jsonWriter.filename = 'file2.txt';
                expect(jsonWriter.filename).to.be.eql('file2.txt');
                done();
            });
        });

        describe('.write()', () => {

            it('should write the object to a file', (done) => {
                let content = {a: 1, b: 2, c: 3};
                let filename = tempFolder+ '/object.json';
                let jsonWriter = new JsonWriter();
                jsonWriter.filename = filename;
                jsonWriter.write(content, () => {
                    fs.readFile(filename, 'utf8', (err, data) => {
                        if (err) throw err;
                        expect(data).to.be.eql('{"a":1,"b":2,"c":3}');
                        done();
                    });
                });
            });

            it('should write the the array to a file', (done) => {
                let content = [{a: 1, b: 2}, {c: 3}];
                let filename = tempFolder+ '/array.json';
                let jsonWriter = new JsonWriter();
                jsonWriter.filename = filename;
                jsonWriter.write(content, () => {
                    fs.readFile(filename, 'utf8', (err, data) => {
                        if (err) throw err;
                        expect(data).to.be.eql('[{"a":1,"b":2},{"c":3}]');
                        done();
                    });
                });
            });

        });

    });
});