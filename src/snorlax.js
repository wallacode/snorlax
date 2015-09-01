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
            event: 'scroll'
        },

        isOn = true

    /**
     * @constructor
     */
    _.Snorlax = function(_config) {
        // Custom config
        if (_config){
            this.refreshConfig(_config);
        }

        q = []
            .slice.call(document.getElementsByClassName(config.cssClassPrefix))
            .map(function(obj){
                return {
                    el: obj,
                    top: obj.getBoundingClientRect().top,
                    src: obj.getAttribute(config.attrPrefix + '-src'),
                    alt: obj.getAttribute(config.attrPrefix + '-alt'),
                    type: /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/.test( obj.getAttribute(config.attrPrefix + '-src') ) ? 'img' : 'iframe'
                };
            });

        var lastScroll = __getDocumentBottomScroll();
        _.addEventListener('scroll', function(){
            var t = __getDocumentBottomScroll();

            if (t + config.loadDelta < lastScroll){
                return;
            } else {
                lastScroll = t;
                __load(t);
            }
        });

        __load(lastScroll);
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
     * @param scrollHight {number}
     * @private
     */
    function __load(scrollHight){
        for(;isOn && q.length;){
            if (q[0].top - config.threshold < scrollHight){
                __show(q[0]);
                q.shift();
            } else return;
        }
    }

    /**
     * creates and adds the {el} to the DOM
     * @param el - the element to show
     * @private
     */
    function __show(el){
        var obj;

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
        el.el.parentNode.insertBefore(obj, el.el);
        el.el.parentNode.removeChild(el.el);
    }

    /**
     * return the height of the bottom of view port
     * @returns {number}
     * @private
     */
    function __getDocumentBottomScroll(){
        return document.body.scrollTop + _.innerHeight;
    }

}(window));