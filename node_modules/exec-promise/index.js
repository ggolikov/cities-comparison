'use strict';

//====================================================================

var Bluebird = require('bluebird');
var logSymbols = require('log-symbols');

//====================================================================

var isNumber, isString;
(function (toS) {
  var _ = function (ref) {
    ref = toS.call(ref);
    return function (val) {
      return toS.call(val) === ref;
    };
  };

  isNumber = _(0);
  isString = _('');
})(Object.prototype.toString);

//====================================================================

function prettyFormat(value) {
  // Extract real error from Bluebird's wrapper.
  if (value instanceof Bluebird.OperationalError) {
    value = value.cause;
  }

  if (isString(value)) {
    return value;
  }

  if (value instanceof Error) {
    return value.message +'\n'+ value.stack;
  }

  return JSON.stringify(value, null, 2);
}

function onSuccess(value) {
    if (value !== undefined) {
      console.log(prettyFormat(value));
    }

    process.exit(0);
}

function onError(error) {
    console.error(logSymbols.error, prettyFormat(error));

    process.exit(1);
}

//====================================================================

function execPromise(fn) {
  return Bluebird.try(fn, [process.argv.slice(2)]).then(
    onSuccess,
    onError
  );
}
exports = module.exports = execPromise;
