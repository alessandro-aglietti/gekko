var log                = require( '../core/log' );
var moment             = require( 'moment' );
var _                  = require( 'lodash' );
var util               = require( '../core/util.js' );
var config             = require( '../core/util' ).getConfig().telegram;
var request            = require( 'request' );

var Actor = function () {
  this.price      = 'N/A';
  this.name       = 'telegram';
  log.debug( this.name, 'telegram start' );
  this.marketTime = {
    format: function () {
      return 'N/A'
    }
  };
  _.bindAll( this );
}

Actor.prototype.processCandle = function ( candle, done ) {
  this.price      = candle.close;
  this.marketTime = candle.start;

  done();
};

Actor.prototype.processAdvice = function ( advice ) {
  log.debug( this.name, 'processAdvice' );
  if ( config.muteSoft && advice.recommendation == 'soft' ) return;
  var message = '_________Nuovo Trade_________\n';
  message += ' - Posizione:' + advice.recommendation+'\n';
  message += ' - Market price________________:' + this.price+'\n';
  message += ' - Based on market time:' + this.marketTime.format( 'YYYY-MM-DD HH:mm:ss' );
  log.debug( this.name, message );
  this.sendMessage( message );
};

Actor.prototype.finalize = function ( advice ) {
  // todo
};

Actor.prototype.sendMessage = function ( message ) {
  log.debug( this.name, 'sendMessage' );
  var self = this;
  var bot_url    = "https://api.telegram.org/bot" + config.bot_key + ":" + config.bot_secret + "/sendMessage";
  var bot_params = {
    chat_id: config.chat_id,
    text   : message
  };

  var request_config = {
    url : bot_url,
    form: bot_params
  };

  log.debug( this.name, 'bot_url ' + request_config.url );
  log.debug( this.name, 'chat_id ' + request_config.form.chat_id );

  request.post( request_config, function ( error, response, body ) {
    log.debug( self.name, 'sendmessage callback' );
    console.log( 'error:', error ); // Print the error if one occurred
    console.log( 'statusCode:', response && response.statusCode ); // Print the response status code if a response was received
    console.log( 'body:', body ); // Print the HTML for the Google homepage.
  } );
};

module.exports = Actor;
