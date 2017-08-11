/**
 * Created by Zed on 2017/8/3.
 */
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
        || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

function WaterBall(element, options) {
    this.elem = typeof element === 'object' ? element : this._getElement(element);
    this.opts = options;
    this.default = {
        r:100,
        fill:'#fff',
        stroke:'#2bdc76',
        strokeWidth:2,
        value:0 // 0~100
    };

    this.timer = null;
    this.oc = null;
    this.angle = 0;
    this.waveWidth = 0.015 ;   //波浪宽度,数越小越宽
    this.waveHeight = 6; //波浪高度,数越大越高
    this.speed = 0.09; //波浪速度，数越大速度越快
    this.xOffset = 0; //波浪x偏移量

}

Object.assign(WaterBall.prototype,{
    init:function () {
        this.opts = Object.assign({},this.default,this.opts);
        this.opts.d = this.opts.r * 2;
        this.maxY = this.opts.d;
        this.oc = this._createCanvas();
        this._update(this.opts.value)
    },
    setValue:function (value) {
        console.log('before',this.maxY)
        this.opts.value = value > 100 ? 100 : value;
        this._update()
    },
    getCanvas: function () {
        return this.oc;
    },
    destroy:function () {
        cancelAnimationFrame(this.timer);
        document.querySelector('body').removeChild(this.elem);
    },
    _reverse: function () {
      return this.opts.d - (this.opts.d  * this.opts.value / 100);
    },
    _getElement:function (id) {
      return document.getElementById(id);
    },
    _update:function () {
        cancelAnimationFrame(this.timer);
        this.reverse = this._reverse();//百分比对应的数值
        console.log(this.reverse)
        this._drawArc(this.oc,this.reverse);
    },

    _createCanvas: function () {
        var oc = document.createElement('canvas');
        this.elem.appendChild(oc);
        return oc;
    },
    _drawArc:function (oc,value) {
        if (this.maxY > value)this.maxY--;

        var ctx = oc.getContext('2d');
        ctx.clearRect(0,0,this.opts.d,this.opts.d);

        oc.width = this.opts.d;
        oc.height = this.opts.d;
        var gradient=ctx.createRadialGradient(75,50,5,90,60,100);
        gradient.addColorStop("0","#5bf6a1");
        gradient.addColorStop("1.0","#2bdb72");
        // 外层的球
        ctx.globalAlpha = .7;
        ctx.lineWidth = this.opts.strokeWidth;

        ctx.beginPath();
        ctx.strokeStyle = '#2bdc76';
        ctx.arc(this.opts.r, this.opts.r, this.opts.r - this.opts.strokeWidth, 1.5 * Math.PI, 1.2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.opts.r, this.opts.r, this.opts.r - this.opts.strokeWidth -5, 0, 2 * Math.PI);
        ctx.clip();
        var points=[];	//用于存放绘制Sin曲线的点

        ctx.beginPath();
        //在整个轴长上取点

        this.xOffset += this.speed;
        for (var i = 0; i < 2; i++) {
            for(var x = 0; x < 0 + this.opts.d; x += 20 / this.opts.d){
                //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
                var y = -Math.sin((0 + x + i * 5) * this.waveWidth + this.xOffset + i * 15);

                var dY = this.opts.r * (1 - 50 / 100 );

                points.push([x, dY + y * this.waveHeight]);
                ctx.lineTo(x, dY + y * this.waveHeight);
            }
            //封闭路径
            ctx.lineTo(this.opts.d, this.opts.d);
            ctx.lineTo(0, this.opts.d);
            ctx.lineTo(points[0][0],points[0][1]);
            ctx.fillStyle = gradient;
            ctx.fill();
        }


        // 绘制文本
        ctx.font="30px Verdana";
        ctx.fillStyle='#fff';
        ctx.textAlign = 'center';
        ctx.fillText(this.opts.value + '%',this.opts.r,this.opts.r);




        var self = this;
        this.timer = requestAnimationFrame(function(){
            self._drawArc(self.oc,self.reverse);
        });


    }
})
