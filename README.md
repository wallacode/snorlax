# Snorlax
![Snorlax](http://cdn.bulbagarden.net/upload/thumb/f/fb/143Snorlax.png/250px-143Snorlax.png)

§    __Version:__ 1.0.0  
§    __Author:__ Walla!Code  
§    __Repo:__ https://github.com/wallacode/snorlax  

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

## Callbacks
If you want you can create youre own loading function, this function will run when its the items time to be loaded

```html
<ANY class="snorlax" data-snorlax-cb="boom"></ANY>
```

```javascript
function boom(e){
	alert('BOOM');
}
```

## Options
```javascript
var lazy = new Snorlax({
	threshold: 100,
	attrPrefix: 'data-snorlax',
	cssClassPrefix: 'snorlax',
	scrollDelta: 0,
	event: 'scroll',
	horizontal: true,
	wrap: 'demo'
});
```
 Name               | Default        | Description
--------------------|----------------|-------------------
threshold           | 400            | number of pixels to load the image
attrPrefix          | 'data-snorlax' | prefix for the attrs on the html
cssClassPrefix      | 'snorlax'      | prefix for the css classes
scrollDelta         | 100            | (px) the interval for the scroll event, 0 for every scroll event
event               | 'scroll'       | which event will trigger the loading
horizontal          | false          | will set the lazy loader to work horizontaly
wrap                | ''             | ID of the wrapper of the horizontal scroll, in the most of the times it will be a UL ID


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