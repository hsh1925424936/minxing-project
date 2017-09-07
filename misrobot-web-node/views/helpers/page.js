var fs = require('fs');
var Handlebars = require('hbs');

Handlebars.registerHelper("page", function(){
    var options = arguments[arguments.length - 1];
    var baseUrl = (arguments.length > 1 ? arguments[0] : null) || options.hash.baseUrl || '',
        current = (options.hash.current || 1)*1,
        showNum = (options.hash.showNum || 10)*1,
        pageSize= options.hash.pageSize || 20,
        totalPages   = options.hash.totalPages,
        totalRecords = options.hash.totalRecords,
        type = options.hash.type,
        pageVar = options.hash.pageVar || 'page',
        pageSizeVar = options.hash.pageSizeVar || "pageSize",
        base = baseUrl + (baseUrl.indexOf('?') < 0 ? '?' : '&')
                       + (options.hash.pageSize ? (pageSizeVar + '=' + pageSize + '&') : '')
                       + pageVar + '=';

    if(!totalPages) {
        if(!totalRecords || !pageSize) {
            return new Handlebars.SafeString("");
        } else {
            totalPages = Math.ceil(totalRecords / pageSize);
        }
    }

    var pageShowMax = showNum % 2 == 0 ? current - 1 : current;
    var pageShowMin = current;

    if(type === 'min') {
        pageShowMax = current - 1;
        showNum = 0;
    }
    for(var i = 0; i < Math.floor(showNum/2); i++) {
        pageShowMax++;
        pageShowMin--;
        if(pageShowMax > totalPages) {
            pageShowMax = totalPages;
            if(pageShowMin > 1) {
                pageShowMin--;
            }
        }
        if(pageShowMin < 1) {
            pageShowMin = 1;
            if(pageShowMax < totalPages) {
                pageShowMax++;
            }
        }
    }
    
    var ret = `<div class="turn_page"><span style="float:left;color:#339;">总共${totalRecords}条记录&nbsp;&nbsp;${current}/${totalPages}&nbsp;&nbsp;</span>`+
                `<table class="page-table" style="display:block; float: left;"><tr>`;

    if(current > 1) {
        ret += '<td style="width:40px;"><a href="'+ base + '1">首页</a></td>';
    } else {
        ret += '<td class="disabled" style="width:40px;"><a>首页</a></td>';
    }
    
    for(var i = pageShowMin; i <= pageShowMax; i++) {
        if (i == current) {
            ret += '<td style="background-color:#0099CC; font-weight:600;color:#FFFFFF;">' + i + '</td>';
        } else {
            ret += '<td><a href="' + base + i + '">' + i + '</a></td>';
        }
    }
    
    if (current >= totalPages) {
        ret += '<td class="disabled" style="width:40px;"><a>末页</a></td>';
    } else {
        ret += '<td style="width:40px;"><a href="' + base + totalPages + '">末页</a></td>';
    }

    if(options.fn) {
        ret += options.fn(options.context);
    }
    ret += '</tr></table></div>';
    return new Handlebars.SafeString(ret);
});

exports = Handlebars;
