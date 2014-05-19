;(function(context) {

  var modules = {};
  var _modules = {};
  var stack = {};

  // define(id, function(require, module, exports))
  function define(id, callback) {
    if (typeof id !== 'string' || id === '') throw Error('invalid module id ' + id);
    if (_modules[id]) throw Error('dupicated module id ' + id);
    if (typeof callback !== 'function') throw Error('invalid module function');

    _modules[id] = callback;
  }

  // require(id)
  function require(id) {
    if (!_modules[id]) throw Error('module ' + id + ' is not defined');
    if (stack[id]) throw Error(outputCircular());
    if (modules[id]) return modules[id].exports;

    var m = modules[id] = {
      id: id,
      require: require,
      exports: {}
    };

    stack[id] = true;
    _modules[id](require, m, m.exports);
    delete stack[id];

    return m.exports;
  }

  function outputCircular() {
    return 'circular: ' + Object.keys(stack).join(', ');
  }

  context.define = define;
  context.require = require;
})(typeof window !== 'undefined'? window : global);
