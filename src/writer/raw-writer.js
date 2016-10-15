import Writer from './writer';

/**
 * @classdesc Class to write raw data to a file.
 * @class
 * @augments Writer
 */
export default class RawWriter extends Writer {

    /**
     * Write content to a file.
     * @param  {Arra}   content - Array containing each line to be written.
     * @param  {Function} cb      - Callback function that called after the content has been written.
     */
    write(content, cb) {
        if (!(content instanceof Array)) {
            throw TypeError('Should be an array.');
        }
        let stream = this._fsObject.createWriteStream(this.filename, { encoding: 'utf8' });
        for (let i = 0; i < content.length; i++) {
            stream.write(content[i].concat(`\n`));
        }
        stream.end(() => {
            cb();
        });
    }

}