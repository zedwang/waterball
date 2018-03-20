# WaterBall
Light cross-platform Graph,Custom Configuration and animation supported

[![NPM](https://nodei.co/npm/waterball.png?compact=true)](https://nodei.co/npm/waterball/)


### Demo
[https://zedwang.github.io/waterball/demo/index.html](https://zedwang.github.io/waterball/demo/index.html)
![](https://github.com/zedwang/waterball/blob/master/jdfw.gif?raw=true)

* The component supported AMD、CMD and standalone model

#### Install with standalone

```sh
<script src='/path/water-ball.min.js'></script>

// html
<div id='container'></div>
// js
 var wb = new WaterBall('container',{
        value:30,
        r:100,
        color:'#787878',
    });
    // update
    wb.setOptions({value:50})

```

#### Install with NPM

```sh
$ npm install waterball
```

This will install waterBall NPM packages.


## Methods
### setOptions(key,value)/setOptions(Object)
* value 0~100
### destroy()
* destroy instance

## Options

| Field        | Type           | Default  |
| ------------- |:-------------:| -----:|
| fill      | String/Array | `#fff` |
|   waveStyle    | String/Array      |   `['#5bf6a1','#2bdb72']`|
| waveWidth | Float      |    0.02 |
| waveHeight | Int      |    8 |
| speed | Float      |    .1 |
| borderColor | String      |    `#2bdc76` |
| borderWidth | Int      |    2 |
| value | Float      |   0  |
| color | String      |    `#fff` |
| fontSize | String      |    `25px microsoft yahei` |
| textAlign | String      |    center |


# Support

## FAQ

https://github.com/zedwang/waterball/issues

## Supported browsers

Directives from this repository are automatically tested with the following browsers:
* Chrome (stable and canary channel)
* Firefox
* IE 9 and 10
* Opera
* Safari

Modern mobile browsers should work without problems.
