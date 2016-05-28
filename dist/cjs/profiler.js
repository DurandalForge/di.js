"use strict";
var globalCounter = 0;
function getUniqueId() {
  return ++globalCounter;
}
Object.defineProperties(module.exports, {
  getUniqueId: {
    get: function() {
      return getUniqueId;
    },
    enumerable: true
  },
  __esModule: {value: true}
});
