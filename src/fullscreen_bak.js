/*
     * @Author: kay
     * @Date:   2017-03-06 23:34:00
     */
'use strict';

function Fullscreen() {};

Fullscreen.prototype = {
    constructor: Fullscreen,
    /**
     * [isFullscreenEnabled 判断浏览器是否支持h5全屏api]
     * @return [支持返回true,不支持返回false]
     */
    isFullscreenEnabled: function() {
        return document.fullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled || false;
    },
    /**
     * [isFullscreen 判断浏览器是否全屏]
     * @param  {Boolean} isSingleTab [是否单标签不出现滚动条的页面]
     * @return {Boolean} [全屏则返回true,不全屏返回false]
     */
    isFullscreen: function(isSingleTab) {
        return isSingleTab ? this._isFullscreen() : Boolean(this.getFullscreenElement());
    },
    _isFullscreen: function() {
        var explorer = window.navigator.userAgent.toLowerCase();
        if (explorer.indexOf('chrome') > 0) { //chrome
            return (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
        } else { //IE 9+  fireFox
            return (window.outerHeigth == screen.heigth && window.outerWidth == screen.width);
        }
    },
    /**
     * [getFullscreenElement 返回当前调用全屏的元素]
     * @return [存在则返回此元素,不存在返回null]
     */
    getFullscreenElement: function() {
        return document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement || null;
    },
    /**
     * [setFullscreen 设置全屏]
     * @param {domElement} element [DOM节点对象(可选)]
     */
    setFullscreen: function(element) {
        var el = (element.preventDefault || element.returnValue ? false : element) || document.documentElement;
        var rfs = el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;
        if (rfs) {
            rfs.call(el);
        } else if (window.ActiveXObject) {
            var ws = new ActiveXObject("WScript.Shell");
            ws && ws.SendKeys("{F11}");
        }
    },
    /**
     * [exitFullscreen 退出全屏]
     */
    exitFullscreen: function() {
        var efs = document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;
        if (efs) {
            efs.call(document);
        } else if (window.ActiveXObject) {
            var ws = new ActiveXObject("WScript.Shell");
            ws && ws.SendKeys("{F11}");
        }
    },
    /**
     * [toggle 设置或退出全屏]
     * @param {domElement} element [DOM节点对象(可选)]
     * @param {Function} setFn [全屏后的回调(可选)]
     * @param {Function} exitFn [退出全屏后的回调(可选)]
     */
    toggle:function(element,setFn,exitFn){
        if(this.isFullscreenEnabled()){
            if(!this.isFullscreen()){
                this.setFullscreen(element);
                setFn && setFn();
            }else{
                this.exitFullscreen();
                exitFn && exitFn();
            }
        }else{
            alert("对不起，您的浏览器版本过低不支持全屏，请升级或按F11进行全屏");
        }
    },
    /**
     * [on 全屏改变事件]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    on: function(callback) {
        var _fullscreenchange = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];
        this._addEvents(_fullscreenchange, callback);
    },
    /**
     * [error 全屏发生错误或用户禁止事件]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    error: function(callback) {
        var _fullscreenerror = [
            'fullscreenerror',
            'webkitfullscreenerror',
            'mozfullscreenerror',
            'MSFullscreenError'
        ];
        this._addEvents(_fullscreenerror, callback);
    },
    _addEvents: function(events, callback) {
        for (var i = 0; i < events.length; i++) {
            document.addEventListener(events[i], callback, false);
        }
    },
    /**
     * [forbidSystemBtn 设置禁止退出全屏的键盘事件（对于绝大部分按钮有效，例如：esc键无效）]
     * @param {Function} callback [返回布尔值的回调函数]
     */
    forbidSystemBtn:function(callback){
        $(document).on('keydown',function(e){
            if(callback && callback(e)){
                e.preventDefault();
            }
        });
    }
};

module.exports = $.fullscreen = new Fullscreen();