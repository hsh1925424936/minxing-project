/**
 * Created by liuchuanyang on 2017/6/27.
 */
// var fetch = require('node-fetch');

const api = global.mis.api;

const signinByOpenID = (user) => {

	return api.post('user/scancode',
		{ "1" : user }
	).then(ret => {
	    return ret['1']
	});
};
const addOsceUser = (user)=>{
	return api.post('osceexamexaminee/addosceexamexaminee',
		{ "1" : user }
	).then(ret => {
	    return ret['1']
	});
}
module.exports = {
    signinByOpenID,
    addOsceUser
};
