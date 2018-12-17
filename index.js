const assert = require('assert');

module.exports = {
  addAsync,
  decorateApp: addAsync,
  decorateRouter: addAsync,
  wrap
};

function addAsync(app) {
  app.useAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `useAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.use.apply(app, args);
  };

  app.deleteAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `deleteAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.delete.apply(app, args);
  };

  app.getAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `getAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.get.apply(app, args);
  };

  app.patchAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `patchAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.patch.apply(app, args);
  };

  app.postAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `postAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.post.apply(app, args);
  };

  app.putAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `putAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.put.apply(app, args);
  };

  app.headAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `headAsync()` must be a function');
    const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1).
      concat([wrap(fn)]);
    return app.head.apply(app, args);
  };

  return app;
}

/**
 * Given a function that returns a promise, converts it into something you
 * can safely pass into `app.use()`, `app.get()`, etc.
 */

function wrap(fn) {
  // Error handling middleware
  if (fn.length === 4) {
    return function wrappedErrorHandler(error, req, res, next) {
      next = _once(next);
      fn(error, req, res, next).then(next, next);
    };
  }

  return function wrappedMiddleware(req, res, next) {
    next = _once(next);
    fn(req, res, next).then(
      () => { res.headersSent ? null : next(); },
      err => { res.headersSent ? null : next(err); }
    );
  };
}

function _once(fn) {
  let called = false;
  return function() {
    if (called) {
      return;
    }
    called = true;
    fn.apply(null, arguments);
  };
}
