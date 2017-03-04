var util   = require( '../core/util.js' );
var _      = require( 'lodash' );
var moment = require( 'moment' );
var log    = require( '../core/log' );

var Trader = function ( config ) {
  this.name = 'TheRock';
  log.debug( this.name, 'new config: ' + JSON.stringify( config ) );

  _.bindAll( this );

  if ( _.isObject( config ) ) {
    this.key    = config.key;
    this.secret = config.secret;
  }
}

// if the exchange errors we try the same call again after
// waiting 10 seconds
Trader.prototype.retry = function ( method, args ) {
  var wait = +moment.duration( 10, 'seconds' );
  log.debug( this.name, 'returned an error, retrying..' );

  var self = this;

  // make sure the callback (and any other fn)
  // is bound to Trader
  _.each( args, function ( arg, i ) {
    if ( _.isFunction( arg ) )
      args[ i ] = _.bind( arg, self );
  } );

  // run the failed method again with the same
  // arguments after wait
  setTimeout(
    function () {
      method.apply( self, args )
    },
    wait
  );
}

Trader.prototype.getPortfolio = function ( callback ) {
  log.debug( this.name, 'getPortfolio' );
  var portfolio = [
    { name: 'BTC', amount: 0 },
    { name: 'EUR', amount: 0 }
  ];
  var err       = false;
  callback( err, portfolio );
}

Trader.prototype.getTicker = function ( callback ) {
  log.debug( this.name, 'getTicker' );
  var ticker = {
    ask: 0.1,
    bid: 0.1
  };
  var err    = false;
  callback( err, ticker )
}

Trader.prototype.getFee = function ( callback ) {
  log.debug( this.name, 'getFee' );
  var fee = 0.0002;
  var err = false;
  callback( err, fee );
}

Trader.prototype.buy = function ( amount, price, callback ) {
  log.debug( this.name, 'buy' );
  log.debug( this.name, 'buy ' + amount + ' at ' + price );
  var order = {};
  var err   = false;
  callback( err, order );
}

Trader.prototype.sell = function ( amount, price, callback ) {
  log.debug( this.name, 'sell' );
  log.debug( this.name, 'sell ' + amount + ' at ' + price );
  var order = {};
  var err   = false;
  callback( err, order );
}

Trader.prototype.checkOrder = function ( order, callback ) {
  log.debug( this.name, 'checkOrder' );
  var filled = true;
  var err    = false;
  callback( err, filled );
}

Trader.prototype.cancelOrder = function ( order ) {
  log.debug( this.name, 'cancelOrder' );
}

Trader.prototype.getTrades = function ( since, callback, descending ) {
  log.debug( this.name, 'getTrades' );
  var trades = [
    {
      tid   : 1,
      date  : 1488624999,
      price : 100,
      amount: 1
    }
  ];

  var err = false;

  callback( err, trades );
}

module.exports = Trader;