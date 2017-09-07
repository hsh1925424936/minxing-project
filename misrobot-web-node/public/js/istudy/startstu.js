window.onresize = function () {
	$('.ketang-time').css({'width':$('.ketang-time').css('height'),'line-height':$('.ketang-time').css('height'),'margin':-$('.ketang-time')[0].offsetHeight/2+'px'});
	$('.ketang-menu ul').css({'width':$('.ketang-menu ul').css('height'),'margin':-$('.ketang-menu ul')[0].offsetHeight/2+'px'});
	$('.ketang-menu ul li ').css({'width':$('.ketang-menu ul li').css('height'),'margin':-$('.ketang-menu ul li')[0].offsetHeight/2+'px'});
	$('.ketang-menu-info ').css({'width':$('.ketang-menu-info').css('height'),'margin':-$('.ketang-menu-info')[0].offsetHeight/2+'px'});
	$('.ketang-menu-info img ').css({'width':$('.ketang-menu-info img').css('height')});				
};
var sessionid="";
var loginid="";
var scheduleid="";
var isGroupNow="";//变量用于保存现在是否已经分组，-1表示没有分组，
var stuRole="";//当前学生的角色
window.onload = function() {
	'use strict';
	wxcommon(1);
	// 获取当前用户课堂信息
	// getClasses();
	$('.ketang-time').css({
		'width': $('.ketang-time').css('height'),
		'line-height': $('.ketang-time').css('height'),
		'margin': -$('.ketang-time')[0].offsetHeight / 2 + 'px'
	});
	$('.ketang-menu ul').css({
		'width': $('.ketang-menu ul').css('height'),
		'margin': -$('.ketang-menu ul')[0].offsetHeight / 2 + 'px'
	});
	$('.ketang-menu ul li ').css({
		'width': $('.ketang-menu ul li').css('height'),
		'margin': -$('.ketang-menu ul li')[0].offsetHeight / 2 + 'px'
	});
	$('.ketang-menu-info ').css({
		'width': $('.ketang-menu-info').css('height'),
		'margin': -$('.ketang-menu-info')[0].offsetHeight / 2 + 'px'
	});
	$('.ketang-menu-info img ').css({'width': $('.ketang-menu-info img').css('height')});
	//$('.ketang-menu-info img').attr('src',getCookie('gy_u_imgurl')=='null'?'../../images/istudy/feifei.png':getCookie('gy_u_imgurl'));
	//if (getCookie('gy_istudy_group') ==0 ) {
	//$('.ketang-menu-info h3').html('暂未分组');
	//$('.ketang-menu-info p').html('');
	// } else {
	//$('.ketang-menu-info h3').html('第'+getCookie('wx_g')+'组');
	//$('.ketang-menu-info p').html('您所在的小组');
	//}
	Api.R({
		isShade: 1,
		url: "/group/querygroupinfo",
		json: {
			"1": {
				command: "group/querygroupinfo",
				scheduleid: getCookie('gy_istudy_scid'),
				sessionid: getCookie('gy_t'),
				stdid: getCookie('gy_u'),
				loginid: getCookie('gy_u')
			}
		},
		fn: function (result) {
			if (result["1"].errcode != 0) {
				isGroupNow=-1;
				uselayer(3, result["1"].errdesc);
				$('.ketang-menu-info h3').html('暂未分组');
				$('.ketang-menu-info p').html('');
				$('.ketang-menu-info img').attr('src', '../../images/istudy/feifei.png');
			}
			if (result["1"].groupresult == null) {
				isGroupNow=-1;
				$('.ketang-menu-info h3').html('暂未分组');
				$('.ketang-menu-info p').html('');
				$('.ketang-menu-info img').attr('src', '../../images/istudy/feifei.png');
			} else {
				var sgindex = result["1"].groupresult[0].sgindex;
				isGroupNow=sgindex;
				stuRole=result["1"].groupresult[0].role;
				$('.ketang-menu-info h3').html('第' + sgindex + '组');
				$('.ketang-menu-info p').html('您所在的小组');
				$('.ketang-menu-info img').attr('src', result["1"].groupresult[0].imageurl == 'null' ? '../../images/istudy/feifei.png' : result["1"].groupresult[0].imageurl);
			}
		},
		error: function () {
			alert("连接服务失败")
		}
	})
	$('.ketang-menu-info').click(function () {
		window.location.href = 'performance.html';
	});
	var oUl = document.getElementsByClassName('ketang-menu')[0].getElementsByTagName('ul')[0];
	var aLi = oUl.getElementsByTagName('li');

	var R = oUl.offsetWidth / 2;
	for (var i = 0; i < aLi.length; i++) {
		(function (index) {
			var a = 360 / aLi.length * index;
			aLi[index].style.left = R + Math.sin(d2a(a)) * R + "px";
			aLi[index].style.top = R - Math.cos(d2a(a)) * R + "px";
			aLi[index].onclick = function () {
				switch (index) {
					case 0:
						aLi[index].style.backgroundImage = 'url(../../images/istudy/wx_ketang-menu-group_click.png)';
						window.location.href = 'groupstu.html';
						break;
					case 1:
//									aLi[index].style.backgroundImage = 'url(/misrobot-web/images/istudy/wx_ketang-menu-agree_click.png)';
						break;
					case 2:
						aLi[index].style.backgroundImage = 'url(../../images/istudy/wx_ketang-menu-answer_click.png)';
						toanswer();
						break;
					case 3:
						aLi[index].style.backgroundImage = 'url(../../images/istudy/wx_ketang-menu-write_click.png)';
						towrite();
						break;
					case 4:
						aLi[index].style.backgroundImage = 'url(../../images/istudy/wx_ketang-menu-vote_click.png)';
						tovote();
						break;
					case 5:
						//aLi[index].style.backgroundImage = 'url(../../images/istudy/wx_ketang-menu-score_click.png)';
						//window.location.href = 'rankstu.html';
						break;
				}
			};
		})(i);
	}
	var oSpan = document.getElementsByClassName('ketang-time')[0];
	oSpan.begin = false;
	//startclock();
	//setInterval(startclock,1000);//定时器！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	/*var timerend=setInterval(function(){//每2秒查一次现在是否有提问
		questionTime();
	},1000);*/
}
/*function startclock() {
	if(getCookie('gy_course_endTime')) {
		var endTime = datetotime(setCookie('gy_course_endTime'));
		var now = (new Date()).getTime().toString().substr(0, 10);
		if(endTime > now) {
			var min = endTime - now ;
			$('.ketang-time').html(parseInt(endTime/3600)+':'+ addzero(MendTime/60));
		}else {
			$('.ketang-time').html('0:00') ;
			return;
		}
	}else{
		$('.ketang-time').html('0:00') ;
		return;
	}
};*/
/*function questionTime(){//查询答题时间
	//"/question/queryendtime"
	//输入参数：command,sessionid,loginid,scheduleid
	//输出参数:endtime(单位s)
	var json={
		"1":{
			command:"question/queryendtime",
			sessionid:getCookie('gy_t'),
			loginid:getCookie('gy_u'),
			scheduleid:getCookie('gy_istudy_scid')
		}
	};
	var request=new XMLHttpRequest();
	request.open("POST","/question/queryendtime");
	request.setRequestHeader("ContentType","application/json;charset=UTF-8");
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var response=JSON.parse(request.responseText)["1"];
			if(response.errcode!=0){
				$('.ketang-time').html("0:00") ;
				layer.msg(response.errdesc);
				logoutquick();
			}else{
				if(response.endtime!=0){
					var minute=parseInt(response.endtime / 60);
					var second=parseInt(response.endtime % 60);
					if(parseInt(response.endtime % 60).toString().length==1){//秒为个位
						$('.ketang-time').html(minute+":"+"0"+second) ;
					}
					else{//秒为2位
						$('.ketang-time').html(minute+":"+second) ;
					}
				}else{
					$('.ketang-time').html("0:00") ;
				}
			}
		}
	};
	request.send(JSON.stringify(json))
};*/
function d2a(n){
	return n*Math.PI/180;
};
function addzero(n) {
	return n<10?"0"+n:n;
};

