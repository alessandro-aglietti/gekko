var util   = require( '../core/util.js' );
var _      = require( 'lodash' );
var moment = require( 'moment' );
var log    = require( '../core/log' );
var request = require( 'request' );

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
  var self = this;
  log.debug( this.name, 'getTicker' );
  var request_config = {
    url: "https://api.therocktrading.com/v1/funds/BTCEUR/ticker"
  };
  request.get( request_config, function ( error, response, body ) {
    log.debug( self.name, 'getTicker callback' );
    console.log( 'error:', error ); // Print the error if one occurred
    console.log( 'statusCode:', response && response.statusCode ); // Print the response status code if a response was received
    console.log( 'body:', body ); // Print the HTML for the Google homepage.
    callback( err, JSON.parse( body ) );
  } );
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
  log.debug( this.name, 'getTrades since ' + since );
  var self = this;

  var request_config = {
    url: "https://api.therocktrading.com/v1/funds/BTCEUR/trades",
    qs : {
      per_page: 200
    }
  };

  if ( since ) {
    var ISO_since           = (new Date( since )).toISOString();
    request_config.qs.after = ISO_since;
  }

  request.get( request_config, function ( error, response, body ) {
      log.debug( self.name, 'getTicker callback' );
      console.log( 'error:', error ); // Print the error if one occurred
      console.log( 'statusCode:', response && response.statusCode ); // Print the response status code if a response was received
      console.log( 'body:', body ); // Print the HTML for the Google homepage.

      var parsed_body = JSON.parse( body );
      var trt_trades  = parsed_body.trades;

      var err    = false;
      var trades = _.map( trt_trades, function ( trade ) {
        var trade_ts_ms = (new Date( trade.date )).getTime();
        return {
          tid   : trade.id,
          date  : trade_ts_ms / 1000,
          price : trade.price,
          amount: trade.amount
        }
      } );

      callback( err, trades );
    }
  );
}

module.exports = Trader;