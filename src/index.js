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
    let [x,q] = symbol.split(':');
    let p = period;
    let i = interval;
    return {x, q, f, i, p};
};

export let prices = (config, cb) => {
    let options = {
        host: 'www.google.com',
        path: `/finance/getprices?${param(getConfigObject(config))}`
    };
    let parser;
    http.get(options, (resp) => {
        resp.setEncoding('utf8');
        resp.on('data', (data) => {
            parser = new GoogleFinanceParser(data);
            parser.parse(cb);
        });
    });
};


