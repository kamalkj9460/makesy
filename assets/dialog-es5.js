"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var DialogVarify = /*#__PURE__*/function () {
  /**
   * 
   * @param {Element} dialog - The dialog element 
   * @param {Array<string>} inputAttributes - name attributes of the built in verification; by default it's undefined
   */
  function DialogVarify(dialog, inputAttributes) {
    _classCallCheck(this, DialogVarify);

    this.state = {
      target: '',
      open: false,
      resized: false
    };
    this.dialog = dialog;
    this.offset = dialog.getBoundingClientRect();
    this.offset.currentX = 0;
    this.offset.currentY = 0;
    this.extraPadding = 30;
    this.inputAttributes = inputAttributes;
    this.inputAttributes && this.appendVarification();
  }

  _createClass(DialogVarify, [{
    key: "getFields",
    value: function getFields() {
      return {
        email: "\n            <div class=\"Varification__email\">\n                <p class=\"Varification__title\">EMAIL MUSTS:</p>\n                <div class=\"NumSymbol\">\n                    <span class=\"Varification__moveOn\"></span>\n                    <p>Correct characters</p>\n                </div>\n            </div>\n            ",
        password: "\n            <div class=\"Varification__pwd\">\n                <p class=\"Varification__title\">PASSWORD MUSTS:</p>\n                <div class=\"Minimum\">\n                    <span class=\"Varification__moveOn\"></span>\n                    <p>Minimum of 8 characters</p>\n                </div>\n                <div class=\"NumSymbol\">\n                    <span class=\"Varification__moveOn\"></span>\n                    <p>At least one number or symbol</p>\n                </div>\n                <div class=\"UpperLower\">\n                    <span class=\"Varification__moveOn\"></span>\n                    <p>Upper and lower case letters</p>\n                </div>\n            </div>\n            "
      };
    }
  }, {
    key: "appendVarification",
    value: function appendVarification() {
      var _this = this;

      var fragment = new DocumentFragment();
      var layoutEl = this.dialog.querySelector('.Dialog__layout');
      var vaerifyEl = document.createElement('div');
      vaerifyEl.className = 'Varification';
      vaerifyEl.innerHTML = this.inputAttributes.reduce(function (string, field) {
        return string + _this.getFields()[field];
      }, '');
      fragment.appendChild(vaerifyEl);
      layoutEl.appendChild(fragment);
    }
  }, {
    key: "open",
    value: function open(e) {
      e.preventDefault();
      this.target = e.target; // Stops from clicking on same target more than once

      if (this.state.target === this.target) return;
      this.closeListener();
      this.moveTo(true);
    }
  }, {
    key: "close",
    value: function close(e) {
      var _this2 = this;

      if (!this.state.open) return; // Remove the close listener after set with open

      this.removeCloseLisenter();
      if (e.target.className == 'Dialog_input') return setTimeout(function () {
        _this2.moveTo(false);
      }, 700);
      this.moveTo(false);
    }
  }, {
    key: "debounce",
    value: function debounce(fn, wait) {
      var _this3 = this;

      var t;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        clearTimeout(t);
        t = setTimeout(function () {
          return fn.apply(void 0, [_this3].concat(args));
        }, wait);
      };
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this4 = this;

      if (this.state.resized) return;

      var _document$body$getBou = document.body.getBoundingClientRect(),
          width = _document$body$getBou.width;

      var callback = function callback(mutationsList) {
        var pos = mutationsList[0].contentRect;
        if (width != pos.width) _this4.debounce(function () {
          _this4.updatePos();
        }, 400)();
        width = pos.width;
      };

      this.observer = new ResizeObserver(callback);
      this.observer.observe(document.body);
      this.state.resized = true;
    }
  }, {
    key: "removeResize",
    value: function removeResize() {
      this.observer.unobserve(document.body);
    }
  }, {
    key: "getElements",
    value: function getElements() {
      return {
        dialog: this.dialog,
        innerEl: this.dialog.querySelector('.Dialog__inner'),
        arrow: this.dialog.querySelector('.Dialog__arrow'),
        varifyEl: this.dialog.querySelector(".Varification__".concat(this.target.name))
      };
    }
  }, {
    key: "checkPos",
    value: function checkPos() {
      var dialogPos = this.dialog.getBoundingClientRect();
      var targetPos = this.target.getBoundingClientRect();
      var canFitRight = window.innerWidth - targetPos.right > dialogPos.width + this.extraPadding && targetPos.y > dialogPos.height / 2;
      var canFitLeft = targetPos.x > dialogPos.width + this.extraPadding && targetPos.y > dialogPos.height / 2;
      var canFitAbove = targetPos.y + this.extraPadding > dialogPos.height;
      return {
        canFitRight: canFitRight,
        canFitLeft: canFitLeft,
        canFitAbove: canFitAbove,
        offsetX: dialogPos.x,
        targetPos: targetPos,
        dialogPos: dialogPos
      };
    } // Update this.offset if screen changes

  }, {
    key: "updatePos",
    value: function updatePos() {
      var _this$getElements = this.getElements(),
          dialog = _this$getElements.dialog,
          arrow = _this$getElements.arrow;

      var _this$getPos = this.getPos(),
          x = _this$getPos.x,
          y = _this$getPos.y,
          side = _this$getPos.side;

      dialog.style.transform = "translate(".concat(~~x, "px, ").concat(~~y, "px)");
      arrow.className = "Dialog__arrow --".concat(side); // Update current postions of Dialog

      this.offset = this.dialog.getBoundingClientRect();
      this.offset.currentX = x;
      this.offset.currentY = y;
    }
    /** 
        Positions arrow 
        returns cordinates to update Dialog/modal
    **/

  }, {
    key: "getPos",
    value: function getPos() {
      var _this$checkPos = this.checkPos(),
          canFitRight = _this$checkPos.canFitRight,
          canFitLeft = _this$checkPos.canFitLeft,
          canFitAbove = _this$checkPos.canFitAbove,
          targetPos = _this$checkPos.targetPos,
          dialogPos = _this$checkPos.dialogPos; // Starts the dialog annitial position to the right of target


      var rightX = this.offset.currentX + (targetPos.right - dialogPos.x + this.extraPadding);
      var bottomY = this.offset.currentY + (targetPos.bottom + this.extraPadding - dialogPos.y);
      var x = 0;
      var y = 0;
      var side = ''; // Right side of target

      if (canFitLeft) {
        x = rightX - targetPos.width - dialogPos.width - this.extraPadding * 2;
        y = bottomY - this.extraPadding - dialogPos.height / 2 - targetPos.height / 2;
        side = 'right'; // Left side of target
      } else if (canFitRight) {
        x = rightX;
        y = bottomY - this.extraPadding - targetPos.height / 2 - dialogPos.height / 2;
        side = 'left'; // Bottom middle or Top middle of target
      } else {
        x = rightX - this.extraPadding - targetPos.width / 2 - dialogPos.width / 2; // Above target in middle

        if (canFitAbove) {
          y = bottomY - dialogPos.height - this.extraPadding - targetPos.height * 2;
          side = 'bottom';
        } else {
          y = bottomY;
          side = 'top';
        }
      }

      return {
        x: x,
        y: y,
        side: side
      };
    }
  }, {
    key: "showDetails",
    value: // Show the verification content per input
    function showDetails() {
      var _this5 = this;

      Array.from(this.dialog.querySelectorAll('.Varification__email, .Varification__pwd')).forEach(function (el) {
        if (el.classList.contains("Varification__".concat(_this5.target.name))) {
          _this5.verifyElement = el;
          return el.style.opacity = 1;
        }

        el.style.opacity = 0;
      });
    }
  }, {
    key: "moveTo",
    value: function moveTo(open) {
      var _this6 = this;

      var _this$getElements2 = this.getElements(),
          dialog = _this$getElements2.dialog,
          innerEl = _this$getElements2.innerEl,
          arrow = _this$getElements2.arrow,
          varifyEl = _this$getElements2.varifyEl;

      var _this$getPos2 = this.getPos(),
          x = _this$getPos2.x,
          y = _this$getPos2.y,
          side = _this$getPos2.side;

      var dur = open ? 350 : 350;
      var rotateDegree = 45;

      var _this$checkPos2 = this.checkPos(),
          canFitRight = _this$checkPos2.canFitRight,
          canFitLeft = _this$checkPos2.canFitLeft,
          canFitAbove = _this$checkPos2.canFitAbove;

      var rotateVertical = canFitRight && canFitAbove || canFitLeft && canFitAbove ? false : true; // If opened while already opened dont animate open again

      var hasStyle = !!dialog.style.transform && open;
      dialog.style.transition = hasStyle ? 'transform .3s cubic-bezier(0.25, 1, 0.5, 1)' : null;
      dialog.style.transform = "translate(".concat(~~x, "px, ").concat(~~y, "px)");
      arrow.className = !open ? 'Dialog__arrow' : "Dialog__arrow --".concat(side);
      this.showDetails();
      var start = 0;

      var animate = function animate(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / dur, 1);
        var ease = open ? DialogVarify.outBack(progress) : DialogVarify.outQuart(progress);
        var deg = !open ? rotateDegree * ease : rotateDegree - rotateDegree * ease;
        var rotate = !rotateVertical ? "rotateY(".concat(deg, "deg)") : "rotateX(".concat(deg, "deg)");
        innerEl.style.transformOrigin = !rotateVertical ? 'center bottom' : 'left center';

        if (_this6.state.open !== open) {
          innerEl.style.transform = rotate;
          innerEl.style.opacity = open ? 1 * ease : 1 - 1 * ease;
        }

        if (progress == 1) {
          if (!open) {
            _this6.inputAttributes && varifyEl.removeAttribute('style');
            _this6.dialog.style.pointerEvents = 'none';
            return _this6.state = {
              target: '',
              open: false,
              resized: false
            };
          }

          _this6.dialog.style.pointerEvents = 'auto';
          _this6.offset.currentX = x;
          _this6.offset.currentY = y;
          _this6.state.open = open;
          _this6.state.target = _this6.target;
          dialog.style.transition = null;

          _this6.onResize();
        } else {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, {
    key: "checkValidation",
    value:
    /* Only used if user supplies array of input fields to class instance */
    function checkValidation(e) {
      var target = e.target;
      var value = e.target.value;

      if (target.name == 'pwd') {
        var passingValues = DialogVarify.getPasswordStrength(value);
        this.dialog.querySelectorAll('.Varification__pwd span').forEach(function (passEl, i) {
          if (passingValues[i]) {
            return passEl.className = 'Varification__moveOn varify-active';
          }

          passEl.className = 'Varification__moveOn';
        });
      } else if (target.name == 'email') {
        var _passingValues = DialogVarify.checkEmail(value);

        this.dialog.querySelectorAll('.Varification__email span').forEach(function (passEl, i) {
          if (_passingValues[i]) {
            return passEl.className = 'Varification__moveOn varify-active';
          }

          passEl.className = 'Varification__moveOn';
        });
      }
    }
  }], [{
    key: "outQuart",
    value: function outQuart(n) {
      return --n * n * n + 1;
    }
  }, {
    key: "outBack",
    value: function outBack(n) {
      var s = 1.80158;
      return --n * n * ((s + 1) * n + s) + 1;
    }
  }, {
    key: "emailPasses",
    value: function emailPasses(email) {
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
    }
  }, {
    key: "passesCharLength",
    value: function passesCharLength(password) {
      return password.length >= 8;
    }
  }, {
    key: "hasCapitalLower",
    value: function hasCapitalLower(password) {
      return /[A-Z]/.test(password) && /[a-z]/.test(password);
    }
  }, {
    key: "hasNumberChar",
    value: function hasNumberChar(password) {
      return /[0-9]/.test(password);
    }
  }, {
    key: "hasNumberSpecial",
    value: function hasNumberSpecial(password) {
      return /[\"/$&+,:;=?@#0-9_|'.^*()%!-]/gi.test(password);
    }
  }, {
    key: "isStringPassword",
    value: function isStringPassword(password) {
      return getPasswordStrength(password) === 1;
    }
  }, {
    key: "getPasswordStrength",
    value: function getPasswordStrength(password) {
      /* Returns a number refering to input element index */
      var checks = [this.passesCharLength, this.hasNumberSpecial, this.hasCapitalLower];
      return checks.map(function (check) {
        return check(password);
      });
    }
  }, {
    key: "checkEmail",
    value: function checkEmail(email) {
      /* needs updating for other check methods */
      var checks = [this.emailPasses];
      return checks.map(function (check) {
        return check(email);
      });
    }
  }]);

  return DialogVarify;
}();

var dialog = {
  Dialog: function Dialog() {
    var dialogElement = document.querySelector('.Dialog');

    if (dialogElement) {
      dialog.Dialog = new DialogVarify(dialogElement);
      dialog.addListeners();
    }
  },
  listen: function listen(targets, name, func) {
    targets.forEach(function (target) {
      return target.addEventListener(name, func);
    });
    return function () {
      return targets.forEach(function (target) {
        return target.removeEventListener(name, func);
      });
    };
  },
  closeListener: function closeListener() {
    var closeTargets = document.querySelectorAll('.m-dropdown button, .PDP_grid');
    var remove = dialog.listen(closeTargets, 'click', function (e) {
      return dialog.Dialog.close(e);
    });
    dialog.Dialog.removeCloseLisenter = remove;
  },
  openListener: function openListener() {
    var _this7 = this;

    var target = document.querySelector('.m-variant-select.Dialog_input');
    target.addEventListener('click', function (e) {
      return _this7.Dialog.open(e);
    });
  },
  addListeners: function addListeners() {
    this.openListener();
    this.Dialog.closeListener = this.closeListener;
  }
};
dialog.Dialog();
