'use strict';

const medicineService = require('../medicine/service/medicine');

module.exports = (io) => {

    let ionsp = io.of('/medicine');
    let iocab = io.of('/medicine/cabinet');
    let ws = global._ws;
    let medicine = ws.medicine = ws.medicine || {};
    let counter = medicine.counter = 0;

    medicine.io = ionsp || iocab ;
    medicine.cabio = iocab;
    medicine.sockets = {};
    medicine.groups = {};

    // 连接
    ionsp.on('connection', function (socket) {
        counter++;
        console.log('a user connected. total: ' + counter);

        let info = socket.handshake.query;
        let socketInfo = {
            socket: socket,
            id: info.id,
            group: info.group
        };

        medicine.sockets[socket.id] = socketInfo;

        if(socketInfo.group) {
            socket.join(socketInfo.group, () => {
                let joinMsg = `id: ${socketInfo.id} is join group ${socketInfo.group}`;
                ionsp.to(socketInfo.group).emit('notice', joinMsg);

                if(!medicine.groups[socketInfo.group]) {
                    medicine.groups[socketInfo.group] = {};
                }

                medicineService.show(socketInfo.group);
                // 发送当前药品 或者 默认药品
            });
        }

        socket.on('disconnect', function (msg) {
            delete medicine.sockets[socket.id];
            counter--;
            console.log(`socket id ${socket.id} disconnect ... `);
        });
    });
    iocab.on('connection', function (socket) {
        counter++;

        console.log('a user connected.cabinet total: ' + counter);

        socket.join('cabinet');//加入分组

        socket.on('reset', function (data) {//选择好病例
            console.log('reset');
            iocab.to('cabinet').emit('reset',data);
        });
        socket.on('start', function (data) {//选择好病例
            iocab.to('cabinet').emit('start',data);
        });
        socket.on('play', function (data) {//可以开始打分
            iocab.to('cabinet').emit('play',data);
        });
        socket.on('recipe', function (data) {//发送处方
            iocab.to('cabinet').emit('recipe',data);
        });
        socket.on('boost', function (data) {//放大处方
            iocab.to('cabinet').emit('boost',data);
        });
        socket.on('closed', function (data) {//关闭放大
            socket.broadcast.to('cabinet').emit('closed', data);
        });
        socket.on('unite', function (data) {//药品添加
            socket.broadcast.to('cabinet').emit('unite', data);
        });
        socket.on('delete', function (data) {//药品删除
            socket.broadcast.to('cabinet').emit('delete', data);
        });
        socket.on('send', function (data) {//药品发送
            console.log(data);
            socket.broadcast.to('cabinet').emit('send', data);
        });
        socket.on('end', function (data) {//提交成绩
            socket.broadcast.to('cabinet').emit('end', data);
        });

        socket.on('disconnect', function (msg) {
            delete medicine.sockets[socket.id];
            counter--;
            console.log(`socket id ${socket.id} disconnect ... `);
        });
    });
};
