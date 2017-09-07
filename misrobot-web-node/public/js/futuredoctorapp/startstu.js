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
window.onerror = function(msg, url, line){
	alert(msg+url+line)
};
window.onload = function() {
	'use strict';
	wxcommon(1);

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

	(function(){//查询分组信息
		var data={
			command: "group/querygroupinfo",
			scheduleid: getCookie('gy_istudy_scid'),
			sessionid: getCookie('sid'),
			stdid: getCookie('uid'),
			loginid: getCookie('uid')
		};
		function callback(result){
			if (result.groupresult == null) {
				isGroupNow=-1;
				$('.ketang-menu-info h3').html('暂未分组');
				$('.ketang-menu-info p').html('');
				$('.ketang-menu-info img').attr('src', '../../images/futuredoctorapp/feifei.png');
			} else {
				var sgindex = result.groupresult[0].sgindex;
				isGroupNow=sgindex;
				stuRole=result.groupresult[0].role;
				$('.ketang-menu-info h3').html('第' + sgindex + '组');
				$('.ketang-menu-info p').html('您所在的小组');
				$('.ketang-menu-info img').attr('src', result.groupresult[0].imageurl == 'null' ? '../../images/futuredoctorapp/feifei.png' : result.groupresult[0].imageurl);
			};
		}
		post('/group/querygroupinfo',data,callback,errcodefn,errfn)
	})();
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
						aLi[index].style.backgroundImage = 'url(../../images/futuredoctorapp/wx_ketang-menu-group_click.png)';
						window.location.href = 'groupstu.html';
						break;
					case 1:
//									aLi[index].style.backgroundImage = 'url(/misrobot-web/images/istudy/wx_ketang-menu-agree_click.png)';
						break;
					case 2:
						aLi[index].style.backgroundImage = 'url(../../images/futuredoctorapp/wx_ketang-menu-answer_click.png)';
						toanswer();
						break;
					case 3:
						aLi[index].style.backgroundImage = 'url(../../images/futuredoctorapp/wx_ketang-menu-write_click.png)';
						towrite();
						break;
					case 4:
						aLi[index].style.backgroundImage = 'url(../../images/futuredoctorapp/wx_ketang-menu-vote_click.png)';
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
};
function d2a(n){
	return n*Math.PI/180;
};
function addzero(n) {
	return n<10?"0"+n:n;
};
function toanswer() {
	var data={
		command: "question/hasraceanswer",
		scheduleid: getCookie('gy_istudy_scid'),
		sessionid: getCookie('sid'),
		loginid: getCookie('uid')
	};
	function callback(result){
		if(result.qid) {
			window.location.href = "answerstu.html?questionid="+result.qid;
		}
	};
	post('/question/hasraceanswer',data,callback,errcodefn,errfn);
	setTimeout(function(){
		$('.ketang-menu-answer').css('background-image','url(../../images/istudy/wx_ketang-menu-answer.png)');
	},500)
};

function tovote() {
	var voteid="";//用于保存后台返回的voteid
	var sgindex="";//用于保存后台返回的sgindex，给哪个组投票
	var name="";//用于保存后台返回的name,给哪个人投票
	var data={
		command: "question/isonvote",
		scheduleid: getCookie('gy_istudy_scid'),
		sessionid: getCookie('sid'),
		loginid: getCookie('uid'),
	};
	function callback(result){
		if(!result.voteid) {
			uselayer(3,'现在没有投票！');
			$('.ketang-menu-vote').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-vote.png)');
			return;
		}
		voteid=result.voteid;
		sgindex=result.sgindex;
		name=result.name;
		var votewho=sgindex?"第"+sgindex+"组":name;
		uselayer(2,'确定给'+votewho+'投票吗？',function (){
			var json={
				command: "question/answervote",
				scheduleid: getCookie('gy_istudy_scid'),
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
				stdid:getCookie('uid'),
				voteid:voteid
			};
			function resultcallback(res){
				uselayer(3, '投票成功');
				$('.ketang-menu-vote').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-vote.png)');
			};
			post('/question/answervote',json,resultcallback,errcodefn,errfn)
		});
	};
	post('/question/isonvote',data,callback,errcodefn,errfn);
	setTimeout(function(){
		$('.ketang-menu-vote').css('background-image','url(../../images/istudy/wx_ketang-menu-vote.png)');
	},500)
};

function towrite() {
	var data={
		command: "question/queryclassquestioninfo",
		scheduleid: getCookie("gy_istudy_scid"),
		sessionid: getCookie("sid"),
		loginid: getCookie('uid'),
		stdid:getCookie('uid')
	};
	function callback(result){
		if(!result.questionsresult){//如果没有查到提问
			uselayer(3,"当前时间没有提问");
			$('.ketang-menu-write').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-write.png)');
			return;
		}
		else{//如果查到提问
			//先判断现在有无分组
			if(isGroupNow!=-1){//说明现在已经分组
				if(result.questionsresult[0].type==1){//如果是抢答
					if(result.sgindex==isGroupNow){//如果是我们这组抢到了
						if(stuRole==2){//如果我是我们这组的记录员
							window.location.href="resultstu.html";
						}
						else{
							uselayer(3,"记录员才能答题哦~");
							$('.ketang-menu-write').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-write.png)');
						}
					}
					else{
						uselayer(3,"答题权被其它组抢去了~");
						$('.ketang-menu-write').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-write.png)');
					}
				}
				else{//如果是提问
					if(stuRole==2){//如果我是我们这组的记录员
						window.location.href="resultstu.html";
					}
					else{
						uselayer(3,"记录员才能答题哦~");
						$('.ketang-menu-write').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-write.png)');
					}
				}
			}
			else{//说明现在没有分组
				//没分组的情况下，如果是抢答，抢到答题权的人才能答
				if(result.questionsresult[0].type==1){
					if(result.userid==getCookie('uid')){
						window.location.href="resultstu.html";
					}
					else{
						uselayer(3,"抱歉</br>您没有抢到答题权");
						$('.ketang-menu-write').css('background-image','url(../../images/futuredoctorapp/wx_ketang-menu-write.png)');
					}
				}
				else{//没分组的情况下，如果是提问，那么所有人都能进入答题界面
					window.location.href="resultstu.html";
				}
			}
		}
	}
	post('/question/queryclassquestioninfo',data,callback,errcodefn,errfn);
	setTimeout(function(){
		$('.ketang-menu-write').css('background-image','url(../../images/istudy/wx_ketang-menu-write.png)');
	},500)
};

