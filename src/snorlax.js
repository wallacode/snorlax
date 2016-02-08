/**
 ..######..##....##..#######..########..##..........###....##.....##
 .##....##.###...##.##.....##.##.....##.##.........##.##....##...##.
 .##.......####..##.##.....##.##.....##.##........##...##....##.##..
 ..######..##.##.##.##.....##.########..##.......##.....##....###...
 .......##.##..####.##.....##.##...##...##.......#########...##.##..
 .##....##.##...###.##.....##.##....##..##.......##.....##..##...##.
 ..######..##....##..#######..##.....##.### #####.##.....##.##.....##

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
            threshold: 600,
            attrPrefix: 'data-snorlax',
            cssClassPrefix: 'snorlax',
            loadDelta: 600,
            event: 'scroll',
            horizontal: false,
            wrap: ''
        },

        /**
         * current position of the HEAD in the search scope
         * @type {number}
         */
        HEAD = 0,

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

        var elems;

        if (!('indexOf' in Array.prototype)) {
            __addIndexOfToArrayPrototype();
        }

        elems = __getElementsByClassName(config.cssClassPrefix);

        q = __nodeListToArray(elems);

        if (!config.horizontal) {
            for (var i = 0; i < q.length; i++)
                q[i] = __getObjectFromHTMLCollection(q[i]);

            HEAD = __findInitialHead();

            console.log('head:',HEAD);
            console.log('q:',q);

            var lastScroll = __getDocumentBottomScroll();

            var action = function() {
                var t = __getDocumentBottomScroll();
                if (Math.abs(t - lastScroll) >= config.loadDelta) {
                    lastScroll = t;
                    __load();
                }
            };
            __eventListener(_,config.event,action);
            __load();
        } else {
            var wrapper = document.getElementById(config.wrap);

            for (var i = 0; i < q.length; i++)
                q[i] = __getObjectFromHTMLCollection(q[i]);

            var lastScroll = __getEndOfWrapper();

            var action = function() {
                var t = __getEndOfWrapper();
                __load(t);
            };

            __eventListener(wrapper.parentElement,config.event,action);

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
                var upperbound = __getDocumentTopScroll() - config.threshold;
                var lowerbound = __getDocumentBottomScroll() + config.threshold;
                __updateEdgePosition(HEAD);
                __updateEdgePosition(HEAD-1);
                if (q[HEAD].top > upperbound && q[HEAD].bottom < lowerbound) {
                    __show(q[HEAD]);
                    q.splice(HEAD,1);
                    if (HEAD > q.length - 1 ) HEAD--;
                } else if (HEAD > 0 && q[HEAD-1].top > upperbound && q[HEAD-1].bottom < lowerbound) {
                        __show(q[HEAD - 1]);
                        q.splice(HEAD - 1, 1);
                        HEAD--;
                } else {
                    return;
                }
            }
            else {
                __updateEdgePosition();
                if (q[0].left - config.threshold < scroll) {
                    __show(q[0]);
                    q.shift();
                } else {
                    return;
                }
            }
        }
    }

    /**
     * creates and adds the {el} to the DOM
     * @param el - the element to show
     * @private
     */
    function __show(el){
        var obj, res;

        if (el.cb){
            res = window[el.cb](el);
        }

        if (!el.cb || res) {
            if (el.type === 'img') {
                obj = new Image();
                obj.src = res || el.src;
                obj.alt = el.alt;
                obj.setAttribute('class', 'snorlax-loaded');
            } else {
                obj = document.createElement("iframe");
                obj.src = el.src;
            }

            obj.setAttribute('class', el.el.getAttribute('class').replace(config.cssClassPrefix, config.cssClassPrefix + '-loaded'));
            var otherAttributes = el.el.dataset || __getDataAttributes(el.el);
            var prefix = config.attrPrefix.replace(/^data-/,'').replace(/-/g, '');
            for (var att in otherAttributes){
                if( otherAttributes.hasOwnProperty( att ) && [prefix+'src',prefix+'alt',prefix+'cb'].indexOf(att.toLowerCase()) === -1 ) {
                    if (obj.dataset)
                        obj.dataset[att] = otherAttributes[att];
                    else
                        obj.setAttribute('data-'+att.replace(/[a-z][A-Z][a-z]/g, function(word, pos) { return word.substr(0,1)+'-'+word.substr(1).toLowerCase() }),otherAttributes[att]);
                }
            }

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
        var innerHeight = _.innerHeight || document.documentElement.clientHeight;
        return (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop + innerHeight : document.body.scrollTop + innerHeight;
    }

    /**
     * return the height of the top of view port
     * @returns {number}
     * @private
     */
    function __getDocumentTopScroll(){
        return (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
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
            el      : HTMLitem,
            top     : HTMLitem.getBoundingClientRect().top + __getDocumentTopScroll(),
            left    : HTMLitem.getBoundingClientRect().left,
            bottom  : HTMLitem.getBoundingClientRect().bottom + __getDocumentTopScroll(),
            src     : HTMLitem.getAttribute(config.attrPrefix + '-src'),
            alt     : HTMLitem.getAttribute(config.attrPrefix + '-alt'),
            cb      : HTMLitem.getAttribute(config.attrPrefix + '-cb'),
            type    : /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/i.test(HTMLitem.getAttribute(config.attrPrefix + '-src')) ? 'img' : 'iframe'
        };
    }

    /**
     * return the element data attributes in the form of dataset.
     * @param element
     * @private
     */

    function __getDataAttributes(element) {
        var dataAttributes = {};
        for (var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];
            if (att.specified && att.name.match(/^data-/) && att.name.match(/^data-./).length > 0) {
                dataAttributes[att.name.replace(/^data-/,'').replace(/-./g, function(word, pos) { return word.charAt(1).toUpperCase() })] = att.value;
            }
        }
        return dataAttributes;
    }

    /**
     * creates elements array out of nodeList.
     * @param elems
     * @private
     */
    function __nodeListToArray(elems) {
        var elems_array = [];
        for (var i = 0; i < elems.length; i++) {
            elems_array.push(elems[i]);
        }
        return elems_array
    }

    /**
     * adding event listener to an Object cross-platform.
     * @param elem
     * @param event
     * @param cb
     * @private
     */
    function __eventListener(elem, event, cb) {
        if (elem.addEventListener) {
            elem.addEventListener(event, cb);
        }
        else {
            elem.attachEvent("on"+event, cb);
        }
    }

    /**
     * Get element by class name cross-platform.
     *
     * @param className
     * @private
     */
    function __getElementsByClassName(className) {
        if(document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        }
        else {
            return document.querySelectorAll('.'+className);
        }
    }

    /**
     * Adding 'indexOf' functionality to Array Prototype.
     *
     * @private
     */
    function __addIndexOfToArrayPrototype() {
        Array.prototype.indexOf = function(find, i) {
            if (i===undefined) i= 0;
            if (i<0) i+= this.length;
            if (i<0) i= 0;
            for (var n= this.length; i<n; i++)
                if (i in this && this[i]===find)
                    return i;
            return -1;
        };
    }

    /**
     * update the position of the item in the i'th position
     * @param i
     * @private
     */
    function __updateEdgePosition(i) {
        i = i || HEAD;

        if (q.length && i > -1 && q.length > i) {
            q[i].top = q[i].el.getBoundingClientRect().top + __getDocumentTopScroll();
            q[i].left = q[i].el.getBoundingClientRect().left;
        }
    }

    /**
     * calc the inital position of the HEAD
     *
     * @returns {number}
     * @private
     */
    function __findInitialHead(){
        var t = __getDocumentTopScroll();


        for (var i = 0; i < q.length; i++) {
            if (q[i].top > t)
                return i;
        }
        return q.length - 1;
    }

}(window));