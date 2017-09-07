/**
 * Created by liuchuanyang on 2017/3/13.
 */
import $ from 'jquery';

/**
 * 在 when 毫秒后，执行以 context为作用域的函数 fn
 * periodic 是否是循环执行
 * data 执行函数的参数
 *
 */
const later = (fn, when, periodic, context, data) => {
    when = when || 0;
    let m = fn,
        d = $.makeArray(data),
        f,
        r;
    
    if (typeof fn == 'string') {
        m = context[fn];
    }
    
    if (!m) {
        //S.error('method undefined');
        // alert('method undefined');
        return null;
    }
    
    f = function () {
        m.apply(context, d);
    };
    
    r = (periodic) ? setInterval(f, when) : setTimeout(f, when);
    
    return {
        id: r,
        interval: periodic,
        cancel: function () {
            if (this.interval) {
                clearInterval(r);
            } else {
                clearTimeout(r);
            }
        }
    };
}

/**
 * 返回一个函数，在 ms 毫秒后执行，
 * 在 ms 毫秒内多次触发都只执行一次，只在最后一次触发后 ms 秒执行
 */
const buffer = (fn, ms, context) => {
    ms = ms || 150;
    
    if (ms === -1) {
        return function () {
            fn.apply(context || this, arguments);
        };
    }
    let bufferTimer = null;
    
    function f() {
        f.stop();
        bufferTimer = later(fn, ms, 0, context || this, arguments);
    }
    
    f.stop = function () {
        if (bufferTimer) {
            bufferTimer.cancel();
            bufferTimer = 0;
        }
    };
    
    return f;
}

/**
 * 返回一个函数，这个函数在连续多次触发执行时，会按照指定的ms（毫秒）来循环执行。
 * 如：配置了ms = 100, 在1000ms内触发了 10000次，函数最多只会执行 10次。
 * 停止触发后则会停止循环执行。
 */
const fixInterval = (fn, ms, context) => {
    ms = ms || 150;
    
    if(ms === -1) {
        return function(){
            fn.apply(context || this, arguments);
        }
    }
    
    let going = false,
        bufferTimer = null;
    
    function f() {
        if(!going) {
            going = true;
            bufferTimer = later(function(){
                going = false;
                fn.apply(this, arguments);
            }, ms, 0, context || this, arguments);
        }
    }
    
    f.stop = function(){
        if(bufferTimer) {
            bufferTimer.cancel();
            going = false;
            bufferTimer = 0;
        }
    }
    
    return f;
}

export default {
    later,
    buffer,
    fixInterval
}
