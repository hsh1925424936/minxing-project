'use strict';

const path = require('path');

module.exports = (app) => {
    // app.use('/mgr/api', require('./app/mgr-api'));

    // app.use(['/web-mgr', '/passport', '/login'], (req, res) => {
    //     return res.sendFile(path.join(__dirname, '/public/page/index.html'));
    // });

    app.use(require('./app/passport/router'));
    app.use('/file', require('./app/file/router'));
    app.use('/medicine', require('./app/medicine/router'));
    app.use('/autoupgrade', require('./app/autoupgrade/router'));
    app.use(require('./app/web/router'));
};
