"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function clearCart(_x) {
  return _clearCart.apply(this, arguments);
} // clearCart()


function _clearCart() {
  _clearCart = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(formData) {
    var res, json;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch('/cart/clear.js', {
              method: 'POST' // body: JSON.stringify(formData)

            });

          case 3:
            res = _context2.sent;
            _context2.next = 6;
            return res.json();

          case 6:
            json = _context2.sent;
            console.log('json:', json); // If cart Error run message 

            if (!json.status) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", pdp_wicks.addMessage(json.description, true, true));

          case 10:
            updateCart(json);
            _context2.next = 16;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            console.log('cart error:', _context2.t0);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return _clearCart.apply(this, arguments);
}

function add_to_cart(_x2) {
  return _add_to_cart.apply(this, arguments);
}
/* Ater item added to cart update cart with new item and open it */


function _add_to_cart() {
  _add_to_cart = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(formData) {
    var res, json;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('formData:', formData);
            _context3.prev = 1;
            _context3.next = 4;
            return fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });

          case 4:
            res = _context3.sent;
            _context3.next = 7;
            return res.json();

          case 7:
            json = _context3.sent;
            console.log('json:', json); // If cart Error run message 

            if (!json.status) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", pdp_wicks.addMessage(json.description, true, true));

          case 11:
            updateCart(json);
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](1);
            console.log('cart error:', _context3.t0);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 14]]);
  }));
  return _add_to_cart.apply(this, arguments);
}

function updateCart(_x3) {
  return _updateCart.apply(this, arguments);
}

