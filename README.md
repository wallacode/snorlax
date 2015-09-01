# Snorlax
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
__Custom options:__
```javascript
var lazy = new Snorlax({
	threshold: 100,
	attrPrefix: 'data-pickachu',
	cssClassPrefix: 'pickachu',
	scrollDelta: 0,
	event: 'keydown'
});
```

## Options
 Name               | Default        | Description
--------------------|----------------|-------------------
threshold           | 400            | number of pixels to load the image
attrPrefix          | 'data-snorlax' | prefix for the attrs on the html
cssClassPrefix      | 'snorlax'      | prefix for the css classes
scrollDelta         | 100            | the interval for the scroll event, 0 for every scroll event
event               | 'scroll'       | which event to fire the loading

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