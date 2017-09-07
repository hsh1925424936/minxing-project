import {getCookie,post} from '../config/util'
export default{
	initLogin({commit}){
		if(getCookie('uid')){
			commit('initLogin',true);
		}else{
			commit('initLogin',false);
		}
	},
	initUserRole({commit}){
		post('/role/queryrolebyuid',{
			command: 'role/queryrolebyuid',
            sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
		}).done((data)=>{
			if(data&&data.errcode==0){
				commit('initUserRole',data.rolelist);
			}
		})
	},
	initDeptBase({commit},{id}){
		post('/turn/queryTurnDeptList',{
			command: 'turn/queryTurnDeptList',
            sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			dept_id:id,
			type:0
		}).done((data)=>{
			if(data&&data.errcode==0){
				commit('initDeptBase',data.dept_list);
			}
		})
	},
	initDeptRoom({commit},{id}){
		post('/turn/queryTurnDeptList',{
			command: 'turn/queryTurnDeptList',
            sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			dept_id:id,
			type:1
		}).done((data)=>{
			if(data&&data.errcode==0){
				commit('initDeptRoom',data.dept_list);
			}
		})
	},
	initDeptIdList({commit}){
		return new Promise((resolve,reject)=>{
			post('/dept/finddeptbytecid',{
				command: 'dept/finddeptbytecid',
	            sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				tecid:getCookie('uid')
			}).done((data)=>{
				if(data&&data.errcode==0){
					commit('initDeptIdList',data.dept.map((item)=>{
						return item.id;
					}));
					resolve('');
				}else{
					reject('');
				}
			})
		})
	},
	initMenuList({commit}){
		return new Promise((resolve,reject)=>{
			post('/menus/querymenusbyuid', {
	            command: 'menus/querymenusbyuid',
	            sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				uid:getCookie('uid'),
	            moduleid: 'turn'
	        }).done(function(data){
	        	if(data && data.errcode == 0){
	        		let list = [];
	        		data.resultlist.forEach((item)=>{
	        			if(item.url.split('/').length>1){
	        				list.push(item);
	        			}
	        		})
	        		commit('initMenuList',list);
	        		resolve('');
	        	}
	        })
		})
	    
	},
	initAppMenuList({commit}){

	},
	initDeptList({commit}){
		post('/turn/queryTurnDeptList',{
			command: 'turn/queryTurnDeptList',
            sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			dept_id:99,
			type:1
		}).done((data)=>{
			if(data&&data.errcode==0){
				commit('initDeptList',data.dept_list);
			}
		})
	},
	initDeptBaseList({commit}){
		post('/turn/queryBaseList',{
			command: 'turn/queryBaseList',
            sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
		}).done((data)=>{
			if(data&&data.errcode ==0){
				commit('initDeptBaseList',data.base_list);
			}
		})
	},
	initGradeList({commit}){
		post('/turn/queryPeriodList',{
			command:'turn/queryPeriodList',
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
		}).done(function(data){
			if(data&&data.errcode==0){
				commit('initGradeList',data.period_list);
			}
		})
	},
	initOptionList({commit},{type,mutation}){
		console.log('bbbbbbbbbbbbbbbb'+mutation)
		post('/hr/querylevellist',{
			command:'hr/querylevellist',
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			code:type
		}).done(function(data){
			if(data&&data.errcode==0){
				commit(mutation,data.levellist);
			}
		})
	},
}