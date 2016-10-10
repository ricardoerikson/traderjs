import http from 'http';
import GoogleFinanceParser from './parsers/google-finance.js';
import param from 'jquery-param';
import _ from 'lodash';

/**
 * Get a configuration object to be serialized and used in the GET request.
 * @param  {String} options.symbol   - Symbol of the stock in the following format- STOCKEXC:STOCK
 * @param  {Int} options.interval    - Interval in seconds
 * @param  {Int} options.period      - Period of time (ex: 5d - five days, 1Y - one year)
 * @param  {Array} options.fields    - Fields that will be retrieved. ('d' - date, 'o' - open, 'c' - close,
 *                                   'h' - high, 'l' - low, 'v' - volume).
 * @return {Object} JSON Object with the new data.
 */
let getConfigObject = ({symbol,interval, period, fields}) => {
    let f = _.intersection(fields, ['d', 'o', 'h', 'c', 'l', 'v']).join(',');
    let symbols = symbol.split(':');
    let x,q;
    if (symbols.length == 1) {
        [q] = symbols;
    } else {
        [x, q] = symbols;
    }
    let p = period;
    let i = interval;
    return {x, q, f, i, p};
};

class Traderjs {
    constructor() {
        this._config = {interval: 86400, period: '30d', fields: ['d', 'o', 'h', 'c', 'l', 'v']};
        this._writeTo = null;
        this._transformer = null;
    }
    config(config) {
        this._config = config;
        return this;
    }
    writeTo(writeTo) {
        this._writeTo = writeTo;
        return this;
    }
    transformer(transformer) {
        this._transformer = transformer;
        return this;
    }
    do(cb) {
        let options = {
            host: 'www.google.com',
            path: `/finance/getprices?${param(getConfigObject(this._config))}`
        };
        let parser;
        http.get(options, (resp) => {
            resp.setEncoding('utf8');
            resp.on('data', (data) => {
                parser = new GoogleFinanceParser(data);
                parser.parse(cb);
            });
        });

    }
}

export default new Traderjs();
