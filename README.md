[![npm](https://img.shields.io/npm/dt/express.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/snorlax)

# Snorlax

Snorlax is lightweight standalone lazy loading library - lazy loading as it meant to be.

![Snorlax](http://cdn.bulbagarden.net/upload/thumb/f/fb/143Snorlax.png/250px-143Snorlax.png)

§    __Version:__ 1.0.0  
§    __Author:__ Walla!Code  
§    __Repo:__ https://github.com/wallacode/snorlax  

This plugin doesn't need jQuery and is totaly standalone, the minified size is 1.86Kb !!!

## install from npm
```javascript
npm install -g snorlax
```

## Demo Page
[Demo Page](https://wallacode.github.io/snorlax/)

## Use
### HTML
```html
<ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY>
```

### Javascript
__regular:__
```javascript
var lazy = new Snorlax();
```

## Horizontal Lazy Load
### HTML
```html
<div class="carusela">
	<ul id="demo">
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
		<li><ANY class="snorlax" data-snorlax-alt="bla" data-snorlax-src="pic.jpg"></ANY></li>
	</ul>
</div>
```

### Javascript
```javascript
var lazy = new Snorlax({
	horizontal: true,
	wrap: 'demo'
});
```

## Buckets
We work with the principles of [Bucket sort](https://en.wikipedia.org/wiki/Bucket_sort) that works in ```O(n)```.
We divide the screen into buckets according to the ```bucketSize``` param, in each iteration we show a specific bucket and the buffer buckets according to the ```bucketBuffer``` param.

## Callbacks
We have 2 kinds of callbacks: show callbacks ans scroll callbacks

### Scroll Callbacks
will fire on every scroll, the callback gets object with current and prev scroll locations
```javascript
var lazy = new Snorlax({
    scrollCB: function(obj){ console.log(obj); }
});
```
also supports multiple callbacks:
```javascript
var lazy = new Snorlax({
    scrollCB: [
        function(obj){ console.log(obj); },
        function(obj){ alert(obj); }
    ]
});
```

### Show Callbacks
we can supply multiple callbacks and on the show event the selected callback will file

```html
<ANY class="snorlax" data-snorlax-cb="first"></ANY>
```

```javascript
var lazy = new Snorlax({
    showCB: {
        'first': function(obj){ console.log(obj); },
        'second': function(obj){ alert(obj); }
    }
});
```

## Options
```javascript
var lazy = new Snorlax({
	bucketSize: 400,
	bucketBuffer: 1,
	attrPrefix: 'data-snorlax',
	cssClassPrefix: 'snorlax',
	scrollDelta: 0,
	event: 'scroll',
	horizontal: true,
	wrap: 'demo',
    scrollCB: [],
    showCB: []
});
```
 Name               | Default        | Description
--------------------|----------------|-------------------
bucketSize          | 400            | height of each bucket
bucketBuffer        | 1              | buffer of how much buckets before and after we should load
attrPrefix          | 'data-snorlax' | prefix for the attrs on the html
cssClassPrefix      | 'snorlax'      | prefix for the css classes
event               | 'scroll'       | which event will trigger the loading
horizontal          | false          | will set the lazy loader to work horizontaly
wrap                | ''             | ID of the wrapper of the horizontal scroll, in the most of the times it will be a UL ID
scrollCB            | function/array | see section about callbacks
showCB              | object         | see section about callbacks

## Methods

__loadAll()__
will load all the objects.
```javascript
var lazy = new Snorlax();
...
lazy.loadAll();
```

__refreshConfig(config)__
change the config of Snorlax.
```javascript
var lazy = new Snorlax();
...
lazy.refreshConfig({
  threshold: 300,
  attrPrefix: 'data-shota-snorlax'
});
```

__stop()__
stop Snorlax
```javascript
var lazy = new Snorlax();
...
lazy.stop();
```

__start()__
start Snorlax
```javascript
var lazy = new Snorlax();
...
lazy.start();
```

__addScrollCallback(cb)__
Add callback to the scroll callbacks array
