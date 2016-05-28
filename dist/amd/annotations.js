define(["./util"], function($__24) {
  "use strict";
  if (!$__24 || !$__24.__esModule)
    $__24 = {default: $__24};
  var isFunction = $__24.isFunction;
  var SuperConstructor = function() {
    function SuperConstructor() {}
    return ($traceurRuntime.createClass)(SuperConstructor, {}, {});
  }();
  var TransientScope = function() {
    function TransientScope() {}
    return ($traceurRuntime.createClass)(TransientScope, {}, {});
  }();
  var Inject = function() {
    function Inject() {
      for (var tokens = [],
          $__23 = 0; $__23 < arguments.length; $__23++)
        tokens[$__23] = arguments[$__23];
      this.tokens = tokens;
      this.isPromise = false;
      this.isLazy = false;
    }
    return ($traceurRuntime.createClass)(Inject, {}, {});
  }();
  var InjectPromise = function($__super) {
    function InjectPromise() {
      for (var tokens = [],
          $__23 = 0; $__23 < arguments.length; $__23++)
        tokens[$__23] = arguments[$__23];
      $traceurRuntime.superConstructor(InjectPromise).call(this);
      this.tokens = tokens;
      this.isPromise = true;
      this.isLazy = false;
    }
    return ($traceurRuntime.createClass)(InjectPromise, {}, {}, $__super);
  }(Inject);
  var InjectLazy = function($__super) {
    function InjectLazy() {
      for (var tokens = [],
          $__23 = 0; $__23 < arguments.length; $__23++)
        tokens[$__23] = arguments[$__23];
      $traceurRuntime.superConstructor(InjectLazy).call(this);
      this.tokens = tokens;
      this.isPromise = false;
      this.isLazy = true;
    }
    return ($traceurRuntime.createClass)(InjectLazy, {}, {}, $__super);
  }(Inject);
  var Provide = function() {
    function Provide(token) {
      this.token = token;
      this.isPromise = false;
    }
    return ($traceurRuntime.createClass)(Provide, {}, {});
  }();
  var ProvidePromise = function($__super) {
    function ProvidePromise(token) {
      $traceurRuntime.superConstructor(ProvidePromise).call(this);
      this.token = token;
      this.isPromise = true;
    }
    return ($traceurRuntime.createClass)(ProvidePromise, {}, {}, $__super);
  }(Provide);
  function annotate(fn, annotation) {
    fn.annotations = fn.annotations || [];
    fn.annotations.push(annotation);
  }
  function hasAnnotation(fn, annotationClass) {
    if (!fn.annotations || fn.annotations.length === 0) {
      return false;
    }
    var $__12 = true;
    var $__13 = false;
    var $__14 = undefined;
    try {
      for (var $__10 = void 0,
          $__9 = (fn.annotations)[Symbol.iterator](); !($__12 = ($__10 = $__9.next()).done); $__12 = true) {
        var annotation = $__10.value;
        {
          if (annotation instanceof annotationClass) {
            return true;
          }
        }
      }
    } catch ($__15) {
      $__13 = true;
      $__14 = $__15;
    } finally {
      try {
        if (!$__12 && $__9.return != null) {
          $__9.return();
        }
      } finally {
        if ($__13) {
          throw $__14;
        }
      }
    }
    return false;
  }
  function readAnnotations(fn) {
    var collectedAnnotations = {
      provide: {
        token: null,
        isPromise: false
      },
      params: []
    };
    if (fn.annotations && fn.annotations.length) {
      var $__12 = true;
      var $__13 = false;
      var $__14 = undefined;
      try {
        for (var $__10 = void 0,
            $__9 = (fn.annotations)[Symbol.iterator](); !($__12 = ($__10 = $__9.next()).done); $__12 = true) {
          var annotation = $__10.value;
          {
            if (annotation instanceof Inject) {
              collectedAnnotations.params = annotation.tokens.map(function(token) {
                return {
                  token: token,
                  isPromise: annotation.isPromise,
                  isLazy: annotation.isLazy
                };
              });
            }
            if (annotation instanceof Provide) {
              collectedAnnotations.provide.token = annotation.token;
              collectedAnnotations.provide.isPromise = annotation.isPromise;
            }
          }
        }
      } catch ($__15) {
        $__13 = true;
        $__14 = $__15;
      } finally {
        try {
          if (!$__12 && $__9.return != null) {
            $__9.return();
          }
        } finally {
          if ($__13) {
            throw $__14;
          }
        }
      }
    }
    if (fn.parameters) {
      fn.parameters.forEach(function(param, idx) {
        var $__19 = true;
        var $__20 = false;
        var $__21 = undefined;
        try {
          for (var $__17 = void 0,
              $__16 = (param)[Symbol.iterator](); !($__19 = ($__17 = $__16.next()).done); $__19 = true) {
            var paramAnnotation = $__17.value;
            {
              if (isFunction(paramAnnotation) && !collectedAnnotations.params[idx]) {
                collectedAnnotations.params[idx] = {
                  token: paramAnnotation,
                  isPromise: false,
                  isLazy: false
                };
              } else if (paramAnnotation instanceof Inject) {
                collectedAnnotations.params[idx] = {
                  token: paramAnnotation.tokens[0],
                  isPromise: paramAnnotation.isPromise,
                  isLazy: paramAnnotation.isLazy
                };
              }
            }
          }
        } catch ($__22) {
          $__20 = true;
          $__21 = $__22;
        } finally {
          try {
            if (!$__19 && $__16.return != null) {
              $__16.return();
            }
          } finally {
            if ($__20) {
              throw $__21;
            }
          }
        }
      });
    }
    return collectedAnnotations;
  }
  return {
    get annotate() {
      return annotate;
    },
    get hasAnnotation() {
      return hasAnnotation;
    },
    get readAnnotations() {
      return readAnnotations;
    },
    get SuperConstructor() {
      return SuperConstructor;
    },
    get TransientScope() {
      return TransientScope;
    },
    get Inject() {
      return Inject;
    },
    get InjectPromise() {
      return InjectPromise;
    },
    get InjectLazy() {
      return InjectLazy;
    },
    get Provide() {
      return Provide;
    },
    get ProvidePromise() {
      return ProvidePromise;
    },
    __esModule: true
  };
});
