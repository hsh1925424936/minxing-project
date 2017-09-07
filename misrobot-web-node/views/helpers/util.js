var Handlebars = require('hbs');
var config = require('../../sys-config');
var striptags = require('striptags');

Handlebars.registerHelper({
    
    pbase : function(){
        return config.isProduction ? '' : '/project/' + config.testDomain;
    },
    striptags: function(str){
        return striptags(str);
    },
    truncate: function (str, num) {
        
        str = str || '';
        if(typeof str === 'string' && num > 0) {
            if(str.length > num) {
                str = str.substr(0, num) + '...';
            }
        }
        return str;
    },
    join: function () {
        var len = arguments.length;
        
        if(len <= 1) {
            return '';
        } else if(len === 2) {
            return arguments[0];
        }
        
        var arr = Array.prototype.slice.call(arguments, 0, len - 2 );
        var sep = arguments[len - 2];
       
        return arr.join(sep);
    }
});
