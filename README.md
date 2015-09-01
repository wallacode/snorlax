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
```javascript
var lazy = new Snorlax();
```

## Options
 Name               | Default        | Description
--------------------|----------------|-------------------
threshold           | 400            | number of pixels to load the image
attrPrefix          | 'data-snorlax' | prefix for the attrs on the html
cssClassPrefix      | 'snorlax'      | prefix for the css classes
loadDelta           | 100            | the interval for the scroll event
event               | 'scroll'       | which event to fire the loading