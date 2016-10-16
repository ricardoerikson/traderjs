import Writer from './writer';

/**
 * @classdesc Specific writer for JSON content.
 * @class
 * @augments Writer
 */
export default class JsonWriter extends Writer {

    /**
     * @inheritdoc
     * @override
     */
    write(content, cb) {
        this._fsObject.writeFile(this.filename, JSON.stringify(content), () => {
            // if (err) throw err;
            cb();
        });
    }
}