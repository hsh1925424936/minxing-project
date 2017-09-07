'use strict';

module.exports = (req, res, next) => {
    res.success = (result) => {
        return res.json({
            code: 200,
            data: result
        })
    };

    res.error = (message, code) => {
        return res.json({
            code: code || 400,
            message: message
        })
    };

    res.customJson = (result) => {
        return res.json({
            "1": result
        });
    };

    res.customSuccess = (result) => {
        return res.json({
            "1": Object.assign({
                errcode: 0,
                errdesc: 'OK'
            }, result)
        });
    };

    res.customError = (code, desc, param) => {
        return res.json({
            "1": Object.assign({
                errcode: code,
                errdesc: desc
            }, param)
        });
    };

    next()
}
