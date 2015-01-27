"use strict";
Object.defineProperties(exports, {
  getUniqueId: {get: function() {
      return getUniqueId;
    }},
  __esModule: {value: true}
});
var globalCounter = 0;
function getUniqueId() {
  return ++globalCounter;
}
;
