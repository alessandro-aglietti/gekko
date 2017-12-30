// helpers
var _   = require( 'lodash' );
var log = require( '../core/log.js' );

// configuration
var config = require( '../core/util.js' ).getConfig();
// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function () {

  this.name = 'Scalping';
  this.currentTrend;
  this.requiredHistory = config.tradingAdvisor.historySize;
  // define the indicators we need
  var parameters       = { short: 13, long: 21, signal: 1 };
  this.addIndicator( 'macd1', 'MACD', parameters );
  var parameters = { short: 21, long: 34, signal: 1 };
  this.addIndicator( 'macd2', 'MACD', parameters );
  var parameters = { short: 34, long: 144, signal: 1 };
  this.addIndicator( 'macd3', 'MACD', parameters );
  this.addIndicator( 'ema21', 'EMA', 21 );
  this.addIndicator( 'ema34', 'EMA', 34 );
  this.addIndicator( 'ema144', 'EMA', 144 );

  // initial value
  this.lastLongPrice = 0;
}

// what happens on every new candle?
method.update = function ( candle ) {
  // nothing!  
}

// for debugging purposes: log the last calculated
method.log = function () {
}

method.check = function () {
  var percent    = 0.0;
  var is_bullish = false;
  var is_bearish = false;

  if ( is_bullish ) {
    percent = 0.01;
  }

  if ( is_bearish ) {
    percent = 0.02;
  }

  var actualPrice    = 0;
  var spread         = actualPrice - actualPrice * percent;
  var myMoney        = 0;
  var makeAbuyOffert = 0;
  var timeLimit      = 5;
  var time           = 0;
  var stopLoss       = 0;

  if ( actualPrice == spread ) {

    this.advice( 'actualPrice == spread' );
    myMoney = makeAbuyOffert;
  }

  var mymoney_spread = myMoney + myMoney * percent;

  if ( actualPrice == mymoney_spread ) {
    this.advice( 'SELLL' );
  } else {
    actualPrice = stopLoss;
  }

  if ( time > timeLimit ) {
    this.advice( "options 2" );
  }
}

module.exports = method;