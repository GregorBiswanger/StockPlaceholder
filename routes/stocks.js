const express = require('express');
const router = express.Router();

const moment = require('moment-timezone');

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     tags:
 *       - Stocks
 *     description: Returns all stock data
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all stock data
 *         schema:
 *           $ref: '#/definitions/query'
 */
router.get('/', (request, response, next) => {
  response.json(getSampleStockData());
});

/**
 * @swagger
 * /api/stocks/{symbolname}:
 *   get:
 *     tags:
 *       - Stocks
 *     description: Returns a collection of stocks
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: "symbolname"
 *       in: "path"
 *       required: true
 *       type: "array"
 *       items:
 *           type: "string"
 *     responses:
 *       200:
 *         description: A collection of stocks
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: '#/definitions/quote'
 */
router.get('/:symbols*', (request, response, next) => {
  let symbols = [request.params.symbols].concat(request.params[0].split('/').slice(1));
  let stocks = [];

  if (symbols[0].indexOf(',') > -1) {
    symbols = symbols[0].split(',');
  }

  symbols.forEach(name => {
    const stock = getSampleStockData().query.results.quote.find(x => x.symbol.toUpperCase() == name.toUpperCase());
    if (stock) {
      stocks.push(stock);
    }
  });

  if (stocks.length === 0) {
    stocks = { error: 'no results for ' + symbols.join(', ') }
  }

  response.json(stocks);
});

function getSampleStockData() {
  const stocks = {
    "query": {
      "count": 6,
      "created": moment().tz('Europe/Berlin').format(),
      "lang": "de-DE",
      "results": {
        "quote": [
          generateQuote('MSFT', 'Microsoft Corporation'),
          generateQuote('AAPL', 'Apple Inc.'),
          generateQuote('GOOGL', 'Alphabet Inc.'),
          generateQuote('YHOO', 'Yahoo Inc.'),
          generateQuote('DAX', 'Horizons DAX Germany ETF'),
          generateQuote('INTC', 'Intel Corporation'),
          generateQuote('FB2A', 'Facebook Inc.')
        ]
      }
    }
  }

  return stocks;
}

function generateQuote(symbolname, name) {
  const todayDate = moment().tz('Europe/Berlin').format('MM/D/YYYY');
  const lastTradeTime = moment().tz('Europe/Berlin').format('h:ma');
  const lastTradePriceOnly = (Math.random() * (999.00 - 00)).toFixed(2);
  const state = (Math.random() * (1 - 0)).toFixed(0) == 1 ? '+' : '-';
  const change = (Math.random() * (10.00 - 00)).toFixed(2);
  const changeinPercent = (Math.random() * (1.00 - 0)).toFixed(2);

  return {
    "symbol": symbolname,
    "name": name,
    "change": state + change,
    "currency": "USD",
    "lastTradeDate": todayDate,
    "lastTradePriceOnly": lastTradePriceOnly,
    "changeinPercent": state + changeinPercent + "%",
    "lastTradeTime": lastTradeTime
  }
}

/**
 * @swagger
 * definitions:
 *  quote:
 *     properties:
 *       symbol:
 *         type: "string"
 *         description: "A stock symbol is a unique series of letters assigned to a security for trading purposes."
 *       change:
 *         type: "string"
 *       currency:
 *         type: "string"
 *       lastTradeDate:
 *         type: "string"
 *       lastTradePriceOnly:
 *         type: "integer"
 *       name:
 *         type: "string"
 *       changeinPercent:
 *         type: "string"
 *       lastTradeTime:
 *         type: "string"
 *  query:
 *      properties:
 *        count:
 *          type: "integer"
 *          description: "Number of stocks"
 *        created:
 *          type: "string"
 *          description: "Datetime"
 *        lang:
 *          type: "string"
 *          description: "location from stock data state"
 *        results:
 *          properties:
 *            quote:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/quote"
 *  
 */

module.exports = router;
