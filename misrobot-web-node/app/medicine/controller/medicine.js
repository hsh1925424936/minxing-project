/**
 * Created by liuchuanyang on 2017/7/20.
 */

const medicineService = require('../service/medicine');

const show = (req, res, next) => {

    let id = req.body.data;
    let group = req.body.group;

    medicineService.show( group, id).then(ret => {
        res.success('显示成功！');
    });
};

const reset = (req, res, next) => {

    medicineService.reset();
    res.customSuccess({
        command:'medicine/reset'
    });
};

module.exports = {
    show,
    reset
};
