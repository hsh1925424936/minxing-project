/**
 * Created by liuchuanyang on 2017/7/20.
 */
const api = global.mis.api;

// 获取指定药品详情 或者默认第一个详情
const getMedicineDetail = ( id ) => {
    if(!id) {
        return api.post('medicine/list',
            { "1" : {
                command: 'medicine/list',
                sessionid: 111,
                loginid: 111
            } }
        ).then(ret => {
            let list =  ret['1'] && ret['1'] && ret['1']['medicinelist'];
            return list[0];
        });
    } else {
        return api.post('medicine/detail',
            { "1" : {
                command: 'medicine/detail',
                sessionid: 111,
                loginid: 111,
                id: id
            } }
        ).then(ret => {
            return ret['1'] && ret['1'];
        });
    }
};

const show = (group, id) => {

    let mws = global._ws.medicine;
    let io = mws.io;

    id = id || (mws.groups[group] && mws.groups[group].currentid);
    return getMedicineDetail( id ).then( info => {
        if(!mws.groups[group]) {
            mws.groups[group] = {};
        }
        mws.groups[group].currentid = info.id;
        if(group) {
            console.log(`send message to grup ${group}`);
            io.to(group).emit('group message', info);
        } else {
            console.log(`send message to global`);
            io.emit('global message', info);
        }

        return true;
    });
};

const reset = (req, res, next) => {
    let mws = global._ws.medicine;
    let io = mws.cabio;
    io.to('cabinet').emit('reset',{});
};

module.exports = {
    getMedicineDetail,
    show,
    reset
};
