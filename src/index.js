import http from 'http';
import GoogleFinanceParser from './parsers/google-finance.js';
import JsonTransform from './transform/json-transform';
import RawTransform from './transform/raw-transform';
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

let stockSymbols = (symbol) => {
    if(symbol.indexOf(':') == -1) {
        symbol = ':'.concat(symbol);
    }
    let [x,q] = symbol.split(':');
    x = x || undefined;
    return {x,q};
};

let configObject = ({symbol,interval, period, fields}) => {
    let f = _.intersection(fields, ['d', 'o', 'h', 'c', 'l', 'v']).join(',');
    let {x,q} = stockSymbols(symbol);
    let p = period;
    let i = `${interval}`;
    return _({x, q, f, i, p})
        .omitBy(_.isNil)
        .omitBy(_.isEmpty)
        .value();
};

class Traderjs {
    constructor() {
        this._config = {interval: 86400, period: '30d', fields: ['d', 'o', 'h', 'c', 'l', 'v']};
        this._writeTo = null;
        this._transformer = new JsonTransform();
    }
    config(config) {
        this._config = config;
        return this;
    }
    writeTo(writeTo) {
        this._writeTo = writeTo;
        return this;
    }
    /**
     * Define a transformer to transform the data into a specific format
     * @param  {string}    type - 'json' or 'raw' (text)
     * @param  {...string} args - arguments that will be passed to the constructor
     *                          of the transformer.
     */
    transformer(type,...args) {
        type = _.toUpper(type);
        if(_.isEqual(type, 'JSON')) {
            this._transformer = new JsonTransform(...args);
        } else if (_.isEqual(type, 'RAW')) {
            this._transformer = new RawTransform(...args);
        } else {
            throw Error('Type should be either "json" or "raw"');
        }
        return this;
    }
    temporal(cb) {
        let options = {
            host: 'www.google.com',
            path: `/finance/getprices?${param(configObject(this._config))}`
        };
        http.get(options, (resp) => {
            let content = '';
            resp.setEncoding('utf8');

            resp.on('data', (data) => {
                content = content.concat(data);
            });

            resp.on('end', () => {
                let parser = new GoogleFinanceParser(content);
                parser.parse((data) => {
                    this._transformer.transform(data.data, (transformedData) => {
                        if (this._writeTo !== null) {
                            let writer = this._transformer.writer;
                            writer.filename = this._writeTo;
                            writer.write(transformedData, () => {
                                cb(transformedData, this._writeTo);
                            });
                        }
                        if (this._writeTo === null) {
                            cb(transformedData);
                        }
                    });
                });
            });
        });

    }
}

export default (new Traderjs());
