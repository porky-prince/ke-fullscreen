(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fullscreen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * compatibility
 * The code reference https://github.com/sindresorhus/screenfull.js
 */

'use strict';

let api = null;

const apis = [
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
    ],
    // new WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

    ],
    // old WebKit
    [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

    ],
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
    ],
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
    ]
];

for (let i = 0; i < apis.length; i++) {
    let methods = apis[i];
    if (methods[1] in document) {
        api = {};
        methods.forEach((method, j) => {
            api[apis[0][j]] = method;
        });
        break;
    }
}

module.exports = api;

},{}],2:[function(require,module,exports){
/**
 * This module exports the instance object of the [Class Fullscreen].
 *
 * 这个模块导出Fullscreen类的实例对象。
 * @module ke-fullscreen
 */

'use strict';

let api = require('./compatibility.js');

if (api === null) {
    //for old IE
    if (window.ActiveXObject) {
        try {
            let ws = new ActiveXObject("WScript.Shell");
            ws && ws.SendKeys("{F11}");
        } catch (e) {}
    } else {
        console.warn('This browser does not support the full screen API of h5. If the browser has full screen mode, such as the F11 shortcut, you may be able to remind users to use this method.');
    }
}

module.exports = require('./fullscreen.js');
},{"./compatibility.js":1,"./fullscreen.js":3}],3:[function(require,module,exports){
'use strict';

let api = require('./compatibility.js') || {},
    events = ['change', 'error'], eventHandles = {/*TODO*/},
    isFullscreenForNoScroll = (() => {
        let explorer = window.navigator.userAgent.toLowerCase();
        if (explorer.indexOf('chrome') >= 0) { //webkit
            return () => document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width;
        } else { //IE 9+  fireFox
            return () => window.outerHeight === window.screen.height && window.outerWidth === window.screen.width;
        }
    })();

/**
 * @class
 * @description
 * The instance of the [Class Fullscreen] will be named the global object of the "Fullscreen".
 *
 * Fullscreen类的实例将会被命名为“fullscreen”的全局对象。
 * @example
 * <!-- import js -->
 *<script src="ke-fullscreen.min.js"></script>
 * <script>
 *     //use
 *     //fullscreen as a global object.
 *     alert(fullscreen.isEnabled());
 * </script>
 */
class Fullscreen {
    /**
     * Determine whether full screen mode is available.
     *
     * 判断全屏模式是否是可用。
     * @example
     * document.querySelector('button').onclick = function () {
     *    if(fullscreen.isEnabled()){
     *        fullscreen.launch(document.querySelector('#container'));
     *    }else{
     *        //Ignore or do something else
     *    }
     *};
     * @returns {Boolean}
     */
    isEnabled() {
        return Boolean(document[api.fullscreenEnabled]);
    }

    /**
     * Determine if the browser is in full screen mode.
     *
     * 判断浏览器是否处于全屏状态。
     *
     *| isFullscreen(false)| scroll page| no scroll page |
     *| ------------- |:-----:| :-----:|
     *| fullscreen.launch() | √ | √ |
     *| F11 | × | × |
     *
     *| isFullscreen(true)| scroll page| no scroll page |
     *| ------------- |:-----:| :-----:|
     *| fullscreen.launch() | × | √ |
     *| F11 | × | √ |
     *
     * 当页面没有出现滚动条时，例如在做游戏开发时，页面是由一个canvas标签铺满的，
     * 此时按下浏览器的f11键启动的全屏跟使用fullscreen.launch()启动的全屏效果一样，
     * 但是按下f11键后启动的全屏无法使用fullscreen.isFullscreen(false)来判断，
     * 因为它始终返回null，只能用来判断fullscreen.launch()启动的全屏，
     * 这里可以将isNoScroll设置为true来判断。
     *
     * 这个方法可以用来判断所有主流浏览器当页面不出现滚动条时，用户是否是按了f11进行全屏(ie9+;edge没有f11键全屏这个功能)。
     *
     * 点击[这里]{@link http://blog.csdn.net/k358971707/article/details/60465689}了解更多。
     * @param {Boolean} [isNoScroll=false] - Whether the page appears scroll bar.（是否是不出现滚动条的页面）。
     * @returns {Boolean}
     *
     * @example
     * document.querySelector('button').onclick = function () {
     *    if(!fullscreen.isFullscreen()){
     *        fullscreen.launch();
     *    }else{
     *        fullscreen.exit();
     *    }
     *};
     * @example
     * //判断用户是否是按了f11键进行全屏
     * //注意：edge没有f11键全屏这个功能
     * var timer = null;
     * window.onresize = function(){
     *    clearTimeout(timer);
     *    timer = setTimeout(function () {
     *        alert(fullscreen.isFullscreen(true));
     *    },300);
     *}
     */
    isFullscreen(isNoScroll) {
        return isNoScroll ? isFullscreenForNoScroll() : Boolean(this.getElement());
    }

    /**
     * Returns the current full screen element.
     *
     * 返回当前全屏的元素。
     * @returns {Object}
     */
    getElement() {
        return document[api.fullscreenElement];
    }

    /**
     * Launch fullscreen mode.
     *
     * 启动全屏模式。
     *
     * 如果传入DOM对象，会将其全屏，否则默认将页面全屏;注意：只能有一个DOM元素能全屏，无法设置多个，所以只能传入单个DOM对象。
     * @param {HTMLElement} [element=document.documentElement] - DOM
     * @param {Function} [fn] - callback after launch.
     * @example
     * //Default parameter : document.documentElement
     * fullscreen.launch();
     * @example
     * //Incoming parameter : HTMLElement
     * fullscreen.launch(document.getElementById('container'));
     * @example
     * //Incoming parameter : iframe object
     * fullscreen.launch(window.frames['container']);
     * @example
     * //Incoming parameter : HTMLElement and fn
     * fullscreen.launch(document.getElementById('container'),function(){
     *      //callback after launch fullscreen.
     * });
     */
    launch(element, fn) {
        let el = element instanceof HTMLElement ? element : document.documentElement,
            rfs = el[api.requestFullscreen];
        if (rfs) {
            //for iframe
            el.tagName === 'IFRAME' && el.setAttribute('allowFullScreen', '');
            rfs.call(el);
            fn && fn();
        }
    }

    /**
     * Exit fullscreen mode.
     *
     * 退出全屏。
     * 注意：无法退出F11启动的全屏。
     * @param {Function} [fn] - callback after exit.
     * @example
     * //Incoming parameter : fn
     * fullscreen.exit(function(){
     *      //callback after exit fullscreen.
     * });
     */
    exit(fn) {
        let efs = document[api.exitFullscreen];
        if (efs) {
            efs.call(document);
            fn && fn();
        }
    }

    /**
     * Launch or exit fullscreen mode.
     *
     * 启动或退出全屏模式。
     * @param {HTMLElement} [element=document.documentElement] - DOM.
     * @param {Function} [launchFn] - callback after launch.
     * @param {Function} [exitFn] - callback after exit.
     * @example
     * document.querySelector('#container').onclick = function () {
     *    if(fullscreen.isEnabled()){
     *        fullscreen.toggle(this, launch.bind(this), exit.bind(this));
     *    }else{
     *        alert("Sorry,Your browser version is too low to support full screen, please upgrade or press F11 for full screen.");
     *    }
     *};
     *
     * function launch() {
     *    this.innerText='click me exit fullscreen.';
     *}
     *
     * function exit() {
     *    this.innerText='click me launch fullscreen.';
     *}
     */
    toggle(element, launchFn, exitFn) {
        if (!this.isFullscreen()) {
            this.launch(element, launchFn);
        } else {
            this.exit(exitFn);
        }
    }

    /**
     * `EventListener`
     *
     * 全屏事件回调。
     * @callback EventListener
     * @param {Object} e - event object
     */

    /**
     * Bind events.
     *
     * 绑定事件。
     * @param  {String} event - available value : "change" or "error"
     * @param  {EventListener} fn - callback
     * @example
     * //"change":全屏切换事件，按f11键启动的全屏不会触发，并且无法判断是启动全屏还是退出全屏。
     * function change() {
     *    console.log('change');
     *}
     * fullscreen.on('change',change);
     * @example
     * //"error":全屏发生错误或用户禁止
     * function error(e) {
     *    console.log(e);
     *}
     * fullscreen.on('error',error);
     */
    on(event, fn) {
        events.indexOf(event) >= 0 && document.addEventListener(api['fullscreen' + event], fn, false);
    }

    /**
     * Unbind events
     *
     * 解绑事件。
     * 注意：解除全屏的回调函数必须与注册全屏的回调函数是同一个。
     * @param  {String} event - available value : "change" or "error"
     * @param  {EventListener} fn - callback
     * @example
     * //effective
     * function change() {
     *    console.log('change');
     *}
     * fullscreen.on('change',change);
     * fullscreen.off('change',change);
     * @example
     * //ineffective
     * fullscreen.on('change',function(){
     *    console.log('change');
     *});
     * fullscreen.off('change',function(){
     *    console.log('change');
     *});
     */
    off(event, fn) {
        events.indexOf(event) >= 0 && document.removeEventListener(api['fullscreen' + event], fn, false);
    }

    /**
     * `preventDefaultFn`
     *
     * 禁止键盘按键默认事件回调
     * @callback preventDefaultFn
     * @param {Object} e - event object
     * @returns {Boolean}
     */

    /**
     * Prevent keyboard default events(For some keys ineffective, for example: esc key).
     *
     * 禁止键盘按键默认事件（对于一些按键无效，例如：esc键）。
     * @param {preventDefaultFn} fn - callback
     * @example
     * fullscreen.preventDefault(function(e){
     *    return e.keyCode === 112 || e.keyCode === 116;//prevent F1 and F5 default events.
     * });
     */
    preventDefault(fn) {
        document.addEventListener('keydown', (e) => {
            if (fn && fn(e)) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        }, false);
    }

    /*shortcuts(fn){
        TODO
    }*/
}

module.exports = new Fullscreen();

},{"./compatibility.js":1}]},{},[2])(2)
});