# Traderjs

[![Travis CI Build](https://img.shields.io/travis/ricardoerikson/traderjs.svg)](https://travis-ci.org/ricardoerikson/traderjs)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/ricardoerikson/traderjs.svg)](https://codecov.io/github/ricardoerikson/traderjs)
[![Version](https://img.shields.io/npm/v/traderjs.svg)](https://www.npmjs.com/package/traderjs)
[![Downloads](https://img.shields.io/npm/dt/traderjs.svg)](https://npm-stat.com/charts.html?package=traderjs&from=2016-10-10)
[![MIT](https://img.shields.io/npm/l/traderjs.svg)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

TraderJS is JavaScript library that retrieves temporal data which is related to quotes from stock market. The library uses the [Google Finance](http://www.google.com/finance) API to retrieve the temporal data and to parse it into JSON or text format. The quotes can be fetched in the Candle Stick representation and they can be easily stored into text files.

## Installation

This package is distributed via NPM:

```
$ npm install traderjs
```

## Importing the library

If you are going to use the ES6/ES2015 style, you will need to use Babel to transpile your code into ES5. Please, take a look at: [https://babeljs.io/](https://babeljs.io/).

ES6/ES2015 import:

```javascript
import traderjs from 'traderjs';
```

The simplest approach is to use ES5 style. Just import Traderjs using:

```javascript
var traderjs = require('traderjs');
```

## Usage

Traderjs uses fluent interfaces to fetch temporal data. To accomplish this goal, the library follows a few basic steps:

 1. Configure the request.
 2. Setup a transformer.
 3. Retrieve the data.
 4. Define a file to write the content. (optional)

The next sections will show you how perform each of these steps.

### Configuring your request

Traderjs requires you to specify what you want to retrieve before fetch the data. The configuration is simple and you just need to use the method `.config(...)` passing a config object as follows:

```javascript
traderjs
    .config({
        symbol: 'NASD:GOOG', 
        interval: 86400, 
        period: '2d', 
        fields: ['d','o','c','l','h','v']
    })
``` 

The configuration above will retrieve the last two trading days (`period: '2d'`) for the stock `NASD:GOOG` (Google in NASDAQ) using an interval of `86400` seconds between candles (`interval: 86400`). The `fields` that are going to be retrieved by default are:
 
 - `'d'` - date
 - `'o'` - open
 - `'c'` - close
 - `'l'` - low
 - `'h'` - high
 - `'v'` - volume

### Setting a transformer

Traderjs will transform the retrieved data so that you can easily use it in other tools. There are two types of transformers: `'json'`, which will convert your data to a JSON representation; and `'raw'`, which will convert your data to text with columns and rows.

In the piece of code bellow it's shown how to convert the data into the JSON format.

```javascript
var traderjs = require('traderjs');

var configuration = {
    symbol: 'NASD:GOOG',
    interval: 86400,
    period: '2d',
    fields: ['d','o','c','l','h','v']
};

traderjs
    .config(configuration)
    .transformer('json') // Converts the data to JSON

    /* the result of the request should be an Array of objects
    like this:
    [
        {
            "date": "1475784000000",
            "close": "776.86",
            "high": "780.48",
            "low": "775.54",
            "open": "779",
            "volume": "1070692"
        },
        {
            "date": "1475870400000",
            "close": "775.08",
            "high": "779.66",
            "low": "770.75",
            "open": "779.66",
            "volume": "933158"
        }
    ]
     */
``` 

The data can also be presented in text format. The result of the request will be an Array of strings, in which each element is a quote with colon separated values. By default, the values of each element have the following labels: `'date'`, `'close'`, `'high'`, `'low'`, `'open'`, '`volume`'. The text representation can be obtained as bellow:

```javascript
var traderjs = require('traderjs');

traderjs
    .config(configuration)
    .transformer('raw') // Converts the data to text

    /* Each element of the array is quote with colon separated values

    ['1475784000000,776.86,780.48,775.54,779,1070692',
     '1475870400000,775.08,779.66,770.75,779.66,933158']

    */
```

### Retrieving the data

It's important to notice that the data will be retrieved only after you call the method `.temporal(...)`, which accepts a callback that is called only after the data has been retrieved.

The piece of code bellow shows how to get the data:

```javascript
traderjs
    .config(configuration)
    .transformer('json')
    .temporal(function(data) {
        /* The variable received in the callback (data)
        will contain the output in the required format (JSON).
        [
            {
                "date": "1475784000000",
                "close": "776.86",
                "high": "780.48",
                "low": "775.54",
                "open": "779",
                "volume": "1070692"
            },
            ...
        ]
        */
    });
```

### Defining a file to write the content (optional)

The content will only be written to a file if you specify the filename by using the `.writeTo(...)` method. Just give the filename as a string, as the piece of code below:

```javascript
traderjs.
    .config(configuration)
    .transformer('raw')
    .writeTo('/tmp/quotes.dat')
    .temporal(function(data) {
        /* 
        You will receive the content in the variable called 'data'
        and it will also be written in the file /tmp/quotes.dat
        */
    });
```

The format of the content that is written to the file depends on the transformer that you are using. A `'raw'` transformer will imply that each item of the array of data will be a line (with colon separated values) of the file. A file create using the `'raw'` transformer will have the following format:

```
1475784000000,776.86,780.48,775.54,779,1070692
1475870400000,775.08,779.66,770.75,779.66,933158
...
```

The content of a file created with a `'json'` transformer will have the following format:

```
[{"date": "1475784000000", "close": "776.86", "high": "780.48", "low": "775.54", "open": "779", "volume": "1070692"}, {"date": "1475870400000", "close": "775.08", "high": "779.66", "low": "770.75", "open": "779.66", "volume": "933158"} ]
```

## License

MIT License 2016 © Ricardo Erikson and [contributors](https://github.com/ricardoerikson/traderjs/graphs/contributors)