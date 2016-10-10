/**
 * Parser for Google Finance
 * @class GoogleFinanceParser
 *
 */
export default class GoogleFinanceParser {
    /**
     * Create a parser
     * @constructs Parser
     * @param  {string} rawData - Data to be parsed
     */
    constructor(rawData) {
        this.raw = rawData;
    }
    /**
     * Retrieves columns with the data
     * @return {Array} Array with the columns (ex: high, low, open, close)
     */
    _columns() {
        const regex = /^COLUMNS=([\w,]*)/m;
        let result = regex.exec(this.raw);
        return result[1].split(',');
    }
    /**
     * Retrieves the interval size used to create the stock data
     * @return {Int} Interval size in seconds
     */
    _interval() {
        const regex = /^INTERVAL=(\d*)/gm;
        let result, line;
        while((line = regex.exec(this.raw)) !== null) {
            result = line;
        }
        return parseInt(result[1]);
    }
    /**
     * Get the starting timestamp of the temporal data in ms
     * @param  {String} line - The first line of data where the timestamp
     *                       (in seconds) starts with 'a'
     * @return {Int} Timestamp in milliseconds
     */
    _getStartingTimestamp(line) {
        line = line.split(',');
        return parseInt(line[0].substring(1)) * 1000;
    }
    /**
     * Set the timestamp to other lines
     * @param {String} line - Line with data
     * @param {Int} start - Starting timestamp in ms
     * @param {Int} interval - Interval size in ms
     */
    _setTimestamp(line, interval) {
        let cols = line.split(',');
        if (cols[0].startsWith('a')) {
            cols[0] = this._getStartingTimestamp(line);
            this.startingTimestamp = cols[0];
        } else {
            cols[0] = parseInt(cols[0]) * interval + this.startingTimestamp;
        }
        return cols.join(',');
    }
    /**
     * Parses the data all at once
     * @param  {GoogleFinanceParser~sendDataCallback} cb - A callback that passes the resulting values.
     */
    _data(cb) {
        const regex = /(^[a\d][\d,\.]*)/gm;
        let line = regex.exec(this.raw);
        let interval = this._interval();
        let columns = this._columns();

        let result = [];
        while(line !== null) {
            let values = this._setTimestamp(line[0], interval * 1000);
            result.push(values);
            line = regex.exec(this.raw);
        }
        cb(result, columns, interval, this.startingTimestamp || 0);
    }

    /**
     * Public interface to parse data
     * @param  {GoogleFinanceParser~parserCallback} cb - Callback to handle data
     */
    parse(cb) {
        this._data((data, columns, interval, startingTimestamp) => {
            cb({data, columns, interval, startingTimestamp});
        });
    }

    /**
     * Callback to handle data parsing in the public interface.
     * @callback GoogleFinanceParser~parserCallback
     * @param {Object} Object with the following data {data, columns,
     * interval, startingTimestamp}
     */

    /**
     * Callback to handle data parsing
     * @callback GoogleFinanceParser~sendDataCallback
     * @param {Array} data - Array of data
     * @param {Array} columns - Array with the columns that were retrieved
     * @param {Int} interval - Interval size in milliseconds
     * @param {Int} startingTimestamp - Starting timestamp
     */
}