function toanswer() {
	Api.R({
		isShade: 1,
		url: "/question/hasraceanswer",
		json: {
			"1": {
				command: "question/hasraceanswer",
				scheduleid: getCookie('gy_istudy_scid'),
				sessionid: getCookie('gy_t'),
				loginid: getCookie('gy_u')
			}
		},
		fn: function(result){
			if(result["1"].errcode!=0){
				uselayer(3, result["1"].errdesc);
				$('.ketang-menu-answer').css('background-image','url(../../images/istudy/wx_ketang-menu-answer.png)');
				return;
			}
			//if(result["1"].isonrace == 1) {
				//uselayer(3,'当前已有抢答！');
				//$('.ketang-menu-answer').css('background-image','url(../../images/istudy/wx_ketang-menu-answer.png)');
				//return;
			//}
			if(result["1"].qid) {
				window.location.href = "answerstu.html?questionid="+result["1"].qid;
			}
		},
		error: function(str) {
			uselayer(3,'请求失败，请重新抢答！');
			$('.ketang-menu-answer').css('background-image','url(../../images/istudy/wx_ketang-menu-answer.png)');
		}
	});							
};

function tovote() {
	var voteid="";//用于保存后台返回的voteid
	var sgindex="";//用于保存后台返回的sgindex，给哪个组投票
	var name="";//用于保存后台返回的name,给哪个人投票
	Api.R({
		isShade: 1,
		url: "/question/isonvote",
		json: {
			"1": {
				command: "question/isonvote",
				scheduleid: getCookie('gy_istudy_scid'),
				sessionid: getCookie('gy_t'),
				loginid: getCookie('gy_u'),
			}
		},
		fn: function(result) {
			if(result["1"].errcode!=0){
				uselayer(3, result["1"].errdesc);
				$('.ketang-menu-vote').css('background-image','url(../../images/istudy/wx_ketang-menu-vote.png)');
				return;
			}
			if(!result["1"].voteid) {
				uselayer(3,'现在没有投票！');
				$('.ketang-menu-vote').css('background-image','url(../../images/istudy/wx_ketang-menu-vote.png)');
				return;
			}
			voteid=result["1"].voteid;
			sgindex=result["1"].sgindex;
			name=result["1"].name;
			var votewho=sgindex?"第"+sgindex+"组":name;
			uselayer(2,'确定给'+votewho+'投票吗？',function (){
				Api.R({
					isShade: 1,
					url: "/question/answervote",
					json: {
						"1": {
							command: "question/answervote",
							scheduleid: getCookie('gy_istudy_scid'),
							sessionid: getCookie('gy_t'),
							loginid: getCookie('gy_u'),
							stdid:getCookie('gy_u'),
							voteid:voteid
						}
					},
					fn: function(result) {
						if(result["1"].errcode!=0){
							uselayer(3, result["1"].errdesc);
							return;
						}
						uselayer(3, '投票成功');
						$('.ketang-menu-vote').css('background-image','url(../../images/istudy/wx_ketang-menu-vote.png)');
					}
				});
			});
		},
		error: function(){
			uselayer(3,'请求失败，请重新投票！');
			$('.ketang-menu-vote').css('background-image','url(../../images/istudy/wx_ketang-menu-vote.png)');
		}
	});

};