function _updateCart() {
  _updateCart = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(returnData) {
    var openCartBtn, cartIcon, res, html, cartQuantityData, cartTotal, currentCart, parent, newCartItem;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            openCartBtn = document.querySelector('[data-action="open-drawer"]');
            cartIcon = document.querySelector('[data-action="open-drawer"] .small');
            _context4.next = 4;
            return fetch('/cart' + '?view=drawer&timestamp=' + Date.now(), {
              credentials: 'same-origin',
              method: 'GET'
            });

          case 4:
            res = _context4.sent;
            _context4.next = 7;
            return res.text();

          case 7:
            html = _context4.sent;
            cartQuantityData = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('[data-line-item-quantity]');
            /* Gets all line items from cart and adds the total together */

            cartTotal = Array.from(cartQuantityData).reduce(function (prev, data) {
              var quantity = Number(data.dataset.lineItemQuantity);
              return prev + quantity;
            }, 0);
            cartTotal > 99 ? cartIcon.classList.add('small-many') : cartIcon.classList.remove('small-many');
            cartIcon.textContent = cartTotal;
            currentCart = document.querySelector('.Cart');
            parent = currentCart.parentNode;
            newCartItem = new DOMParser().parseFromString(html, 'text/html').querySelector('.Cart');
            /* Added stops sale item from being clicked */

            Array.from(newCartItem.querySelectorAll('.CartItem__Title.Heading a')).forEach(function (title) {
              if (title.textContent === 'you planted trees for earth day') {
                title.style.pointerEvents = 'none';
              }
            });
            parent.replaceChild(newCartItem, currentCart);
            openCartBtn.click();
            updateShippingPercent(returnData);

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _updateCart.apply(this, arguments);
}

function updateShippingPercent(returnData) {
  var itemPrice = Number((returnData.items[0].final_price * currentQuantity / 100).toFixed(2));
  var percentProgress = document.querySelector('.progress_percent');
  var textProgress = document.querySelector('.text_progress');
  var currentPercent = Number(percentProgress.style.width.replace(/(\d+\.\d{2}|\d{0,2})(.+)/g, '$1'));
  var newPercentage = currentPercent + itemPrice;

  if (currentPercent >= 100 || newPercentage >= 100) {
    percentProgress.style.width = newPercentage + '%';
    return textProgress.textContent = 'You Qualify for Free Domestic Shipping';
  }

  percentProgress.style.width = newPercentage + '%';
  textProgress.textContent = 'You are $' + (99 - newPercentage).toFixed(2) + ' away from Free Domestic Shipping';
} // add_to_cart({
//     items: [{
//         id: 41043337019546,
//         quantity: 2,
//         properties: {
//             percent: "20,25,30,35,40",
//             quantity: "1,5,10,50,100"
//         }
//     }]
// })


var PDP = /*#__PURE__*/function () {
  function PDP() {
    _classCallCheck(this, PDP);

    this.thumbs = document.querySelector('.PDP_thumbs');
    this.resizeObserver();
    this.swatchers();
    this.addEventListeners();
    this.stickyCTA();
    this.observeDocumentMutations();
    this.popState();
    this.onLoadChanges();
    this.state = {
      options: {},
      product_type: meta.product.type,
      wickPricings: {},
      quantity: null,
      browserBack: false,
      madeBetter: {
        desc: made_better_desc,
        icons: made_better_icon
      }
    };
    console.log('PDP.PDP_elements:', PDP.PDP_elements);
  }

  _createClass(PDP, [{
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this = this;

      document.querySelector('.PDP__cart-submit').addEventListener('click', this.cartController.bind(this)); // After all inputs added dynamically on page load then eventlistenders are added to them */

      Array.from(document.querySelectorAll('.m-dropdown input, .Dialog_list input')).forEach(function (input) {
        return input.addEventListener('input', _this.updateOptionValues.bind(_this));
      });
    }
  }, {
    key: "positionThumbs",
    value: function positionThumbs() {
      var fragment = new DocumentFragment();
      var thumbsContainer = document.querySelector('.PDP_thumbs');
      var thumbs = thumbsContainer.querySelectorAll('img');
      var main_img = PDP.PDP_elements[2];
      thumbs.forEach(function (img, i) {
        var new_img = img.cloneNode(true);
        new_img.style.position = 'absolute';
        new_img.style.top = '0px';
        new_img.style.left = '0px';
        fragment.appendChild(new_img);
      });
      main_img.appendChild(fragment);

      thumbsContainer.onclick = function (e) {
        revealImg(e.target);
      };

      function revealImg(target) {
        var tagName = target.tagName;
        if (tagName === 'IMG') Array.from(main_img.children).forEach(function (el) {
          if (el.className) {
            el.className = '';
          }

          if (el.src === target.src) {
            el.className = 'fade-in';
          }
        });
      }
    }
  }, {
    key: "onLoadChanges",
    value: function onLoadChanges(el) {
      var _this2 = this;

      var inventoryElem = document.querySelector('.PDP_inventory');
      var product_id = document.querySelector('input[data-products-id]');

      if (inventoryElem) {
        var replaceWithCommas = function replaceWithCommas(match) {
          return match.split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
        };

        var currentText = inventoryElem.textContent.replace(/([\d]+)/, replaceWithCommas);
        inventoryElem.textContent = currentText;
      }

      this.positionThumbs();
      /* Multiple dropdowns for options such as "money maker candle kit" and t-shirts */

      if (!this.isWickProduct() && product_id) this.productAPI(product_id.dataset.productsId, function (product) {
        console.log('product:', product);

        _this2.filterOptions(product.product.variants);
      });
    }
  }, {
    key: "observeDocumentMutations",
    value: function observeDocumentMutations() {
      var _this3 = this;

      var callback = function callback(mutationsList) {
        var i = mutationsList.length;

        while (i--) {
          var record = mutationsList[i];

          if (record.addedNodes.length && record.target.tagName == 'BUTTON') {
            record.addedNodes[0].addEventListener('input', _this3.updateOptionValues.bind(_this3));
          }
        }
      };

      var config = {
        subtree: true,
        childList: true
      };
      this.observer = new MutationObserver(callback);
      this.observer.observe(document.querySelector('.PDP_product-form'), config);
    }
  }, {
    key: "resizeObserver",
    value: function resizeObserver() {
      var _this4 = this;

      var callback = function callback(mutationsList) {
        if (window.innerWidth <= 490) return; // + 20 for the extra bottom margin

        var totalThumbsHeight = Array.from(_this4.thumbs.children).reduce(function (prev, thumb) {
          return prev + (thumb.offsetHeight + 20);
        }, 0);
        var height = mutationsList[0].contentRect.height;
        _this4.thumbs.style.height = totalThumbsHeight < height ? totalThumbsHeight + 'px' : height + 'px';
      };

      try {
        this.observer = new ResizeObserver(callback);
        this.observer.observe(document.querySelector('.PDP_mainImage'));
      } catch (err) {
        console.log('err:', err);
      }
    }
  }, {
    key: "stickyCTA",
    value: function stickyCTA() {
      var submitBTN = document.querySelector('.PDP__cart-submit');
      var bottomDropDown = document.querySelector('.m-dropdown-quantity');
      var hasSticky = false;
      var options = {
        childList: true
      };

      function handleIntersect(entries, observer) {
        var isVisable = entries[0].isIntersecting;
        var isBelowScreen = entries[0].boundingClientRect.bottom > window.innerHeight;

        if (!isVisable && !hasSticky && isBelowScreen) {
          submitBTN.classList.add('PDP-btn-sticky');
          hasSticky = true;
        } else if (hasSticky && isVisable) {
          submitBTN.classList.remove('PDP-btn-sticky');
          hasSticky = false;
        }
      }

      var observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(bottomDropDown);
    }
  }, {
    key: "popState",
    value: function popState() {
      var _this5 = this;

      window.addEventListener('popstate', function (e) {
        _this5.state.browserBack = true;
        var state = e.state;
        state ? state.collection ? _this5.updateWithCollection(state) : _this5.updateWithProduct(state) : location.reload();
      });
    }
  }, {
    key: "updateProductContent",
    value: function updateProductContent(data, color) {
      var _this6 = this;

      console.log('data:', data);
      var product = data.product || data;
      if (!product) return;
      var variants = product.variants;
      /* By default first variant is selected for the id */

      var id = variants[0].id.replace(/[^0-9]/g, '');
      var images = product.images;
      /* Update URL with new handle */

      var nextURL = window.location.href.replace(/(.+\/products\/)(.+)/, "$1".concat(product.handle));
      !this.state.browserBack && history.pushState(data, "", nextURL);
      PDP.PDP_elements.forEach(function (el) {
        var _product$more_informa;

        var classNames = el.classList[0];

        switch (classNames) {
          case 'breadcrumb':
            el.querySelector('#dv_rbd02').textContent = product.title;
            break;

          case 'PDP_thumbs':
            var newChildren = images.reduce(function (arr, image, i) {
              /* Show thumbs only if not plain swatch color (200x200) or first image which is the main image */
              var ratio = image.width / image.height;

              if (ratio < 1 && ratio > .7) {
                var div = document.createElement('div');
                div.className = 'PDP_thumb showNewImg';
                var img = new Image();
                img.src = image.url;
                div.appendChild(img);
                arr.push(div);
              }

              return arr;
            }, []);
            /* If only the main image exist for a thumb remove all thumbs */

            if (newChildren.length == 1) return el.replaceChildren.apply(el, []);
            el.replaceChildren.apply(el, _toConsumableArray(newChildren));
            _this6.thumbs = document.querySelector('.PDP_thumbs');
            break;

          case 'PDP_mainImage':
            var currentThumbs = Array.from(el.children);
            currentThumbs.forEach(function (currentIMG) {
              if (currentIMG.className === 'fade-in') {
                currentIMG.classList.add('fade-in');

                currentIMG.onload = function (e) {
                  this.classList.add('fade-in');
                };

                currentIMG.src = images[0].url;
              } else {
                currentIMG.remove();
              }
            });

            _this6.positionThumbs();

            break;

          case 'PDP_heading-title':
            el.textContent = product.title;
            break;

          case 'wish-list-heart':
            el.setAttribute('data-product-id', id);
            el.className = "wish-list-heart swym-button swym-add-to-wishlist-view-product product_".concat(id, " swym-icon swym-heart swym-loaded disabled swym-added swym-adding");
            break;

          case 'PDP_inventory':
            var inventoryToString = product.totalInventory + '';
            el.style.visibility = 'visible';
            el.textContent = inventoryToString.replace(/[^\d]/g, '').split(/(?=(?:\d{3})+(?:\.|$))/g).join(",") + ' in stock';
            break;

          case 'PDP_price':
            el.textContent = '$' + Number(product.priceRangeV2.minVariantPrice.amount).toFixed(2);

            if (!_this6.isWickProduct()) {
              var inputs = Array.from(document.querySelectorAll('.variant-select input'));
              var labels = Array.from(document.querySelectorAll('.product-form-size label'));
              var _variants = product.variants;
              /* updates all variant dropdowns for non wicks with price */

              inputs.length && _variants.reduce(function (i, variant) {
                var id = variant.id.replace(/[^0-9]/g, '');
                if (i < labels.length) labels[i].setAttribute('for', id);

                if (!i) {
                  inputs[i].setAttribute('data-variant-price', variant.price);
                  inputs[i].value = id;
                  inputs[i].id = "default";
                }

                i++;
                inputs[i].setAttribute('data-variant-price', variant.price);
                inputs[i].value = id;
                inputs[i].id = id;
                return i;
              }, 0);
            }

            break;

          case 'PDP_description':
            if (product.descriptionHtml === '') break;
            el.innerHTML = product.descriptionHtml;
            break;

          case 'PDP_color':
            el.textContent = 'Color: ' + color;
            document.querySelector('circle[style]').removeAttribute('style');
            document.querySelector("[data-swatch-color=\"".concat(color, "\"] circle")).style.strokeDashoffset = 0;
            break;

          case 'PDP_bulk_message':
            el.style.transform = null;
            break;

          case 'btn-dropdown-quantity':
            el.children[0].checked = true;
            break;

          case 'variant-select':
            el.children[0].checked = true;
            break;

          case 'PDP__cart-submit':
            // Logic for out of stock swatches or back to instock swatch upon click swatches
            if (product.totalInventory == 0) {
              el.children[0].textContent = 'out of stock';
              return el.setAttribute('disabled', '');
            } else {
              el.removeAttribute('disabled');
            }
            /* REMOVE IF PRICE IS NOT NEEDED IN ADD TO CART BUTTON */


            el.children[0].textContent = 'add to cart - ' + '$' + Number(product.priceRangeV2.minVariantPrice.amount).toFixed(2);
            el.setAttribute('data-productid', id);
            break;

          case 'PDP-more-information':
            var moreInformation = (_product$more_informa = product.more_information) === null || _product$more_informa === void 0 ? void 0 : _product$more_informa.value;

            if (moreInformation) {
              el.innerHTML = '<p>' + moreInformation.split('<br>').join('</p><p>') + '</p>';
            }

            break;

          case 'PDP-made-better':
            var madeBetter = _this6.state.madeBetter;

            if (madeBetter) {
              el.innerHTML = '';
              var i = product.tags.length;

              var _loop = function _loop() {
                var tag = new RegExp(product.tags[i], 'i');
                var index = madeBetter.icons.findIndex(function (icon) {
                  return tag.test(icon);
                });

                if (index != -1) {
                  var div = document.createElement('div');
                  div.className = 'PDP-icon-content';
                  var html = "<a href=\"/pages/makesy-made-better\" target=\"_blank\">\n                                                <img  src=\"".concat(madeBetter.icons[index], "\"> \n                                            </a>\n                                            <p>").concat(madeBetter.desc[index], "</p>");
                  div.innerHTML = html;
                  el.appendChild(div);
                }
              };

              while (i--) {
                _loop();
              }
            }

            break;
        }

        _this6.state.browserBack = false;
      });
    }
  }, {
    key: "swatchColorUpdate",
    value: function swatchColorUpdate(dataset) {
      var _this7 = this;

      var swatchProductId = dataset.swatchProductId,
          swatchColor = dataset.swatchColor;
      fetch('https://api.makesy.com/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: swatchProductId
        })
      }).then(function (res) {
        return res.json();
      }).then(function (product) {
        _this7.updateProductContent(product.data, swatchColor);
      })["catch"](function (err) {
        return console.log('err: ', err);
      });
    }
  }, {
    key: "swatchers",
    value: function swatchers() {
      var _this8 = this;

      var swatches_container = document.querySelector('.PDP_swatches');
      if (swatches_container) swatches_container.onclick = function (e) {
        if (e.target.className == 'swatch_color-item') _this8.swatchColorUpdate(e.target.dataset);
      };
    }
    /* Only running if a sale exist */

  }, {
    key: "saleFunc",
    value: function () {
      var _saleFunc = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(formData) {
        var vipProduct, res, cart, itemExists;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (formData) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                console.log('formData:', formData);
                vipProduct = document.querySelector('[data-vip]');
                /* If data-vip data attribute exist then customer has makesy_vip tag and qualifies for 
                *  Same day processing product 
                */

                if (!vipProduct) {
                  _context.next = 16;
                  break;
                }

                _context.next = 7;
                return fetch('/cart.js' + '?view=drawer&timestamp=' + Date.now(), {
                  credentials: 'same-origin'
                });

              case 7:
                res = _context.sent;
                _context.next = 10;
                return res.json();

              case 10:
                cart = _context.sent;
                itemExists = cart.items.some(function (item) {
                  return item.id == 42123741593754;
                }); // Product already in the cart

                if (!itemExists) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return", add_to_cart(formData));

              case 14:
                formData.items.push({
                  id: 42123741593754,
                  quantity: 1
                });
                return _context.abrupt("return", add_to_cart(formData));

              case 16:
                add_to_cart(formData);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function saleFunc(_x4) {
        return _saleFunc.apply(this, arguments);
      }

      return saleFunc;
    }()
  }, {
    key: "isWickProduct",
    value: function isWickProduct() {
      // return /wick/i.test(window.location.pathname) && !/clip|candle-accessories|maker-tools|Virtual Mini Kits/i.test(meta.product.type)
      return /wick/i.test(window.location.pathname) && !/clip|candle-accessories|maker-tools/i.test(meta.product.type);
    }
  }, {
    key: "processFormData",
    value: function processFormData(e) {
      var submitBtn = document.querySelector('.PDP__cart-submit');
      var btn_bulk_discounts = submitBtn.dataset.bulkDiscounts;
      var inputs = Array.from(document.querySelectorAll('.PDP_product-form input:checked')); // Change to specific input
      // Only first input has dataset attribute

      var elementNotSelected = inputs.find(function (input) {
        return input.dataset.index == '0' && input.dataset.productId;
      });
      if (elementNotSelected) return this.addMessage("".concat(elementNotSelected.name), true, true);
      var variantId = inputs.length > 2 && this.getPriceAndVariant().id;
      var formData = inputs.reduce(function (obj, _ref) {
        var dataset = _ref.dataset,
            value = _ref.value,
            name = _ref.name;

        // Just quantity dropdown exist
        if (inputs.length == 1) {
          obj.id = submitBtn.dataset.productVariantId;
          obj.quantity = inputs[0].value;

          if (btn_bulk_discounts) {
            var bulk_discount_obj = JSON.parse(btn_bulk_discounts);
            obj.properties = {
              _percent: bulk_discount_obj.percent,
              _quantity: bulk_discount_obj.quantity
            };
          }

          return obj;
        }

        var bulk_discounts = dataset['bulkDiscounts'];

        if (bulk_discounts) {
          var _bulk_discount_obj = JSON.parse(bulk_discounts);

          obj.properties = {
            _percent: _bulk_discount_obj.percent,
            _quantity: _bulk_discount_obj.quantity
          };
          obj.id = value;
        } else if (name == 'quantity') {
          obj.quantity = value;
        } else if (variantId) {
          obj.quantity = value;
          obj.id = variantId;
        } else obj.id = value;

        return obj;
      }, {});
      return {
        items: [formData]
      };
    }
  }, {
    key: "cartController",
    value: function cartController(e) {
      var formData = this.isWickProduct() ? this.processWickFormData(e.target) : this.processFormData(e.target);
      /* Only if running a sales function */

      if (this.isSale) return this.saleFunc(formData);
      add_to_cart(formData);
    }
  }], [{
    key: "PDP_elements",
    get: function get() {
      return document.querySelectorAll('.breadcrumb, .PDP_thumbs, .PDP_mainImage, .PDP_heading-title, .wish-list-heart, .PDP_price, .PDP_inventory,' + '.PDP_description, .PDP_color, .btn-dropdown-quantity, .variant-select, .PDP_bulk_message, .PDP__cart-submit, .PDP-more-information, .PDP-made-better');
    }
  }]);

  return PDP;
}();

