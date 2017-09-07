'use strict';
const hbs = require('hbs');
const Handlebars = hbs.handlebars;
const fs = require('fs');
const config = require('../../sys-config');


Handlebars.registerHelper("sub", function(partial, options){
    var tmpl = Handlebars.partials[partial];
    if(tmpl == null) {
        var source = fs.readFileSync(`${config.view_dir}/${partial}${config.tpl_ext}`, 'utf8');
        if(source != null) {
            Handlebars.registerPartial(partial, source);
            tmpl = Handlebars.partials[partial];
        } else {
            new Eror('partial is not found : ' + partial);
        }
    }
    //options.fn(this);
    var ctx = Object.create(this);
    for(var i in options.hash) {
        ctx[i] = options.hash[i];
    }
    if (typeof tmpl !== 'function') {
        tmpl = Handlebars.compile(tmpl);
    }
    return new Handlebars.SafeString(tmpl(ctx, options));
});

exports = Handlebars;
