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