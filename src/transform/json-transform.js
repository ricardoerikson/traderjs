import Transform from './transform';
import _ from 'lodash';

export default class JsonTransform extends Transform {
    constructor(params=['date','close','high','low','open','volume'], separator=',') {
        super(params, separator);
    }
    transform(line) {
        let fields = line.split(this.separator);
        let object = _.zipObject(this.params, fields);
        return object;
    }
}