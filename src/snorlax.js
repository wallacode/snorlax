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

        buckets = [],

        /**
         * default config
         * @type {Object}
         */
        config = {
            bucketSize : 400,
            bucketThreshold: 1,
            attrPrefix: 'data-snorlax',
            cssClassPrefix: 'snorlax',
            scrollDelta: 600,
            event: 'scroll',
            horizontal: false,
            wrap: '',
            scrollCB: [],
            showCB: []
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

        var elems;

        if (!('indexOf' in Array.prototype)) __addIndexOfToArrayPrototype(); // IE8 bugfix

        elems = __getElementsByClassName(config.cssClassPrefix);
        q = __nodeListToArray(elems);

        if (!config.horizontal) {
            for (var i = 0; i < q.length; i++)
                q[i] = __getObjectFromHTMLCollection(q[i]);

            __bucketSortElements(q);

            var lastScroll = __getDocumentBottomScroll();

            var action = function() {
                var t = __getDocumentBottomScroll();
                __runCallbacks(config.scrollCB, {'current': t, 'prev': lastScroll});

                if (Math.abs(t - lastScroll) >= config.bucketSize * config.bucketThreshold) {
                    lastScroll = t;
                    __load();
                }
            };

            __eventListener(_, config.event, action);
            __runCallbacks(config.scrollCB, {'current': lastScroll, 'prev': lastScroll});
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
        for(;buckets.length;){
            __showBucket(buckets[0]);
            buckets.shift();
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
     * Add custom callbacks to the scroll of Snorlax
     *
     * @param cb
     */
    _.Snorlax.prototype.addScrollCallback = function(cb){
        config.scrollCB = __addCB(cb, config.scrollCB);
    };

    /**
     * abstract add cb
     * @param cb    the callbacl to add
     * @param cbDestination the destination array
     * @returns * the final destination
     * @private
     */
    function __addCB(cb, cbDestination){
        if (cbDestination.constructor === Array)    { return cbDestination.push(cb); }
        if (typeof cbDestination === 'function')    { return [cbDestination, cb]; }
        if (typeof cbDestination === 'undefined')   { return cb; }
    }


    /**
     * load all the images from the scrollHight
     * @param scroll {number}
     * @private
     */
    function __load(scroll){

        for(;isOn && buckets.length;){
            if (!config.horizontal) {
                var topBucket       = Math.max(Math.floor(__getDocumentTopScroll() / config.bucketSize) - config.bucketThreshold,0);
                var bottomBucket    = Math.min(Math.ceil(__getDocumentBottomScroll() / config.bucketSize) + config.bucketThreshold,buckets.length-1);

                for (var i=topBucket; i<bottomBucket; i++) {
                    if (!buckets[i].loaded) {
                        __showBucket(buckets[i]);
                    }
                }

                return;
            }
            else {
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

        if (el.cb){     // if we have callback, run it
            res = config.showCB[el.cb](el);
        }

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

    /**
     * return the height of the bottom of view port
     * @returns {number}
     * @private
     */
    function __getDocumentBottomScroll(){
        var innerHeight = _.innerHeight || document.documentElement.clientHeight;
        return __getDocumentTopScroll() + innerHeight;
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
            type    : /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/i.test(HTMLitem.getAttribute(config.attrPrefix + '-src')) ? 'img' : 'iframe',
            loaded  : false
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

        return elems_array;
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
     * run custom added callbacks.
     *
     * @param cb
     * @param params
     * @private
     */
    function __runCallbacks(cb, params) {
        if (typeof cb === 'function') {
            cb(params);
        }
        else {
            if (cb.constructor === Array) {
                for (var i = 0; i < cb.length; i++) {
                    if (typeof cb[i] === 'function') {
                        cb[i](params);
                    } else {
                        throw 'A callback must be function';
                    }
                }
            } else {
                throw 'callback must be a function or array of functions';
            }
        }
    }

    function __bucketSortElements(q) {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

        var numOfBuckets = Math.ceil(height / config.bucketSize);

        for (var i=0; i<numOfBuckets; i++) {
            buckets[i] = {
                _id: i,
                loaded      : false,
                elements    : []
            };
        }

        for (var i=0; i<q.length; i++) {
            var startBucket = Math.floor(q[i].top / config.bucketSize);
            var endBucket   = Math.ceil((q[i].bottom - q[i].top) / config.bucketSize);
            for (var j = startBucket; j < startBucket + endBucket; j++) {
                buckets[j].elements.push(q[i]);
            }
        }
    }

    function __showBucket(bucket) {
        for (var i=0; i<bucket.elements.length; i++) {
            if (!bucket.elements[i].loaded) {
                __show(bucket.elements[i]);
                bucket.elements[i].loaded = true;
            }
        }
        bucket.loaded = true;
    }

}(window));