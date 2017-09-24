'use strict';

let api = {};

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
    // old WebKit (Safari 5.1)
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
        methods.forEach((method, j)=> {
            api[apis[0][j]] = method;
        });
        break;
    }
}

function isFullscreenForSingleTag() {
    var explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('chrome') > 0) { //chrome
        return document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width;
    } else { //IE 9+  fireFox
        return window.outerHeigth == screen.heigth && window.outerWidth == screen.width;
    }
}

/** Fullscreen. */
class Fullscreen {
    /**
     * 判断浏览器是否支持h5的全屏api.
     * @returns {Boolean}
     */
    isEnabled() {
        return Boolean(document[api.fullscreenEnabled]);
    }

    /**
     * 判断浏览器是否全屏
     * @param {Boolean} [isSingleTag=false] - 是否是单标签全屏并且不出现滚动条的页面.
     * @returns {Boolean}
     */
    isFullscreen(isSingleTag) {
        return isSingleTag ? isFullscreenForSingleTag() : Boolean(this.getElement());
    }

    /**
     * 返回当前全屏的元素
     * @returns {Object}
     */
    getElement() {
        return document[api.fullscreenElement];
    }

    /**
     * 启动全屏
     * @param {HTMLElement} [element=document.documentElement] - DOM对象
     */
    launch(element) {
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
    exit() {
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
    toggle(element, setFn, exitFn) {
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
    onchange(fn) {
        document.addEventListener(api.fullscreenchange, fn, false);
    }

    /**
     * 全屏发生错误或用户禁止全屏事件
     * @param  {EventListener} fn
     */
    onerror(fn) {
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
    forbidSystemBtn(fn) {
        document.addEventListener('keydown', (e)=> {
            if (fn && fn(e)) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        }, false);
    }
}

module.exports = Fullscreen;