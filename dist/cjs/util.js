"use strict";
function isUpperCase(char) {
  return char.toUpperCase() === char;
}
function isClass(clsOrFunction) {
  if (clsOrFunction.name) {
    return isUpperCase(clsOrFunction.name.charAt(0));
  }
  return Object.keys(clsOrFunction.prototype).length > 0;
}
function isFunction(value) {
  return typeof value === 'function';
}
function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value)) === 'object';
}
function toString(token) {
  if (typeof token === 'string') {
    return token;
  }
  if (token.name) {
    return token.name;
  }
  return token.toString();
}
Object.defineProperties(module.exports, {
  isUpperCase: {
    get: function() {
      return isUpperCase;
    },
    enumerable: true
  },
  isClass: {
    get: function() {
      return isClass;
    },
    enumerable: true
  },
  isFunction: {
    get: function() {
      return isFunction;
    },
    enumerable: true
  },
  isObject: {
    get: function() {
      return isObject;
    },
    enumerable: true
  },
  toString: {
    get: function() {
      return toString;
    },
    enumerable: true
  },
  __esModule: {value: true}
});
