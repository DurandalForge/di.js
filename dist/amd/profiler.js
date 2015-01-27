define([], function() {
  "use strict";
  var globalCounter = 0;
  function getUniqueId() {
    return ++globalCounter;
  }
  ;
  return {
    get getUniqueId() {
      return getUniqueId;
    },
    __esModule: true
  };
});
