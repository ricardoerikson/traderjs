import Transform from './transform';
import JsonWriter from './writer/json-writer';
import _ from 'lodash';

export default class JsonTransform extends Transform {
    constructor(params=['date','close','high','low','open','volume'], separator=',') {
        super(params, separator);
        this._writer = new JsonWriter();
    }
    _transformLine(line) {
        let fields = line.split(this.separator);
        let object = _.zipObject(this.params, fields);
        return object;
    }
    transform(data, cb) {
        let object = [];
        for (let i = 0; i < data.length; i++) {
            object.push(this._transformLine(data[i]));
        }
        cb(object);
    }
}