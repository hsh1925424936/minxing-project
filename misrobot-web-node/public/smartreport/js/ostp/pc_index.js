
$(document).ready(function(e) {
	'use strict';
	common();
	
	$('.headImg2').attr('src',getCookie('gy_a'));
	$('.nameSpan').html(codetostr(getCookie('gy_n')));
	
	Api.R({
		url: "/usr/querymyinfo"
		isShade:1,
		json:{
			"1": {
				command: "usr/querymyinfo",
				sessionid: getCookie('gy_t'),
				uid: getCookie('gy_u')
			}
		},				
		fn:function (base) {
			if (base["1"].errcode!=1) {
				uselayer(3,base["1"].errdesc);
				return false;
			}
			// var json = base.data[0];					
			// console.log(json);
			// $('.indexCon2').html(json.majorname+json.grade+'级'+json.classname);
			//$('.indexCon3').html(json.years+'年制');
			
			
		}
	});				


	(function () {
		var aColor = ['#ff937f','#4dacfe','#8a7ee0','#3fd687'];
		
		$('.indexCircle div').each(function (index) {
			$(this)[0].radialObj = radialIndicator($(this),{
				radius:29,
				barBgColor:'#ccc',
		        barColor: aColor[index],
		        barWidth: 4,
		        initValue: 0,
		        displayNumber:false,
		        roundCorner : true,
		    });	
			
		});			
	//查询成长趋势
		Api.R({
			url: "/learningindex/querymyindex",
			isShade:1,
			json:{
				'1':{
					command:'learningindex/querymyindex',
					accountname:getCookie('gy_un'),
					sessionid: getCookie('gy_t')
				}
			},
			fn:function (base) {
				var json = base[1];
				if (json.errcode!=0) {
					uselayer(1,json.errdesc);
					return false;
				}						
				
				$('.indexCon1Span4').css('width',parseFloat(isnull(json.learningindex))+'%');
				
				$('.indexCircle div').eq(0)[0].radialObj.animate(parseFloat(isnull(json.studiousindex)));
				$('.indexNum').eq(0).html(parseFloat(isnull(json.studiousindex)).toFixed(2));
				$('.indexCircle div').eq(1)[0].radialObj.animate(parseFloat(isnull(json.quickindex)));
				$('.indexNum').eq(1).html(parseFloat(isnull(json.quickindex)).toFixed(2));
				$('.indexCircle div').eq(2)[0].radialObj.animate(parseFloat(isnull(json.medicalindex)));
				$('.indexNum').eq(2).html(parseFloat(isnull(json.medicalindex)).toFixed(2));
				$('.indexCircle div').eq(3)[0].radialObj.animate(parseFloat(isnull(json.kindindex)));
				$('.indexNum').eq(3).html(parseFloat(isnull(json.kindindex)).toFixed(2));
				
				$('.indexCon1Span2').html('学习指数<span>'+parseFloat(isnull(json.learningindex))+'</span>&nbsp;&nbsp;&nbsp;排名<span>'+isnull(json.learningindexrank)+'</span>/'+isnull(json.totalcount)+'人');
				$('.allcount').html('共'+isnull(json.totalcount)+'人');
				$('.learnRank').eq(0).html(isnull(json.studiousindexrank));
				$('.learnRank').eq(1).html(isnull(json.quickindexrank));
				$('.learnRank').eq(2).html(isnull(json.medicalindexrank));
				$('.learnRank').eq(3).html(isnull(json.kindindexrank));
				$('.learnRank2').eq(0).html(isnull(json.studiousindexrank));
				$('.learnRank2').eq(1).html(isnull(json.quickindexrank));
				$('.learnRank2').eq(2).html(isnull(json.medicalindexrank));
				$('.learnRank2').eq(3).html(isnull(json.kindindexrank));
			}
		});	

		Api.R({
			url: "/learningindex/querymyindex",
			isShade:1,
			json:{
				'1':{
					command:'learningindex/querymygrowthtrend',
					accountname:getCookie('gy_un'),
					sessionid: getCookie('gy_t')
				}
			},
			fn:function (base) {
				if (base["1"].errcode!=0) {
					uselayer(1,base["1"].errdesc);
					return false;
				}
				writegrow(base[1]);
			}
		});

		Api.R({
			url: "/learningindex/querymyability",
			isShade:1,
			json:{
				'1':{
					command:'learningindex/querymyability',
					accountname:getCookie('gy_un'),
					sessionid: getCookie('gy_t')
				}
			},
			fn:function (base) {
				if (base["1"].errcode!=0) {
					uselayer(1,base["1"].errdesc);
					return false;
				}
				writeability(base[1], '#fff');
			}
		});

		Api.R({
			url: "/learningindex/querymyindex",
			isShade:1,
			json:{
				'1':{
					command:'learningindex/querymyindex',
					accountname:getCookie('gy_un'),
					sessionid: getCookie('gy_t')
				}
			},
			fn:function (base) {
				if (base["1"].errcode!=0) {
					uselayer(1,base["1"].errdesc);
					return false;
				}
				writerank(base[1]);
			}
		});

	})();



	function writerank(json) {
		console.log(json);
		if (json.errcode!=0) {
			uselayer(1,json.errdesc);
			return false;
		}			
		$('.writerank').click(function () {
			console.log($(this).attr('_type'));
			var arr = json[$(this).attr('_type')];
			if (arr.length==0) {
				$('.writerankcon').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
				return false;
			}
			$('.writerankcon').html('');
			console.log(arr);
			$('.writerankcon').css('width',arr.length*148+'px');
			for (var i = 0 ; i < arr.length; i++) {
				var str = 
					'<li>'
						+'<img onerror='+'this.src="../../images/ostp/head2.png"'+' src="'+(arr[i].imgurl==undefined?'../../images/ostp/feifei.png':arr[i].imgurl)+'" />'
						+'<p>第'+arr[i].rank+'名</p>'
						+'<span>'+arr[i].name+'</span>'
					+'</li>';				
			
				$('.writerankcon').append(str);				
			}		
		});
		$('.writerank').eq(1).click();			
	};

	$('.indexCon4').click(function() {
		window.location.href='my-work.html';
	});

	Api.R({
		url: "/learn/querytaskinfo",
		isShade:1,
		json:{
			json: {
				"1": {
					command: "learn/querytaskinfo",
					uid: getCookie('gy_u'),
					sessionid: getCookie('gy_t'),
					loginid: getCookie('gy_u'),
					page:1,
					reqnum:10
				}
			}
		},
		fn:function (result) {
			if(result["1"].errcode){
				uselayer(3, result["1"].errdesc);
				return;
			}
			// console.log(array);

			var arr = result["1"].tasks;
			if (arr.length==0) {
				$('.workOuter').html('<p class="no-data">暂无作业</p>');
				$('.fenyeCon').css('display', 'none');
				return false;
			}

			$('.train-count').html(arr.length);
			$('.workOuter').html('');
			for (var i = 0 ; i < arr.length; i++) {
				var _str = '';
				_str= '<span class="circle '+(arr[i].finishcount==0?'':'circleOn')+'">练</span>';


				var _href = '<a class="starttrainBtn grey" href="javascript:;" target="_blank">已过期</a>';
				var isTrue = (new Date(arr[i].lasttime)).getTime() - (new Date()).getTime();
				if (isTrue >0) {
					var _href = '<a class="goOnTrainBtn" href="my-work-detail.html?train='+arr[i].learnid+'&tasklog='+arr[i].taskid+'"  target="_blank">继续训练</a>';
					if (arr[i].finishcount==0) {
						_href = '<a class="starttrainBtn" href="my-work-detail.html?train='+arr[i].learnid+'&tasklog='+arr[i].taskid+'" target="_blank">开始训练</a>';
					}
				}

				var rate = (Math.round((arr[i].finishcount/arr['i'].mincount)*100)).toFixed(2);
				var str =
					'<div class="workBox clearfix">'
					+'<h4 class="workTit">'+arr[i].name+'</h4>'
					+'<h4 class="countDown" _end="'+(new Date(arr[i].lasttime)).getTime() +'">'
					+'距离<span>0</span>分<span>0</span>秒'
					+'</h4>'
					+'<div class="progressBar clearfix">'
					+_str
					+'</div>'
					+'<span class="workBoxSpan span1">'+arr[i].teachers[0].name+'（老师）</span>'
					+'<span class="workBoxSpan span2 '+(arr[i].finishcount==0?'':'workBoxSpanOn')+'">'
					+'需要完成'+arr[i].mincount+'次&nbsp;进度'+rate+'%'
					+'</span>'
					+_href
					+'</div>';
				$('.workOuter').append(str);
			}
			$('.countDown').each(function () {
				var time = $(this).attr('_end').toString().substr(0,10) - ((new Date()).getTime()).getTime().toString().substr(0, 10);
				if (time<0) {
					return true;
				}
				var obj = $(this);
				var timer = null;
				timer = setInterval(tocountdown,1000);
				tocountdown();
				function tocountdown() {
					var d = parseInt(time/86400);
					var h = addzero(parseInt(time%86400/3600));
					var m = addzero(parseInt(time%86400%3600/60));
					var s = addzero(time%60);
					$(obj).html('距离'+(d>0?'<span>'+d+'</span>天':'')+(h>0?'<span>'+h+'</span>小时':'')+'<span>'+m+'</span>分<span>'+s+'</span>秒');
					time--;
					if (time<=0) {
						clearInterval(timer);
						$(obj).parent().find('a').attr('href','javascript:;');
						$(obj).parent().find('a').addClass('grey');
						$(obj).parent().find('a').html('已过期');
					}
				};					
			});
			
			$('.goOnTrainBtn,.starttrainBtn').click(function () {
				if (window.navigator.userAgent.toLowerCase().indexOf('chrome')!=-1) {
					uselayer(1,'请使用IE10以上、Firefox或者Opera内核的浏览器打开');
					return false;
				}
				
			});	
	
		}
	});	
	getweek();


	// Api.applyIndex({
	// 	isShade:1,
	// 	fn:function (base) {
	// 		console.log(base);
	// 		if (base.code!=1) {
	// 			uselayer(3,base.message);
	// 			return false;
	// 		}
	// 		var json = base.data;
	// 		$('.subscribeP2').html(json.applycount+'项可预约');
	// 		if (json.kdata==''||json.kdata.length==0) {
	// 			$('.subscribeP1 span').html('(共0项技能)');
	// 			$('.banner ul').html('<p class="no-data">暂无训练数据</p>');
	// 			return false;
	// 		}
	// 		var arr = json.kdata;
	// 		$('.subscribeP1 span').html('(共'+arr.length+'项技能)');

	// 		$('.banner ul').html('');
	// 		for (var i = 0 ; i < arr.length; i++) {
	// 			var str = 
	// 		        '<li>'
	// 		        	+'<h4>'+arr[i].name+'</h4>'
	// 		        	+'<div class="barOuter clearfix">'
	// 						+'<h5>训练次数</h5>'
	// 						+'<span class="barAllSpan"><span class="barSpan" style="width:'+arr[i].count/json.stuappcount*100+'%"></span></span>'
	// 						+'<div class="barAllDiv">'+json.stuappcount+'</div>'
	// 						+'<div class="barDiv">已完成'+arr[i].count+'次</div>'
	// 		        	+'</div>'
	// 		        	+'<div class="barOuter clearfix">'
	// 						+'<h5>训练分数</h5>'
	// 						+'<span class="barAllSpan"><span class="barSpan" style="width:'+arr[i].score/json.stuappscore*100+'%"></span></span>'
	// 						+'<div class="barAllDiv">'+json.stuappscore+'</div>'
	// 						+'<div class="barDiv">最高'+arr[i].score+'分</div>'
	// 		        	+'</div>'
	// 		        +'</li>';				
	// 			$('.banner ul').append(str);
	// 		}
			
	// 	    $('#b1').unslider({
	// 			dots: true,
	// 			delay: 100000000000
	// 		});			
			
	// 	}
		
	// });
	

});

