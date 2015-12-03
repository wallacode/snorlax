/**
 ..######..##....##..#######..########..##..........###....##.....##
 .##....##.###...##.##.....##.##.....##.##.........##.##....##...##.
 .##.......####..##.##.....##.##.....##.##........##...##....##.##..
 ..######..##.##.##.##.....##.########..##.......##.....##....###...
 .......##.##..####.##.....##.##...##...##.......#########...##.##..
 .##....##.##...###.##.....##.##....##..##.......##.....##..##...##.
 ..######..##....##..#######..##.....##.########.##.....##.##.....##

 light weight lazy loading plugin
 § Version:     1.0.0
 § Author:      Walla!Code (walla.co.il)
 § Repo:        https://github.com/wallacode/snorlax
 */

;(function(_) {
    'use strict';

    var
        /**
         * queue of objects to load
         * @type {Array}
         */
        q = [],

        /**
         * default config
         * @type {Object}
         */
        config = {
            threshold: 400,
            attrPrefix: 'data-snorlax',
            cssClassPrefix: 'snorlax',
            loadDelta: 1000,
            event: 'scroll',
            horizontal: false,
            wrap: ''
        },

        isOn = true
    ;

    /**
     * @constructor
     */
    _.Snorlax = function(_config) {
        // Custom config
        if (_config){
            this.refreshConfig(_config);
        }

        if (!config.horizontal) {
            q = []
                .slice.call(document.getElementsByClassName(config.cssClassPrefix))
                .map(__getObjectFromHTMLCollection);

            var lastScroll = __getDocumentBottomScroll();

            _.addEventListener(config.event, function () {
                var t = __getDocumentBottomScroll();

                if (t + config.loadDelta < lastScroll) {
                    return;
                } else {
                    lastScroll = t;
                    __load(t);
                }
            });

            __load(lastScroll);
        } else {
            var wrapper = document.getElementById(config.wrap);

            q = []
                .slice.call(wrapper.getElementsByClassName(config.cssClassPrefix))
                .map(__getObjectFromHTMLCollection);

            var lastScroll = __getEndOfWrapper();

            wrapper.parentElement.addEventListener(config.event, function () {
                var t = __getEndOfWrapper();
                __load(t);
            });

            __load(lastScroll);
        }
    };

    /**
     * Load all the objects
     */
    _.Snorlax.prototype.loadAll = function(){
        for(;q.length;){
            __show(q[0]);
            q.shift();
        }
    };

    /**
     * change the default config of Snorlax
     * @param _config
     */
    _.Snorlax.prototype.refreshConfig = function(_config){
        var k = Object.keys(_config);
        for (var i = 0; i < k.length; i++){
            config[k[i]] = _config[k[i]];
        }
    };

    /**
     * start Snorlax
     */
    _.Snorlax.prototype.start = function(){
        isOn = true;
    };

    /**
     * stop Snorlax
     */
    _.Snorlax.prototype.stop = function(){
        isOn = false;
    };

    /**
     * load all the images from the scrollHight
     * @param scroll {number}
     * @private
     */
    function __load(scroll){
        for(;isOn && q.length;){
            if (!config.horizontal) {
                if (q[0].top - config.threshold < scroll) {
                    __show(q[0]);
                    q.shift();
                } else return;
            } else {
                if (q[0].left - config.threshold < scroll) {
                    __show(q[0]);
                    q.shift();
                } else return;
            }
        }
    }

    /**
     * creates and adds the {el} to the DOM
     * @param el - the element to show
     * @private
     */
    function __show(el){
        var obj;

        if (el.cb){
            window[el.cb](el);
        } else {
            if (el.type === 'img') {
                obj = new Image();
                obj.src = el.src;
                obj.alt = el.alt;
                obj.setAttribute('class', 'snorlax-loaded');
            } else {
                obj = document.createElement("iframe");
                obj.src = el.src;
            }

            obj.setAttribute('class', el.el.getAttribute('class').replace(config.cssClassPrefix, config.cssClassPrefix + '-loaded'));

            if (el.type === 'img') {
                obj.onload = function(){
                    el.el.parentNode.insertBefore(obj, el.el);
                    el.el.style.display = 'none';
                };
            } else {
                el.el.parentNode.insertBefore(obj, el.el);
                el.el.style.display = 'none';
            }
        }
    }

    /**
     * return the height of the bottom of view port
     * @returns {number}
     * @private
     */
    function __getDocumentBottomScroll(){
        return document.body.scrollTop + _.innerHeight;
    }

    /**
     * If we are using the horizontal loading this function will return us the end of the wrapper
     * @private
     */
    function __getEndOfWrapper(){
        var _ = document.getElementById(config.wrap).parentElement;
        return _.scrollLeft + 1 * ( window.getComputedStyle(_).width.replace('px', '') );
    }

    /**
     * return object from HTML item
     * @param HTMLitem
     * @private
     */
    function __getObjectFromHTMLCollection(HTMLitem){
        return {
            el: HTMLitem,
            top: HTMLitem.getBoundingClientRect().top,
            left: HTMLitem.getBoundingClientRect().left,
            src: HTMLitem.getAttribute(config.attrPrefix + '-src'),
            alt: HTMLitem.getAttribute(config.attrPrefix + '-alt'),
            cb: HTMLitem.getAttribute(config.attrPrefix + '-cb'),
            type: /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/.test(HTMLitem.getAttribute(config.attrPrefix + '-src')) ? 'img' : 'iframe'
        };
    }

}(window));