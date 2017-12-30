// helpers
var _   = require( 'lodash' );
var log = require( '../core/log.js' );

// configuration
var config = require( '../core/util.js' ).getConfig();
// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function () {
  /**
   * http://www.investopedia.com/articles/trading/08/macd-stochastic-double-cross.asp
   */
  this.name = 'MACD And Stochastic: A Double-Cross Strategy';

  /**
   * Indicatori utilizzati
   */
  this.addIndicator( 'macd', 'MACD', config.MACD );
  this.addIndicator( 'rsi', 'RSI', config.StochRSI );

  /**
   * StochRSI attributes
   */
  this.RSIhistory = [];
  this.OVER_BOUGHT         = 'OVER_BOUGHT';
  this.OVER_SOLD           = 'OVER_SOLD';
  this.STOCH_RSI_SENTIMENT = {
    prev   : false,
    current: false,
  };

  /**
   * MACD attributes
   */
  this.UP_TREND = 'UP_TREND';
  this.DOWN_TREND     = 'DOWN_TREND';
  this.MACD_SENTIMENT = {
    prev   : false,
    current: false,
  };
}

// what happens on every new candle?
method.update = function ( candle ) {
  this.rsi = this.indicators.rsi.rsi;

  this.RSIhistory.push( this.rsi );

  if ( _.size( this.RSIhistory ) > config.StochRSI.interval ) {
    // remove oldest RSI value
    this.RSIhistory.shift();
  }

  this.lowestRSI  = _.min( this.RSIhistory );
  this.highestRSI = _.max( this.RSIhistory );
  this.stochRSI   = ((this.rsi - this.lowestRSI) / (this.highestRSI - this.lowestRSI)) * 100;
}

// for debugging purposes: log the last calculated
method.log = function () {
}

method.check = function () {
  this.STOCH_RSI_SENTIMENT.prev = this.STOCH_RSI_SENTIMENT.current;

  if ( this.stochRSI > config.StochRSI.thresholds.high ) {
    // high
    this.STOCH_RSI_SENTIMENT.current = this.OVER_BOUGHT;
  }

  if ( this.stochRSI < config.StochRSI.thresholds.low ) {
    // low
    this.STOCH_RSI_SENTIMENT.current = this.OVER_SOLD;
  }

  var macddiff             = this.indicators.macd.result;
  this.MACD_SENTIMENT.prev = this.MACD_SENTIMENT.current;

  if ( macddiff > config.MACD.thresholds.up ) {
    // up trend
    this.MACD_SENTIMENT.current = this.UP_TREND;
  }

  if ( macddiff < config.MACD.thresholds.down ) {
    this.MACD_SENTIMENT.current = this.DOWN_TREND;
  }

  if ( this.STOCH_RSI_SENTIMENT.current === this.OVER_SOLD && this.MACD_SENTIMENT.current === this.DOWN_TREND ) {
    if ( this.STOCH_RSI_SENTIMENT.prev === this.OVER_BOUGHT && this.MACD_SENTIMENT.prev === this.UP_TREND ) {
      this.advice( 'MACD And Stochastic: A Double-Cross Strategy' );
    }
  }
}

module.exports = method;