function towrite() {
	Api.R({
		isShade: 1,
		url: "/question/queryclassquestioninfo",
		json: {
			"1": {
				command: "question/queryclassquestioninfo",
				scheduleid: getCookie("gy_istudy_scid"),
				sessionid: getCookie("gy_t"),
				loginid: getCookie('gy_u'),
				stdid:getCookie('gy_u')
			}
		},
		fn: function(result) {
			if(result["1"].errcode!=0){
				uselayer(3,result["1"].errdesc);
				$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
				return;
			}
			if(!result["1"].questionsresult){//如果没有查到提问
				uselayer(3,"当前时间没有提问");
				$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
				return;
			}
			else{//如果查到提问
				//先判断现在有无分组
				if(isGroupNow!=-1){//说明现在已经分组
					if(result["1"].questionsresult[0].type==1){//如果是抢答
						if(result["1"].sgindex==isGroupNow){//如果是我们这组抢到了
							if(stuRole==2){//如果我是我们这组的记录员
								window.location.href="resultstu.html";
							}
							else{
								uselayer(3,"记录员才能答题哦~");
								$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
							}
						}
						else{
							uselayer(3,"答题权被其它组抢去了~");
							$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
						}
					}
					else{//如果是提问
						if(stuRole==2){//如果我是我们这组的记录员
							window.location.href="resultstu.html";
						}
						else{
							uselayer(3,"记录员才能答题哦~");
							$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
						}
					}
				}
				else{//说明现在没有分组
					//alert("没分组");
					//没分组的情况下，如果是抢答，抢到答题权的人才能答
					if(result["1"].questionsresult[0].type==1){
						if(result["1"].userid==getCookie('gy_u')){
							window.location.href="resultstu.html";
						}
						else{
							uselayer(3,"抱歉</br>您没有抢到答题权");
							$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
						}
					}
					else{//没分组的情况下，如果是提问，那么所有人都能进入答题界面
						window.location.href="resultstu.html";
					}
				}
			}
		},
		error: function(str) {
			layer.msg("连接服务失败");
			$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
		}
	});	
};