$('.indexBox ').mouseenter(function() {
	$(this).find('.indexCircle').css('display', 'none');
	$(this).find('.indexBottom>p').css('display', 'none');
	$(this).find('.rankCircle').css('display', 'block');
	$(this).find('.indexBottom>h4').css('display', 'block');
});

$('.indexBox').mouseleave(function() {
	if($(this).attr('clicked') == 'true'){
		return;
	}
	$(this).find('.indexCircle').css('display', 'block');
	$(this).find('.indexBottom>p').css('display', 'block');
	$(this).find('.rankCircle').css('display', 'none');
	$(this).find('.indexBottom>h4').css('display', 'none');
});

$('.writerank').click(function(){
	$('.indexBox').attr('clicked', false);

	$('.indexCircle').css('display', 'block');
	$('.indexBottom>p').css('display', 'block');
	$('.rankCircle').css('display', 'none');
	$('.indexBottom>h4').css('display', 'none');

	$(this).find('.indexCircle').css('display', 'none');
	$(this).find('.indexBottom>p').css('display', 'none');
	$(this).find('.rankCircle').css('display', 'block');
	$(this).find('.indexBottom>h4').css('display', 'block');
	$(this).attr('clicked', true);
});

$('.indexBox')[0].click();

function getweek() {
	$('.week-schedule').css('display','block');
	Api.R({
		url: "/course/querycousreinfo"，
		isShade: 1,
		json: {
			"1": {
				command: "course/querycousreinfo",
				uid: getCookie('gy_u'),
				timetype: 2,
				sessionid: getCookie('gy_t'),
				loginid: getCookie('gy_u')
			}
		},
		fn: function(result) {
			if(result["1"].errcode){
				console.log(result["1"].errdesc);
				return;
			}
			$('.dayOuter').html('');
			if(result["1"].schedules.length == 0) {
				$('.dayOuter').html('<p class="no-data">本周暂无课程</p>');
				return;
			}
			var arr = {
						"1": {str: '', date: ''}, 
						"2": {str: '', date: ''}, 
						"3": {str: '', date: ''}, 
						"4": {str: '', date: ''}, 
						"5": {str: '', date: ''},
						"6": {str: '', date: ''}, 
						"0": {str: '', date: ''}
			};

			var _arr = result["1"].schedules;
			for (var i = _arr.length - 1; i >= 0; i--) {
				var _timeStr = '';
				var _timeStr1 = '';
				if(_arr[i].starttime.substr(11,2) <= 12) {
					_timeStr = '上午';
					_timeStr1 = 'morning';
				}else if(_arr[i].starttime.substr(11,2) <= 18){
					_timeStr = '下午';
					_timeStr1 = 'afternoon';
				}else{
					_timeStr = '晚上';
					_timeStr1 = 'evening';
				}
				var courseDay = (new Day(_arr[i].starttime)).getDay();

				_str+=	
						'<div class="clearfix">'
							+'<span class="clinicalSpan2 '+_timeStr1+'">'+_timeStr+'</span>'
							+'<span class="clinicalSpan3">'+_arr[i].starttime.substr(11,5)+'-'+_arr[i].endtime.substr(11,5)+'<br/>'+arr[i].coursename+'</span>'
							+'<div class="clinicalRight">'
								+'<span class="clinicalRightSpan1">技能中心</span>'
								+'<span class="clinicalRightSpan2">' +_arr[i].roomnum+'室</span>'
								+'<span class="clinicalRightSpan3">'+_arr[i].teachername[0].name+'老师</span>'
							+'</div>'	
						+'</div>';
				arr[courseDay].str += _str;
				arr[courseDay].date = _arr[i].starttime;
			}

			var dayArr = [1,2,3,4,5,6,0];
			for(var i = 0, i < dayArr.length;i++){
				if(arr[dayArr[i]].str !== '') {
					var strDay = '';
					if((new Date()).getDay == dayArr[i]){
						strDay = '今天';
					}else{
						switch (dayArr[i]){
							case 1: strDay = '周一';
								break;
							case 2: strDay = '周二';
								break;
							case 3: strDay = '周三';
								break;
							case 4: strDay = '周四';
								break;
							case 5: strDay = '周五';
								break;
							case 6: strDay = '周六';
								break;
							default: strDay = '周日';
								break;
						}	
					}

					var str = 	
						'<div class="clinicalBox clearfix"">'
							+  '<span class="clinicalSpan1">'+strDay+'<br/>'+ arr[dayArr[i]].date.substr(5,5) +'</span>'
							+'<div class="lessonOuter">'
							+ arr[dayArr[i]].str
							+ '</div>'
						+ '</div>';					
						
					$('.dayOuter').append(str);
					$('.timePart').css({'height':$('.timePart').css('width'),'line-height':$('.timePart').css('width')});
				}
			}
		}
	});					
};


	function getList(){
		Api.R({
			url: "/note/latestnotes",
			isShade:1,
			json:{
				"1": {
					command: "note/latestnotes",
					sessionid: getCookie('gy_t'),
					uid: getCookie('gy_u'),
					loginid: getCookie('gy_u'),
					reqnum: 100
				}
			},
			fn:function (json) {
				if(json["1"].errcode) {
					uselayer(3, json.errdesc);
					return;
				}
				var arr = json["1"].notelist;
				if (arr.length==0) {
					$('.msgOuter').html('<h3>通知</h3><p class="no-data">暂无通知！</p>');
					return false;
				}
				$('.msgOuter').html('<h3>通知</h3>');
				
				var　readMsg = '<img src="../img/msg_readed.png">';
				var　newMsg = '<img src="../img/new.png">';
				var  url = '';
				var  msgUrl = [];
				var reg = /http:\/\/[\w-\:\/?=&]*(\.[\w-\:\/?=&]*)+/ig;

				if( arr.length > 6 ){
					for (var i = 0 ; i < 7; i++) {
						    msgUrl = arr[i].content.match(reg);
						if( msgUrl ){
							url = msgUrl[0];
						}else {
							url = '/pc/see-msg.html';
						}
						if(Number(arr[i].notestatus) == 0){
							var str = '<div onclick="updatePmStatus('+arr[i].noteid+')" class="msgCon clearfix" _id="'+arr[i].noteid+'">'+newMsg+
							 '<p><a href="'+url+'">'+arr[i].notetitle+'</a></p>'+
							 '</div>';
						}else{
							var str = '<div class="msgCon clearfix" _id="'+arr[i].noteid+'">'+readMsg+
							 '<p><a style="color: #D4D0D0;" href="#">'+arr[i].notetitle+'</a></p>'+
							 '</div>';
						}

						$('.msgOuter').append(str);
					}
				}else{
					for (var i = 0 ; i < arr.length; i++) {
						    msgUrl = arr[i].content.match(reg);
						if( msgUrl ){
							url = msgUrl[0];
						}else {
							url = '/pc/see-msg.html';
						}
						if(Number(arr[i].notestatus) == 0){
							var str = '<div onclick="updatePmStatus('+arr[i].noteid+')" class="msgCon clearfix" _id="'+arr[i].noteid+'">'+ newMsg+
								'<p><a href="'+url+'">'+arr[i].notetitle+'</a></p>'+
								'</div>'
						}else{
							var str = '<div class="msgCon clearfix" style="color: #D4D0D0;" _id="'+arr[i].noteid+'">'+ readMsg+
								'<p ><a style="color: #D4D0D0;"  href="#">'+arr[i].notetitle+'</a></p>'+
								'</div>'
						}

						$('.msgOuter').append(str);
					}
				}
				$('.msgOuter').append('<a href="see-msg.html" class="msgOuter-more-a">查看更多</a>');
				
				
			}
		});
	}
	getList();//通知列表