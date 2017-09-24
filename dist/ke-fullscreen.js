(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fullscreen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var api = {};

var apis = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
// new WebKit
['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'],
// old WebKit (Safari 5.1)
['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

for (var i = 0; i < apis.length; i++) {
    var methods = apis[i];
    if (methods[1] in document) {
        methods.forEach(function (method, j) {
            api[apis[0][j]] = method;
        });
        break;
    }
}

function isFullscreenForSingleTag() {
    var explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('chrome') > 0) {
        //chrome
        return document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width;
    } else {
        //IE 9+  fireFox
        return window.outerHeigth == screen.heigth && window.outerWidth == screen.width;
    }
}

/** Fullscreen. */

var Fullscreen = function () {
    function Fullscreen() {
        _classCallCheck(this, Fullscreen);
    }

    _createClass(Fullscreen, [{
        key: 'isEnabled',

        /**
         * 判断浏览器是否支持h5的全屏api.
         * @returns {Boolean}
         */
        value: function isEnabled() {
            return Boolean(document[api.fullscreenEnabled]);
        }

        /**
         * 判断浏览器是否全屏
         * @param {Boolean} [isSingleTag=false] - 是否是单标签全屏并且不出现滚动条的页面.
         * @returns {Boolean}
         */

    }, {
        key: 'isFullscreen',
        value: function isFullscreen(isSingleTag) {
            return isSingleTag ? isFullscreenForSingleTag() : Boolean(this.getElement());
        }

        /**
         * 返回当前全屏的元素
         * @returns {Object}
         */

    }, {
        key: 'getElement',
        value: function getElement() {
            return document[api.fullscreenElement];
        }

        /**
         * 启动全屏
         * @param {HTMLElement} [element=document.documentElement] - DOM对象
         */

    }, {
        key: 'launch',
        value: function launch(element) {
            var el = (element.preventDefault || element.returnValue ? false : element) || document.documentElement;
            var rfs = el[api.requestFullscreen];
            if (rfs) {
                rfs.call(el);
            } else if (window.ActiveXObject) {
                var ws = new ActiveXObject("WScript.Shell");
                ws && ws.SendKeys("{F11}");
            }
        }

        /**
         * 退出全屏
         */

    }, {
        key: 'exit',
        value: function exit() {
            var efs = document[api.exitFullscreen];
            if (efs) {
                efs.call(document);
            } else if (window.ActiveXObject) {
                var ws = new ActiveXObject("WScript.Shell");
                ws && ws.SendKeys("{F11}");
            }
        }

        /**
         * 设置或退出全屏
         * @param {HTMLElement} [element=document.documentElement] - DOM对象
         * @param {Function} [setFn] - 全屏后的回调
         * @param {Function} [exitFn] - 退出全屏后的回调
         */

    }, {
        key: 'toggle',
        value: function toggle(element, setFn, exitFn) {
            if (this.isEnabled()) {
                if (!this.isFullscreen()) {
                    this.launch(element);
                    setFn && setFn();
                } else {
                    this.exit();
                    exitFn && exitFn();
                }
            } else {
                alert("Sorry, your browser version is too low to support full screen, please upgrade or press F11 for full screen.");
            }
        }

        /**
         * This callback type is called `EventListener` and is displayed as a global symbol.
         *
         * @callback EventListener
         * @param {Object} e - event object
         */

        /**
         * 全屏改变事件
         * @param  {EventListener} fn
         */

    }, {
        key: 'onchange',
        value: function onchange(fn) {
            document.addEventListener(api.fullscreenchange, fn, false);
        }

        /**
         * 全屏发生错误或用户禁止全屏事件
         * @param  {EventListener} fn
         */

    }, {
        key: 'onerror',
        value: function onerror(fn) {
            document.addEventListener(api.fullscreenerror, fn, false);
        }

        /**
         * This callback type is called `forbidSystemBtnFn` and is displayed as a global symbol.
         *
         * @callback forbidSystemBtnFn
         * @param {Object} e - event object
         * @returns {Boolean}
         */

        /**
         * 设置禁止退出全屏的键盘事件（对于绝大部分按钮有效，例如：esc键无效）.
         * @param {forbidSystemBtnFn} fn - The callback that ...
         */

    }, {
        key: 'forbidSystemBtn',
        value: function forbidSystemBtn(fn) {
            document.addEventListener('keydown', function (e) {
                if (fn && fn(e)) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }
            }, false);
        }
    }]);

    return Fullscreen;
}();

module.exports = Fullscreen;

},{}]},{},[1])(1)
});