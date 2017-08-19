/**
 * Created by Zed on 2017/8/3.
 */
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
// MIT license
'use strict';

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

(function () {
  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame']
        || window[vp + 'CancelRequestAnimationFrame'];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now
      );
    };
    window.cancelAnimationFrame = clearTimeout;
  }
}());

function WaterBall(element, options) {
  this.elem = typeof element === 'object' ? element : this._getElement(element);
  this.opts = options;
  this.default = {
    r: 100,
    fill: '#fff',
    waveStyle: ['#5bf6a1', '#2bdb72'],
    waveWidth: 0.02, //波浪宽度,数越小越宽
    waveHeight: 8, //波浪高度,数越大越高
    speed: .1, //波浪速度，数越大速度越快
    borderColor: '#2bdc76',
    borderWidth: 2,
    value: 10, // 0~100
    color: '#fff',
    fontSize: '25px microsoft yahei',
    textAlign: 'center'

  };

  this.timer = null;
  this.oc = null;
  this.xOffset = 0; //波浪x偏移量
  this.eAngle = 0; // 水珠摇摆角度

  // this.render();


}

Object.assign(WaterBall.prototype, {
  render: function () {
    this.opts = Object.assign({}, this.default, this.opts);
    this.opts.d = this.opts.r * 2;
    this.maxY = this.opts.d;
    this.yOffset = this.opts.r;
    this.oc = this._createCanvas();
    this._update(this._ceil(this.opts.value));
    return this;
  },
  setOptions: function (key, value) {
    if (typeof key === 'object') {
      for (var k in key) {
        this.opts[k] = key[k];
      }
    } else {
      this.opts[key] = value > 100 ? 100 : value;
    }
    this._update();
  },
  getCanvas: function () {
    return this.oc;
  },
  destroy: function () {
    cancelAnimationFrame(this.timer);
    document.querySelector('body').removeChild(this.elem);
  },
  _ceil: function (value) {
    return Math.ceil(value);
  },
  _reverse: function () {
    return this.opts.d - this.opts.d * this.opts.value / 100;
  },
  _getElement: function (id) {
    return document.getElementById(id);
  },
  _update: function () {
    cancelAnimationFrame(this.timer);
    this.reverse = this._reverse();//百分比对应的数值
    this._drawArc(this.oc, this.reverse);
  },

  _createCanvas: function () {
    var oc = document.createElement('canvas');
    oc.setAttribute('width', this.opts.d);
    oc.setAttribute('height', this.opts.d);
    var pn = this.elem.parentNode;
    pn.removeChild(this.elem);
    pn.appendChild(oc);
    this.elem = oc;
    return oc;
  },
  _createGradient: function (ctx, color){
    var gradient = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    if (typeof color === 'string') {
      gradient.addColorStop(0, color);
    }
    if (typeof color === 'object' && color instanceof Array) {
      var cl = color.length;
      for (var i = 0; i < cl; i++) {
        var stop = i * (1 / (cl - 1));
        gradient.addColorStop(stop, color[i]);
      }
    }

    return gradient;
  },
  _drawArc: function (oc, value) {
    this.eAngle ++;
    var ctx = oc.getContext('2d');
    ctx.clearRect(0, 0, this.opts.d, this.opts.d);


        // 外层的球
    ctx.lineWidth = this.opts.borderWidth;

    ctx.beginPath();
    ctx.strokeStyle = this.opts.borderColor;
    ctx.fillStyle = this._createGradient(ctx, this.opts.fill);
    ctx.arc(this.opts.r, this.opts.r, this.opts.r - this.opts.borderWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.opts.r, this.opts.r, this.opts.r - this.opts.borderWidth - 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.clip();

        // 绘制波浪
    var points = [];
    ctx.beginPath();
        //在整个轴长上取点
    this.xOffset += this.opts.speed;
    for(var x = 0; x < 0 + this.opts.d; x += 20 / this.opts.d){
            //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
      var y = -Math.sin((0 + x) * this.opts.waveWidth + this.xOffset);
      points.push([x, value + y * this.opts.waveHeight]);
      ctx.lineTo(x, value + 0 + y * this.opts.waveHeight);
    }
        //封闭路径
    ctx.lineTo(this.opts.d, this.opts.d);
    ctx.lineTo(0, this.opts.d);
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fillStyle = this._createGradient(ctx, this.opts.waveStyle);
    ctx.fill();

        // 绘制小水珠
    ctx.beginPath();
    ctx.strokeStyle = this.opts.fill;
    ctx.globalAlpha = .3;
    var bead = -Math.sin(this.eAngle * .1);
    if (this.maxY < -50) {
      this.maxY = this.opts.d;
    }
    ctx.arc(this.yOffset + bead * 5, this.maxY--, 8, 0, 2 * Math.PI);
    ctx.stroke();


        // 绘制文本
    ctx.globalAlpha = 1;
    ctx.font = this.opts.fontSize;
    ctx.fillStyle = this.opts.color;
    ctx.textAlign = this.opts.textAlign;
    ctx.fillText(this._ceil(this.opts.value) + '%', this.opts.r, this.opts.r);


    var self = this;
    this.timer = window.requestAnimationFrame(function (){
      self._drawArc(self.oc, self.reverse);
    });


  }
});