var PDP_wicks = /*#__PURE__*/function (_PDP) {
  _inherits(PDP_wicks, _PDP);

  var _super = _createSuper(PDP_wicks);

  function PDP_wicks() {
    var _this9;

    var isSale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, PDP_wicks);

    _this9 = _super.call(this);
    _this9.isSale = isSale;

    _this9.toggleMenu();

    _this9.bulk_message = document.querySelector('.PDP_bulk_message');
    _this9.error_message = document.querySelector('.PDP_error_message');
    _this9.flyout_el = document.querySelector('.Dialog__values');
    _this9.dropDownRadios = document.querySelectorAll('.PDP-options button');
    _this9.dialogInputs = document.querySelector('.Dialog_input'); // All because of wick sample kits, burn the wicks !!!!!!

    _this9.submitBTN = document.querySelector('.PDP__cart-submit');
    _this9.hasTopCollectionDropDown = document.querySelector('.product-form-collection');
    /* Initial load for PDP option dropdowns */

    if (_this9.isWickProduct() && _this9.dialogInputs) {
      var _document$querySelect, _document$querySelect2, _document$querySelect3, _document$querySelect4;

      var collectionID = (_document$querySelect = document.querySelector('[data-collection-id]')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.dataset) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.collectionId;
      console.log('collectionID:', collectionID);
      var productID = (_document$querySelect3 = document.querySelector('[data-products-id]')) === null || _document$querySelect3 === void 0 ? void 0 : (_document$querySelect4 = _document$querySelect3.dataset) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.productsId;
      collectionID ? _this9.collectionAPI(collectionID) : _this9.productAPI(productID);
      history.replaceState(0, "", window.location.pathname);
      var wickProdSelection = document.querySelector('.Dialog_list');
      /* if flyout is not needed remove below */

      _this9.dropDownRadios.length && wickProdSelection.addEventListener('mouseover', _this9.updateFlyOut.bind(_assertThisInitialized(_this9)));
    }

    return _this9;
  }

  _createClass(PDP_wicks, [{
    key: "processWickFormData",
    value: function processWickFormData() {
      var _document$querySelect7;

      var inputs = Array.from(document.querySelectorAll('.PDP_product-form input:checked'));
      console.log('inputs:', inputs);
      var quantity = document.querySelector('.m-quantity-select:checked').value;

      if (inputs.length <= 3) {
        var _document$querySelect5, _document$querySelect6;

        console.log((_document$querySelect5 = document.querySelector('.wick-variant-select input:checked')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.value);
        return {
          items: [{
            id: ((_document$querySelect6 = document.querySelector('.wick-variant-select input:checked')) === null || _document$querySelect6 === void 0 ? void 0 : _document$querySelect6.value) || this.submitBTN.dataset.productVariantId,
            quantity: quantity
          }]
        };
      }

      var widthNotSelected = inputs.some(function (input) {
        return input.id == 'default' && input.name == 'Width';
      });
      console.log('widthNotSelected:', widthNotSelected);

      if (widthNotSelected) {
        this.addMessage('Please select a width', true, true);
        return false;
      }

      var packSize = (_document$querySelect7 = document.querySelector('#select-pack-size input:checked')) === null || _document$querySelect7 === void 0 ? void 0 : _document$querySelect7.value;
      var clipIndex = packSize == '100' || !packSize ? 0 : 1;
      var variantId = this.getPriceAndVariant().id.replace(/[^0-9]/g, '');
      console.log('variantId:', variantId);
      /* Wick products with option dropdowns */

      var formData = inputs.reduce(function (arr, input) {
        var name = input.name.trim().toLowerCase();

        if (name === 'quantity') {
          var wickOBJ = {
            id: variantId,
            quantity: quantity,
            properties: clipIndex ? {
              _percent: '10,15',
              _quantity: '10,50'
            } : null
          };
          arr.push(wickOBJ);
          return arr;
        }

        if (name === 'clips') {
          /* Two variant id's for the clips inputs */
          var id = input.value.split(',')[clipIndex];
          if (['true', 'Pre-Inserted'].includes(input.id)) arr.push({
            id: id,
            quantity: quantity
          });
          /* CUSTOM WICK SETUP FEE */

          if (packSize == '100' && /custom-wick/i.test(meta.product.type)) arr.push({
            id: 35935883853978,
            quantity: 1
          });
        }

        return arr;
      }, []);
      console.log('formData:', formData);
      return {
        items: formData
      };
    }
  }, {
    key: "updateWithCollection",
    value: function updateWithCollection(data) {
      var isInitialPageLoad = typeof this.state.products === 'undefined';
      var products = data.products;
      this.state.options = {};
      this.state.wickPricings = {};
      this.state = _objectSpread(_objectSpread({}, this.state), data);
      console.log('collection products:', products);
      console.log('this.hasTopCollectionDropDown:', this.hasTopCollectionDropDown);
      if (!this.hasTopCollectionDropDown && !this.dropDownRadios.length) return;
      var variants = products[0].variants;

      var productContent = _objectSpread(_objectSpread(_objectSpread({}, products[0]), data), {}, {
        title: data.title
      });

      if (isInitialPageLoad) {
        this.filterFlyOutData(products);
        return this.loadOptionDropDowns(variants);
      }

      this.updateProductContent(productContent);
      this.loadOptionDropDowns(variants);
      this.loadWickTypeDropDown(products);
    }
  }, {
    key: "updateWithProduct",
    value: function updateWithProduct(data) {
      console.log('updatewithproduct', data);
      var isInitialPageLoad = typeof this.state.flyout === 'undefined';
      this.state = _objectSpread(_objectSpread(_objectSpread({}, this.state), data), {}, {
        quantity: '0'
      });

      if (isInitialPageLoad && this.dropDownRadios.length) {
        this.state.flyout = [data.product.fly_out.value];
        this.updateFlyOut();
        return this.loadOptionDropDowns(data.product.variants);
      }

      this.updateProductContent(data);
      this.loadOptionDropDowns(data.variants);
    }
  }, {
    key: "updateWickProduct",
    value: function updateWickProduct(target) {
      var id = target.id;
      var title = target.title;
      var name = target.name;
      if (name === 'product') document.querySelector('[for="default"]').textContent = title;
      /* If dropdown only has one option don't hit api */

      if (document.querySelectorAll("[name=\"".concat(name, "\"]")).length <= 2) return;

      if (name === 'collection') {
        return this.collectionAPI(id);
      }

      var product = this.state.products.find(function (product) {
        return product.title === title;
      });
      this.updateWithProduct(product);
    }
  }, {
    key: "updateFlyOut",
    value: function updateFlyOut(e) {
      var values = this.state.flyout;
      var target = e === null || e === void 0 ? void 0 : e.target;

      if (target) {
        var oldDiv = this.flyout_el.firstElementChild;
        var index = target.getAttribute("index");

        if (values[index]) {
          var div = document.createElement('div');
          div.innerHTML = values[index];
          this.flyout_el.replaceChild(div, oldDiv);
          var newHeight = div.getBoundingClientRect().height + 42 + 'px';
          this.flyout_el.style.height = newHeight;
        }
      } else {
        var _div = document.createElement('div');

        _div.innerHTML = values[0];
        this.flyout_el.appendChild(_div);

        var _newHeight = _div.getBoundingClientRect().height + 42 + 'px';

        this.flyout_el.style.height = _newHeight;
      }
    }
  }, {
    key: "filterFlyOutData",
    value: function filterFlyOutData(products) {
      var flyout_data = products.map(function (product) {
        return product.fly_out.value.replace(/<span>/, '<span class="bl-space">');
      });
      this.state.flyout = flyout_data;
      this.updateFlyOut();
    }
    /* Filters and removes duplicates in variants options */

  }, {
    key: "filterOptions",
    value: function filterOptions(variants) {
      var _this10 = this;

      this.state.options = {};
      this.state.wickPricings = {};
      return variants.reduce(function (newObj, _ref2, j) {
        var title = _ref2.title,
            id = _ref2.id,
            price = _ref2.price,
            selectedOptions = _ref2.selectedOptions;

        /* Update options state */
        _this10.state.options[title] = id.replace(/[^0-9]/g, '');
        _this10.state.wickPricings[j] = Number(price);
        selectedOptions.reduce(function (prev, _ref3) {
          var name = _ref3.name,
              value = _ref3.value;
          var key = "".concat(name);

          if (prev[key]) {
            /* push new value only if it's not included in the array */
            if (!prev[key].includes(value)) prev[key].push(value);
          } else {
            prev[key] = [value];
          }

          return prev;
        }, newObj);
        return newObj;
      }, {});
    }
    /* Loads Width, Height, Pack Size dropdowns 
    * Callback function to which cart api to hit
    */

  }, {
    key: "loadOptionDropDowns",
    value: function loadOptionDropDowns(data, callback) {
      var _this11 = this;

      console.log('data, callback:', data);
      if (!this.dropDownRadios.length) return;
      var dropDownLabels = document.querySelectorAll('.PDP-options .menu-list');
      var priceElement = document.getElementsByClassName('PDP_price')[0]; // Remove all inputs and li elements if not default input

      Array.from(document.querySelectorAll('.PDP-options input, .PDP-options li')).forEach(function (el) {
        return !el.checked && el.remove();
      });
      var currentChecked = document.querySelectorAll('.PDP-options input:checked');

      var filterData = function filterData(data) {
        var _data$product;

        var variants = ((_data$product = data.product) === null || _data$product === void 0 ? void 0 : _data$product.variants) || data;
        var lowestPrice = variants.reduce(function (prev, el) {
          var prevPrice = Number(prev.price || prev);
          var currentPrice = Number(el.price);
          if (currentPrice < prevPrice) prev = currentPrice;
          return prevPrice;
        });
        priceElement.textContent = '$' + lowestPrice.toFixed(2);

        var options = _this11.filterOptions(variants);

        console.log('this.state', _this11.state.options);

        _this11.dropDownRadios.forEach(function (btn, i) {
          var inputName = Object.keys(options)[i];
          currentChecked[i].title = inputName;
          currentChecked[i].value = options[inputName][0];
          currentChecked[i].id = "default";
          options[inputName].forEach(function (optionValue) {
            /* Input dropdowns */
            var input = document.createElement('input');
            Object.assign(input, {
              type: "radio",
              id: optionValue,
              name: inputName,
              title: optionValue,
              value: optionValue
            });
            input.setAttribute('data-index', i);
            btn.appendChild(input);
            /* Label dropdowns */

            var li = document.createElement('li');
            li.setAttribute('data-index', i);
            var label = document.createElement('label');
            label.setAttribute('for', optionValue);
            label.textContent = optionValue;
            li.appendChild(label);
            dropDownLabels[i].appendChild(li);
          });
        });
      };

      callback ? callback(data, filterData) : filterData(data);
    }
    /* Only top dropdown exist for collections */

  }, {
    key: "loadWickTypeDropDown",
    value: function loadWickTypeDropDown(products) {
      console.log('loadWickTypeDropDown products:', products);
      var firstInput = document.querySelector('.product-form-size input');
      var Dialog__list = document.querySelector('.Dialog_list'); // Remove all inputs and labels

      Array.from(Dialog__list.querySelectorAll('li')).forEach(function (el) {
        return el.remove();
      });
      products.forEach(function (_ref4, i) {
        var id = _ref4.id,
            variants = _ref4.variants,
            title = _ref4.title;
        var val = variants === null || variants === void 0 ? void 0 : variants[0].id;

        if (i == 0) {
          firstInput.id = "default";
          firstInput.value = val;
          firstInput.title = "Select a wick type";
        }
        /* Input for dropdowns */


        var input = document.createElement('input');
        Object.assign(input, {
          className: "Dialog_input",
          type: "radio",
          id: id,
          name: 'product',
          title: title,
          value: val
        });
        /* Label dropdowns */

        var li = document.createElement('li');
        var label = document.createElement('label');
        label.className = "Dialog_label";
        label.setAttribute('for', id);
        label.textContent = title;
        li.append(input, label);
        Dialog__list.appendChild(li);
      });
    }
  }, {
    key: "getBulkDiscounts",
    value: function getBulkDiscounts() {
      var selected_quantity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var inputs = arguments.length > 1 ? arguments[1] : undefined;
      var bulk_obj = inputs && inputs.reduce(function (obj, input) {
        var bulk_discounts = input.dataset['bulkDiscounts'];
        console.log('bulk_discounts:', bulk_discounts);
        /* check to make sure input has bulk discount dataset */

        if (!bulk_discounts) return obj;

        var _JSON$parse = JSON.parse(bulk_discounts),
            percent = _JSON$parse.percent,
            quantity = _JSON$parse.quantity;

        var q = quantity.split(',').map(Number);
        var p = percent.split(',').map(Number);
        var index = q.reduce(function (prev, quantity, i) {
          if (quantity <= Number(selected_quantity)) prev = i;
          return prev;
        }, 0);
        var nextIndex = q[index] - selected_quantity < 0 ? index + 1 : index;
        obj.index = nextIndex;
        obj.percent = p;
        obj.quantity = q;
        return obj;
      }, {});
      return Object.keys(bulk_obj).length === 0 ? false : bulk_obj;
    }
    /**
     * 
     * @param {String} message The message you want to be sent to the user
     * @param {Boolean} open true or false if the message is currently displayed to the user
     * @param {Boolean} error true or false if it's a error message
     * @returns {void} Just used to short circuit conditional
     */

  }, {
    key: "addMessage",
    value: function addMessage(message, open, error) {
      if (error) {
        this.error_message.style.transform = open ? 'translate(0px, 0px)' : null;
        return this.error_message.textContent = message;
      }

      this.bulk_message.style.transform = open ? 'translate(0px, 0px)' : null;
      this.bulk_message.textContent = message;
    }
    /**
     * 
     * @param {Number} selected_quantity Quanity selected from product dropdown
     * @returns {void} Just used to short circuit conditional
     */

  }, {
    key: "bulkMessage",
    value: function bulkMessage(selected_quantity) {
      /* Wicks only message */
      if (this.isWickProduct()) {
        var _document$querySelect8;

        var packSize = (_document$querySelect8 = document.querySelector('#select-pack-size input:checked')) === null || _document$querySelect8 === void 0 ? void 0 : _document$querySelect8.value;
        if (!packSize) return;
        var message = '';

        if (packSize == '100') {
          return this.addMessage('', false, false);
        } else if (selected_quantity > 10) {
          var tierQuantity = 50 - selected_quantity;

          if (tierQuantity <= 0) {
            message = 'You qualify for 15% off 50 Packs of 1000';
          } else {
            message = "You're ".concat(tierQuantity, " away from receiving 15% off for 50 Packs of 1000");
          }
        } else {
          var _tierQuantity = 10 - selected_quantity;

          if (_tierQuantity <= 0) {
            message = 'You qualify for 10% off 10 Packs of 1000';
          } else message = "You're ".concat(_tierQuantity, " away from receiving 10% off for 10 Packs of 1000");
        }

        this.addMessage(message, true, false);
        /* Everything else but Wicks message */
      } else {
        var inputs = Array.from(document.querySelectorAll('.variant-select input:checked, .PDP__cart-submit'));
        var message_obj = this.getBulkDiscounts(selected_quantity, inputs);
        var title = this.state.checkedTitle || document.querySelector('.PDP__cart-submit').title;

        if (message_obj) {
          var index = message_obj.index,
              percent = message_obj.percent,
              quantity = message_obj.quantity;
          var nextTierQuantity = quantity[index] - selected_quantity;
          var exactQuantity = nextTierQuantity == 0;
          var _message = ''; // *** Basically this can be used for current discount as well, right now set up for max possible disocunts if selected 100 quatity

          if (exactQuantity) {
            _message = "You qualify for ".concat(percent[index], "% off ").concat(title);
          } else if (isNaN(nextTierQuantity)) {
            _message = "You qualify for ".concat(percent[index - 1], "% off ").concat(title);
          } else {
            _message = "Add ".concat(nextTierQuantity, " more for ").concat(percent[index], "% off ").concat(title);
          }

          this.addMessage(_message, true, false);
        }
      }
    }
  }, {
    key: "updateInventory",
    value: function updateInventory(_ref5) {
      var title = _ref5.title,
          name = _ref5.name,
          dataset = _ref5.dataset;
      var inventoryEl = document.querySelector('.PDP_inventory');
      var stockCount = Number(dataset === null || dataset === void 0 ? void 0 : dataset.stock) || 0;
      var continueSellingOutOfStock = (dataset === null || dataset === void 0 ? void 0 : dataset.policy) === 'continue';

      if (stockCount === 0 && !continueSellingOutOfStock) {
        this.submitBTN.children[0].textContent = 'out of stock';
        return this.submitBTN.setAttribute('disabled', '');
      } else {
        this.submitBTN.children[0].textContent = this.submitBTN.children[0].textContent.replace(/out of stock/, 'add to cart');
        this.submitBTN.removeAttribute('disabled');
      }

      if (!inventoryEl) return; // Remove inventory if case pack is selected

      /case pack/i.test(title) ? inventoryEl.style.visibility = 'hidden' : inventoryEl.style.visibility = 'visible';

      if (name == 'Style' || name == 'Size') {
        if (stockCount <= 0) return inventoryEl.textContent = '';
        if (stockCount < 100) return inventoryEl.textContent = 'less than 100 in stock';
        inventoryEl.textContent = (dataset === null || dataset === void 0 ? void 0 : dataset.stock.split(/(?=(?:\d{3})+(?:\.|$))/g).join(",")) + ' in stock';
      }
    }
  }, {
    key: "getPriceAndVariant",
    value: function getPriceAndVariant() {
      var sizeInputs = Array.from(document.querySelectorAll('.options-select input:checked'));
      console.log('sizeInputs:', sizeInputs); // If no options exist for wick product

      if (!sizeInputs.length) {
        var _document$querySelect9 = document.querySelector('[data-product-variant-id]').dataset,
            productVariantId = _document$querySelect9.productVariantId,
            variantPrice = _document$querySelect9.variantPrice;
        return {
          id: Number(productVariantId),
          price: Number(variantPrice)
        };
      }

      var clipsPrice = 0;

      if (this.isWickProduct()) {
        var clips = document.querySelector('.PDP-clips input:checked');
        var clipIndex = sizeInputs[2].value === '100' ? 0 : 1;
        clipsPrice = Number(clips.dataset.variantPrice.split(',')[clipIndex]) || 0;
      }

      var priceObj = this.state.wickPricings;
      var selectedVariant = sizeInputs.map(function (input) {
        return input.value;
      }).join(' / ');
      var index = Object.keys(this.state.options).findIndex(function (key) {
        return key == selectedVariant;
      });
      var price = clipsPrice + priceObj[index];
      var id = this.state.options[selectedVariant];
      console.log('id:', id);
      console.log('price:', price);
      return {
        id: id,
        price: price
      };
    }
    /* Updated from quantity selector */

  }, {
    key: "updatePrice",
    value: function updatePrice() {
      var selectedPrice = 0;

      if (this.isWickProduct()) {
        selectedPrice = this.getPriceAndVariant().price;
      } else {
        var _document$querySelect10, _document$querySelect11, _document$querySelect12, _document$querySelect13, _document$querySelect14, _document$querySelect15;

        selectedPrice = Number((_document$querySelect10 = document.querySelector('.variant-select input:checked, .wick-variant-select input:checked')) === null || _document$querySelect10 === void 0 ? void 0 : (_document$querySelect11 = _document$querySelect10.dataset) === null || _document$querySelect11 === void 0 ? void 0 : (_document$querySelect12 = _document$querySelect11.variantPrice) === null || _document$querySelect12 === void 0 ? void 0 : _document$querySelect12.replace(/,/, '')) || Number((_document$querySelect13 = document.querySelector('.PDP__cart-submit')) === null || _document$querySelect13 === void 0 ? void 0 : (_document$querySelect14 = _document$querySelect13.dataset) === null || _document$querySelect14 === void 0 ? void 0 : (_document$querySelect15 = _document$querySelect14.variantPrice) === null || _document$querySelect15 === void 0 ? void 0 : _document$querySelect15.replace(/,/, ''));
      }

      var selectedQuantity = Number(document.querySelector('.m-dropdown-quantity input:checked').value);
      var displayPrice = document.querySelector('.PDP_price');
      var btnPrice = document.querySelector('.PDP__cart-submit span');
      var originalText = btnPrice.textContent.split('-')[0];
      var newPrice = selectedQuantity * selectedPrice;
      console.log('newPrice:', newPrice);
      displayPrice.textContent = '$' + newPrice.toFixed(2);
      btnPrice.textContent = originalText + ' - ' + '$' + newPrice.toFixed(2);
    }
  }, {
    key: "checkOptionCombinations",
    value: function checkOptionCombinations(value) {
      var _this12 = this;

      var inputs = Array.from(document.querySelectorAll("input[data-index=\"1\"]"));
      if (inputs.length <= 2) return;
      var list_items = Array.from(document.querySelectorAll("li[data-index=\"1\"]"));
      var nextSelection = inputs.map(function (el) {
        return "".concat(value, " / ").concat(el.value);
      }); // Need to swap value and el.value when height checked if doing it that way.

      console.log('nextSelection:', nextSelection);
      var found = nextSelection.reduce(function (obj, selection, i) {
        var compareRegex = new RegExp(selection, 'i');
        /* returns true if height is not found in state */

        var heightNotFound = Object.keys(_this12.state.options).every(function (option) {
          return !compareRegex.test(option);
        });
        heightNotFound ? obj.notFound.push(i) : obj.exists.push(i);
        return obj;
      }, {
        exists: [],
        notFound: []
      });
      console.log('found:', found); // Show dropdown items if display none

      found.exists.forEach(function (index, i) {
        if (index) {
          // li elements
          list_items[index - 1].style = null; // input elements

          inputs[index].style = null;
        }

        if (!i) {
          var id = inputs[index].id;
          inputs[0].checked = true; // Usually means all combinations work if default is found

          if (id !== 'default') inputs[0].value = inputs[index].id;
        }
      }); // If all Width and Heights match no need to hide dropdowns

      if (!found.notFound.length) return; // Hide dropdown items if height doesn't exist

      found.notFound.forEach(function (index, i) {
        if (index) {
          // li elements
          list_items[index - 1].style.display = 'none'; // input elements

          inputs[index].style.display = 'none';
        }
      });
    }
  }, {
    key: "updateOptionValues",
    value: function updateOptionValues(e) {
      var _e$target, _e$target$dataset;

      var name = e.target.name;
      var optionIndex = (_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$dataset = _e$target.dataset) === null || _e$target$dataset === void 0 ? void 0 : _e$target$dataset.index;
      var value = e.target.value;
      console.log('value:', value);
      var title = e.target.title;

      if (['collection', 'product'].includes(name)) {
        this.updateWickProduct(e.target);
      } else if (['0', '1', '2'].includes(optionIndex)) {
        if (optionIndex == '0') {
          this.addMessage('', false, true);
          this.checkOptionCombinations(value);
        }

        this.bulkMessage(this.state.quantity);
        this.updatePrice();
      } else if (name == 'quantity') {
        this.addMessage('', false, true);
        this.state.quantity = value;
        this.updatePrice();
        this.bulkMessage(value);
      } else if (name == 'clips') {
        this.updatePrice();
      } else {
        this.addMessage('', false, true);
        this.updateInventory(e.target);
        var hasBulkDiscounts = e.target.dataset.bulkDiscounts;
        this.updatePrice();
        if (!hasBulkDiscounts) return this.bulk_message.style.transform = null; // Don't run message until quantity is selected above

        if (this.state.quantity) {
          this.state.checkedTitle = title;
          this.bulkMessage(this.state.quantity);
        }
      }
    }
    /* Get a single product */

  }, {
    key: "productAPI",
    value: function productAPI(id, callback) {
      var _this13 = this;

      fetch('https://api.makesy.com/product', {
        // fetch('http://localhost:3005/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      }).then(function (res) {
        return res.json();
      }).then(function (resData) {
        var product = resData.data;
        if (!product) throw "Error at product api: in product-pdp.js";
        console.log('product res:', product);
        callback ? callback(resData.data) : _this13.updateWithProduct(resData.data);
      })["catch"](function (err) {
        return console.log('err: ', err);
      });
    }
  }, {
    key: "collectionAPI",
    value: function collectionAPI(id, callback) {
      var _this14 = this;

      console.log('id:', id); // fetch('https://api.makesy.com/collection-products', {

      fetch('https://api.makesy.com/db-collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (!data) throw "Error at collection api: in product-pdp.js";
        console.log('collection products res:', data);

        _this14.updateWithCollection(data); // callback && callback(resData.data)

      })["catch"](function (err) {
        return console.log('err: ', err);
      });
    } // Drop down variant select & quantity

  }, {
    key: "toggleMenu",
    value: function toggleMenu() {
      var buttons = Array.from(document.getElementsByClassName('PDP-dropdown-toggle'));
      var openMenu = '';
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var target = e.target;
          var dropdown = target.closest('.m-dropdown').getElementsByClassName('dropdown-menu-items')[0];
          /* Menu item clicked - update formdata object */

          if (target.tagName !== 'BUTTON') {
            return openMenu = '';
          }

          ;

          if (!openMenu) {
            document.addEventListener('click', hideDropDown);
            dropdown.style.transform = 'translateY(0) scale(1)';
            openMenu = dropdown;
          } else {
            /* When Menu is open but clicked on another menu */
            if (openMenu !== dropdown) {
              dropdown.style.transform = 'translateY(0) scale(1)';
              openMenu.style.transform = null;
              return openMenu = dropdown;
            }

            openMenu.style.transform = null;
            openMenu = '';
          }

          function hideDropDown(e) {
            document.removeEventListener('click', hideDropDown);
            if (!openMenu) return;
            openMenu.style.transform = null;
            openMenu = '';
          }
        });
      });
    }
  }]);

  return PDP_wicks;
}(PDP);

var pdp_wicks = new PDP_wicks(false); // window.addEventListener('DOMContentLoaded', (event) => {});
// addMessage(message, open, error) 
// Yotpo reviews add scrollbar if overflow dynamically
// window.addEventListener('DOMContentLoaded', (event) => {
//     const productContent = document.querySelector('.Product__InfoWrapper')
//     const scrollEl = document.querySelector('.c-arrow-down')
//     const resizeObserver = new ResizeObserver(entries => {
//         const height = entries[0].contentRect.height
//         if (height > 949 && window.innerWidth > 640) {
//             productContent.classList.add('scroll-bar-product')
//             scrollEl.querySelector('span').classList.add('animate-arrow')
//         } else
//             productContent.classList.remove('scroll-bar-product')
//     });
//     resizeObserver.observe(productContent);
//     let hasScrolled = false
//     productContent.addEventListener('scroll', (e) => {
//         if (!hasScrolled) scrollEl.style.display = 'none'
//         hasScrolled = true
//     })
// });
