export default class Transform {
    constructor(params=['date','close','high','low','open','volume'], separator=',') {
        this._params = params;
        this._separator = separator;
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
}