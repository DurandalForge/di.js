define(["./annotations", "./util"], function($__9, $__11) {
  "use strict";
  if (!$__9 || !$__9.__esModule)
    $__9 = {default: $__9};
  if (!$__11 || !$__11.__esModule)
    $__11 = {default: $__11};
  var $__10 = $__9,
      SuperConstructorAnnotation = $__10.SuperConstructor,
      readAnnotations = $__10.readAnnotations;
  var $__12 = $__11,
      isClass = $__12.isClass,
      isFunction = $__12.isFunction,
      isObject = $__12.isObject,
      toString = $__12.toString;
  var EmptyFunction = Object.getPrototypeOf(Function);
  var ClassProvider = function() {
    function ClassProvider(clazz, params, isPromise) {
      this.provider = clazz;
      this.isPromise = isPromise;
      this.params = [];
      this.constructors = [];
      this._flattenParams(clazz, params);
      this.constructors.unshift([clazz, 0, this.params.length - 1]);
    }
    return ($traceurRuntime.createClass)(ClassProvider, {
      _flattenParams: function(constructor, params) {
        var SuperConstructor;
        var constructorInfo;
        var $__5 = true;
        var $__6 = false;
        var $__7 = undefined;
        try {
          for (var $__3 = void 0,
              $__2 = (params)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
            var param = $__3.value;
            {
              if (param.token === SuperConstructorAnnotation) {
                SuperConstructor = Object.getPrototypeOf(constructor);
                if (SuperConstructor === EmptyFunction) {
                  throw new Error((toString(constructor) + " does not have a parent constructor. Only classes with a parent can ask for SuperConstructor!"));
                }
                constructorInfo = [SuperConstructor, this.params.length];
                this.constructors.push(constructorInfo);
                this._flattenParams(SuperConstructor, readAnnotations(SuperConstructor).params);
                constructorInfo.push(this.params.length - 1);
              } else {
                this.params.push(param);
              }
            }
          }
        } catch ($__8) {
          $__6 = true;
          $__7 = $__8;
        } finally {
          try {
            if (!$__5 && $__2.return != null) {
              $__2.return();
            }
          } finally {
            if ($__6) {
              throw $__7;
            }
          }
        }
      },
      _createConstructor: function(currentConstructorIdx, context, allArguments) {
        var constructorInfo = this.constructors[currentConstructorIdx];
        var nextConstructorInfo = this.constructors[currentConstructorIdx + 1];
        var argsForCurrentConstructor;
        if (nextConstructorInfo) {
          argsForCurrentConstructor = allArguments.slice(constructorInfo[1], nextConstructorInfo[1]).concat([this._createConstructor(currentConstructorIdx + 1, context, allArguments)]).concat(allArguments.slice(nextConstructorInfo[2] + 1, constructorInfo[2] + 1));
        } else {
          argsForCurrentConstructor = allArguments.slice(constructorInfo[1], constructorInfo[2] + 1);
        }
        return function InjectedAndBoundSuperConstructor() {
          return constructorInfo[0].apply(context, argsForCurrentConstructor);
        };
      },
      create: function(args) {
        var context = Object.create(this.provider.prototype);
        var constructor = this._createConstructor(0, context, args);
        var returnedValue = constructor();
        if (isFunction(returnedValue) || isObject(returnedValue)) {
          return returnedValue;
        }
        return context;
      }
    }, {});
  }();
  var FactoryProvider = function() {
    function FactoryProvider(factoryFunction, params, isPromise) {
      this.provider = factoryFunction;
      this.params = params;
      this.isPromise = isPromise;
      var $__5 = true;
      var $__6 = false;
      var $__7 = undefined;
      try {
        for (var $__3 = void 0,
            $__2 = (params)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
          var param = $__3.value;
          {
            if (param.token === SuperConstructorAnnotation) {
              throw new Error((toString(factoryFunction) + " is not a class. Only classes with a parent can ask for SuperConstructor!"));
            }
          }
        }
      } catch ($__8) {
        $__6 = true;
        $__7 = $__8;
      } finally {
        try {
          if (!$__5 && $__2.return != null) {
            $__2.return();
          }
        } finally {
          if ($__6) {
            throw $__7;
          }
        }
      }
    }
    return ($traceurRuntime.createClass)(FactoryProvider, {create: function(args) {
        return this.provider.apply(undefined, args);
      }}, {});
  }();
  function createProviderFromFnOrClass(fnOrClass, annotations) {
    if (isClass(fnOrClass)) {
      return new ClassProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
    }
    return new FactoryProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
  }
  return {
    get createProviderFromFnOrClass() {
      return createProviderFromFnOrClass;
    },
    __esModule: true
  };
});
