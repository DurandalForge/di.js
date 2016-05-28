define(["./injector", "./annotations", "./util", "./providers"], function($__2, $__4, $__6, $__8) {
  "use strict";
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  if (!$__8 || !$__8.__esModule)
    $__8 = {default: $__8};
  var Injector = $__2.Injector;
  var $__5 = $__4,
      Inject = $__5.Inject,
      annotate = $__5.annotate,
      readAnnotations = $__5.readAnnotations;
  var isFunction = $__6.isFunction;
  var createProviderFromFnOrClass = $__8.createProviderFromFnOrClass;
  var currentSpec = null;
  beforeEach(function() {
    currentSpec = this;
    currentSpec.$$providers = [];
  });
  afterEach(function() {
    currentSpec.$$providers = null;
    currentSpec.$$injector = null;
    currentSpec = null;
  });
  function isRunning() {
    return !!currentSpec;
  }
  function use(mock) {
    if (currentSpec && currentSpec.$$injector) {
      throw new Error('Cannot call use() after inject() has already been called.');
    }
    var providerWrapper = {provider: mock};
    var fn = function() {
      currentSpec.$$providers.push(providerWrapper);
    };
    fn.as = function(token) {
      if (currentSpec && currentSpec.$$injector) {
        throw new Error('Cannot call as() after inject() has already been called.');
      }
      providerWrapper.as = token;
      if (isRunning()) {
        return undefined;
      }
      return fn;
    };
    if (isRunning()) {
      fn();
    }
    return fn;
  }
  function inject() {
    for (var params = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      params[$__1] = arguments[$__1];
    var behavior = params.pop();
    annotate(behavior, new (Function.prototype.bind.apply(Inject, $traceurRuntime.spread([null], params)))());
    var run = function() {
      if (!currentSpec.$$injector) {
        var providers = new Map();
        var modules = [];
        var annotations;
        currentSpec.$$providers.forEach(function(providerWrapper) {
          if (!providerWrapper.as) {
            modules.push(providerWrapper.provider);
          } else {
            if (!isFunction(providerWrapper.provider)) {
              providers.set(providerWrapper.as, createProviderFromFnOrClass(function() {
                return providerWrapper.provider;
              }, {
                provide: {
                  token: null,
                  isPromise: false
                },
                params: []
              }));
            } else {
              annotations = readAnnotations(providerWrapper.provider);
              providers.set(providerWrapper.as, createProviderFromFnOrClass(providerWrapper.provider, annotations));
            }
          }
        });
        currentSpec.$$injector = new Injector(modules, null, providers);
      }
      currentSpec.$$injector.get(behavior);
    };
    return isRunning() ? run() : run;
  }
  return {
    get use() {
      return use;
    },
    get inject() {
      return inject;
    },
    __esModule: true
  };
});
