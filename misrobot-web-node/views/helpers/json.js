var Handlebars = require('hbs');

Handlebars.registerHelper('json', function(json){
    return new Handlebars.SafeString(JSON.stringify(json));
});

module.exports = Handlebars;