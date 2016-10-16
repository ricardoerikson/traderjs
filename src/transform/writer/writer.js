import fs from 'fs';

/**
 * @classdesc Abstract class for writers. Other classes
 *            should extend this one.
 * @class
 */
export default class Writer {
    constructor() {
        this._fsObject = fs;
    }
    get filename() {
        return this._filename;
    }
    set filename(value) {
        this._filename = value;
    }
    /**
     * Write the content to a file
     * @param  {Object}   content - Json Object
     * @param  {Function} cb      - callback function that is
     *                            called after the content has been written.
     */
    write() {
        throw new Error('Should be overwritten.');
    }
}