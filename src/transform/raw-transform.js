import Transform from './transform';

export default class RawTransform extends Transform{
    constructor(params=['date','close','high','low','open','volume'], separator=',', newSeparator=',') {
        super(params, separator);
        this._newSeparator = newSeparator;
    }
    get newSeparator() {
        return this._newSeparator;
    }
    _transformLine(line) {
        let columns = line.split(this.separator);
        return columns.join(this.newSeparator);
    }
    transform(data, cb) {
        let object = [];
        for (let i = 0; i < data.length; i++) {
            object.push(this._transformLine(data[i]));
        }
        cb(data);
    }

}