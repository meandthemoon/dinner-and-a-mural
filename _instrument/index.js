var
fs = require('fs'),
moment = require('moment'),
r = require('ramda'),
shim = require('shimmer'),
uuid = require('node-uuid');

var outputFile =
    __dirname + '/' + 'profile-output.dump';

fs.appendFileSync(
  outputFile,
  '\n\n---' + new Date().toDateString() + ' ---',
  'utf8');

var instrument = module.exports = function ( ) {
  var agent = createAgent();
  var appsWith = require('./apps-with');
  var _module = require('module');

  shim.wrap(_module, '_load', function ( orig__load, name ) {
    return function ( name, _m ) {
      (appsWith[name] &&
       appsWith[name].patch(agent, name, _m)); // jshint ignore:line

      return orig__load.apply(_module, arguments);
    };
    
  });

  // Recieve messages from agent
  // Format: `{ h: <msg-header>, b: <msg-body> }`
  instrument.message = function ( agentMsg ) {
    if (!agentMsg) { return console.error('*empty agent message*'); }
    try {
      var message = JSON.parse(agentMsg);
      instrument.reports.route(message);
    } catch ( e ) {
      instrument.reports.badMessage(e);
    }
  };

  instrument.reports = {
    // profiling reports based on multiple logging
    multipart: {
      'application.handle+res.end':
      function ( messages ) {
        var
        responseTime = r.compose(
          r.apply(function ( start, finish ) {
            return finish.diff(start);
          }),
          r.map(moment),
          r.map(r.path(['h', 'timestamp']))
        )([r.head(messages), r.last(messages)]),
        requestInfo = r.join(' ', ['\n',
                                   messages[0].b.req.method,
                                   messages[0].b.req.url,
                                  '| request time:', responseTime, '(ms)']);

        fs.appendFile(outputFile, requestInfo, 'utf8', r.identity);
      }
    },
    badMessage:
    function ( message ) {
      console.error(message);
    },
    route:
    function ( message ) {
      if (r.is(Array, message)) {
        var
        reportName = r.compose(
          r.join('+'),
          r.map(r.path(['h', 'event']))
        )(message),
        report = instrument.reports.multipart[reportName];

        if (report) {
          report(message);
        }
      }
    }
  };

};

function createAgent ( ) {
  function Agent ( options ) {
    // keep track of:
    // -- modules
    this.implemented = {};
    // -- multipart logs
    this.recordings = {};
  }

  require('util').inherits(
    Agent,
    require('events').EventEmitter);

  Agent.prototype.isImplemented = function ( name ) {
    return this.implemented[name];
  };

  Agent.prototype.markImplemented = function ( name ) {
    this.implemented[name] = true;
  };

  Agent.prototype.startLog = function ( message ) {
    var txnId = uuid.v1();
    this.recordings[txnId] = [r.assocPath(['h', 'txnId'],
                                          txnId,
                                          message)];
    return txnId;
  };

  Agent.prototype.endLog = function ( message ) {
    var log = this.recordings[message.h.txnId];
    this.recordings[message.h.txnId].push(message);

    instrument.message(JSON.stringify(log));
   
    (message.h.txnId &&
     delete this.recordings[message.h.txnId]); // jshint ignore:line
  };

  // no recording; just pass information
  Agent.prototype.justLog = function ( ) { };

  return new Agent();
}
