# ke-fullscreen.js

> This is a Javascript plug-in that can be used across browsers [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

---

## Install

```
$ npm install --save ke-fullscreen
```

## Support

#### Desktop

| Feature | Chrome | Edge | Firefox | IE | Opera | Safari |
| ----------- | :-----------: |:-----------:| :-----:| :-----: | :-----: | :-----: |
| Basic support | 15 | Yes | 9.0 | 11 | 12.10 | 5.0 |
| fullscreenEnabled | 20 | Yes | 10.0 | 11 | 12.10 | 5.1 |


You can also visit [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#Browser_compatibility) to learn more.

## Simple to use
### html
```
 <!-- import js -->
 <script src="ke-fullscreen.min.js"></script>
 <script>
     /* use
      * fullscreen as a global object.
      */
     alert(fullscreen.isEnabled());
 </script>
```
### css
```
/*
    The width and height of the dom which is passed into fullscreen.launch() as a parameter will be set to 100% in full screen mode.
    for example:
                fullscreen.launch(document.querySelector('#container')).
*/
#container:-webkit-full-screen {
    width: 100%;
    height: 100%;
}

#container:-moz-full-screen {
    width: 100%;
    height: 100%;
}

#container:-ms-fullscreen {
    width: 100%;
    height: 100%;
}

#container:fullscreen {
    width: 100%;
    height: 100%;
}
```

## Package

```
$ gulp package
```
or

```
$ npm start
```

## Build (development)

```
$ gulp package-dev
```

## Documentation

```
$ gulp doc
```

## Reference

- [MDN - Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [screenfull.js](https://github.com/sindresorhus/screenfull.js)


## License

MIT © [porky-prince](https://github.com/porky-prince)
