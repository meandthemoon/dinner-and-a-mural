var
moment = require('moment'),
r = require('ramda');

var withInstr = module.exports = {};

// EXPRESS.JS
withInstr.express = {
  patch: function ( agent, name, _module ) {
    var inf = {
      module: 'express'
    };

    if (agent.isImplemented(name)) { return; }
    agent.markImplemented(name);

    var _express = require(name);
    patchOnce(_express.application,
              'handle',
              r.partial(app_handle, [agent, inf]));
  }
};

// patch: express.application.handle (req, res, cb) => {}
function app_handle ( agent, inf, o_handle ) {
  return function handle ( req, res, cb ) {
    var
    txnId = agent.startLog({
      h: { event: 'application.handle',
           module: inf.module,
           timestamp: moment().toISOString() },
      b: { req: { method: req.method,
                  path: req.path,
                  query: req.query,
                  url: req.url } }
    });

    patch(res,
          'end',
          r.partial(res_end, [agent, r.assoc('txnId', txnId, inf)]));

    return o_handle.apply(this, arguments);
  };
}

// patch: res.end ( ) => {}
function res_end ( agent, inf, o_end ) {
  return function end ( ) {
    agent.endLog({
      h: { event: 'res.end',
           module: inf.module,
           timestamp: moment().toISOString(),
           txnId: inf.txnId },
      b: { }
    });

    return o_end.apply(this, arguments);
  };
}

// .............................
// not used ....................
// .............................
// res.end instrumented above
// function res_send ( agent, inf, o_send ) {
//   return function send ( body ) {
//     if (o_send) {
//       return o_send.apply(this, arguments); }
//     return body;
//   };
// }

// -- mutative --
function patch ( object, name, replacement) {
  var orig = object[name];
  object[name]['::patch'] = true;
  object[name] = replacement.call(object, orig);
}

function patchOnce ( object, name, replacement ) {
  if (object[name] && object[name]['::patch']) {
    return; }

  var orig = object[name];
  object[name]['::patch'] = true;
  object[name] = replacement.call(object, orig);
}
