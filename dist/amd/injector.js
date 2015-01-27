define(['./annotations', './util', './profiler', './providers'], function($__0,$__2,$__4,$__6) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var $__1 = $__0,
      annotate = $__1.annotate,
      readAnnotations = $__1.readAnnotations,
      hasAnnotation = $__1.hasAnnotation,
      ProvideAnnotation = $__1.Provide,
      TransientScopeAnnotation = $__1.TransientScope;
  var $__3 = $__2,
      isFunction = $__3.isFunction,
      toString = $__3.toString;
  var getUniqueId = $__4.getUniqueId;
  var createProviderFromFnOrClass = $__6.createProviderFromFnOrClass;
  function constructResolvingMessage(resolving) {
    var token = arguments[1] !== (void 0) ? arguments[1] : null;
    if (token) {
      resolving.push(token);
    }
    if (resolving.length > 1) {
      return (" (" + resolving.map(toString).join(' -> ') + ")");
    }
    return '';
  }
  var Injector = function Injector() {
    var modules = arguments[0] !== (void 0) ? arguments[0] : [];
    var parentInjector = arguments[1] !== (void 0) ? arguments[1] : null;
    var providers = arguments[2] !== (void 0) ? arguments[2] : new Map();
    this.cache = new Map();
    this.providers = providers;
    this.parent = parentInjector;
    this.id = getUniqueId();
    this._loadModules(modules);
  };
  var $Injector = Injector;
  ($traceurRuntime.createClass)(Injector, {
    _collectProvidersWithAnnotation: function(annotationClass, collectedProviders) {
      this.providers.forEach((function(provider, token) {
        if (!collectedProviders.has(token) && hasAnnotation(provider.provider, annotationClass)) {
          collectedProviders.set(token, provider);
        }
      }));
      if (this.parent) {
        this.parent._collectProvidersWithAnnotation(annotationClass, collectedProviders);
      }
    },
    _loadModules: function(modules) {
      var $__8 = this;
      for (var $__10 = modules[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__11; !($__11 = $__10.next()).done; ) {
        var module = $__11.value;
        {
          if (isFunction(module)) {
            this._loadFnOrClass(module);
            continue;
          }
          Object.keys(module).forEach((function(key) {
            if (isFunction(module[key])) {
              $__8._loadFnOrClass(module[key], key);
            }
          }));
        }
      }
    },
    _loadFnOrClass: function(fnOrClass, key) {
      var annotations = readAnnotations(fnOrClass);
      var token = annotations.provide.token || key || fnOrClass;
      var provider = createProviderFromFnOrClass(fnOrClass, annotations);
      this.providers.set(token, provider);
    },
    _hasProviderFor: function(token) {
      if (this.providers.has(token)) {
        return true;
      }
      if (this.parent) {
        return this.parent._hasProviderFor(token);
      }
      return false;
    },
    get: function(token) {
      var resolving = arguments[1] !== (void 0) ? arguments[1] : [];
      var wantPromise = arguments[2] !== (void 0) ? arguments[2] : false;
      var wantLazy = arguments[3] !== (void 0) ? arguments[3] : false;
      var $__8 = this;
      var resolvingMsg = '';
      var instance;
      var injector = this;
      if (token === $Injector) {
        if (wantPromise) {
          return Promise.resolve(this);
        }
        return this;
      }
      if (wantLazy) {
        return function createLazyInstance() {
          var lazyInjector = injector;
          if (arguments.length) {
            var locals = [];
            var args = arguments;
            for (var i = 0; i < args.length; i += 2) {
              locals.push((function(ii) {
                var fn = function createLocalInstance() {
                  return args[ii + 1];
                };
                annotate(fn, new ProvideAnnotation(args[ii]));
                return fn;
              })(i));
            }
            lazyInjector = injector.createChild(locals);
          }
          return lazyInjector.get(token, resolving, wantPromise, false);
        };
      }
      if (this.cache.has(token)) {
        instance = this.cache.get(token);
        if (this.providers.get(token).isPromise) {
          if (!wantPromise) {
            resolvingMsg = constructResolvingMessage(resolving, token);
            throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
          }
        } else {
          if (wantPromise) {
            return Promise.resolve(instance);
          }
        }
        return instance;
      }
      var provider = this.providers.get(token);
      if (!provider && isFunction(token) && !this._hasProviderFor(token)) {
        provider = createProviderFromFnOrClass(token, readAnnotations(token));
        this.providers.set(token, provider);
      }
      if (!provider) {
        if (!this.parent) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("No provider for " + toString(token) + "!" + resolvingMsg));
        }
        return this.parent.get(token, resolving, wantPromise, wantLazy);
      }
      if (resolving.indexOf(token) !== -1) {
        resolvingMsg = constructResolvingMessage(resolving, token);
        throw new Error(("Cannot instantiate cyclic dependency!" + resolvingMsg));
      }
      resolving.push(token);
      var delayingInstantiation = wantPromise && provider.params.some((function(param) {
        return !param.isPromise;
      }));
      var args = provider.params.map((function(param) {
        if (delayingInstantiation) {
          return $__8.get(param.token, resolving, true, param.isLazy);
        }
        return $__8.get(param.token, resolving, param.isPromise, param.isLazy);
      }));
      if (delayingInstantiation) {
        var delayedResolving = resolving.slice();
        resolving.pop();
        return Promise.all(args).then(function(args) {
          try {
            instance = provider.create(args);
          } catch (e) {
            resolvingMsg = constructResolvingMessage(delayedResolving);
            var originalMsg = 'ORIGINAL ERROR: ' + e.message;
            e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
            throw e;
          }
          if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
            injector.cache.set(token, instance);
          }
          return instance;
        });
      }
      try {
        instance = provider.create(args);
      } catch (e) {
        resolvingMsg = constructResolvingMessage(resolving);
        var originalMsg = 'ORIGINAL ERROR: ' + e.message;
        e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
        throw e;
      }
      if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
        this.cache.set(token, instance);
      }
      if (!wantPromise && provider.isPromise) {
        resolvingMsg = constructResolvingMessage(resolving);
        throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
      }
      if (wantPromise && !provider.isPromise) {
        instance = Promise.resolve(instance);
      }
      resolving.pop();
      return instance;
    },
    getPromise: function(token) {
      return this.get(token, [], true);
    },
    createChild: function() {
      var modules = arguments[0] !== (void 0) ? arguments[0] : [];
      var forceNewInstancesOf = arguments[1] !== (void 0) ? arguments[1] : [];
      var forcedProviders = new Map();
      for (var $__10 = forceNewInstancesOf[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__11; !($__11 = $__10.next()).done; ) {
        var annotation = $__11.value;
        {
          this._collectProvidersWithAnnotation(annotation, forcedProviders);
        }
      }
      return new $Injector(modules, this, forcedProviders);
    },
    dump: function() {
      var $__8 = this;
      var serialized = {
        id: this.id,
        parent_id: this.parent ? this.parent.id : null,
        providers: {}
      };
      Object.keys(this.providers).forEach((function(token) {
        serialized.providers[token] = {
          name: token,
          dependencies: $__8.providers[token].params
        };
      }));
      return serialized;
    }
  }, {});
  ;
  return {
    get Injector() {
      return Injector;
    },
    __esModule: true
  };
});
