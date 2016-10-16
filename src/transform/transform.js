import Writer from './writer/writer';

export default class Transform {
    constructor(params=['date','close','high','low','open','volume'], separator=',') {
        this._params = params;
        this._separator = separator;
        this._writer = null;
    }
    get params() {
        return this._params;
    }
    get separator() {
        return this._separator;
    }
    _transformLine() {
        throw new Error('You should overwrite this method');
    }
    transform() {
        throw new Error('You should overwrite this method');
    }
    set writer(value=null) {
        if (!((value instanceof Writer) || (value === null))) {
            throw Error('Should be either null or an instance of Writer');
        }
        this._writer = value;
    }
    get writer() {
        return this._writer;
    }
}