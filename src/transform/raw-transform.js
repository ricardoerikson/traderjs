import Transform from './transform';
import RawWriter from './writer/raw-writer';
import _ from 'lodash';

export default class RawTransform extends Transform {
    constructor(params=['date','close','high','low','open','volume'], separator=',', newSeparator=',') {
        super(params, separator);
        this._newSeparator = newSeparator;
        this._writer = new RawWriter();
    }
    get newSeparator() {
        return this._newSeparator;
    }
    _transformLine(line) {
        let columns = _.split(line, this.separator);
        return _.join(columns, this.newSeparator);
    }
    transform(data, cb) {
        let object = [];
        for (let i = 0; i < data.length; i++) {
            object.push(this._transformLine(data[i]));
        }
        cb(object);
    }

}