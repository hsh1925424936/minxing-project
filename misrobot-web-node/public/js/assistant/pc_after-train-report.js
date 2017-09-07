window.onload = function () {
	'use strict';
	
	if (findurl('u')=='') { //判断url上面有没有川用户名
		uselayer(1,'用户名不能为空');
	} else {
		setCookie('gy_un',findurl('u'),7); //把用户名写进cookie
	}

	setData();

	setInterval(function(){
			setData();
	}, 1000*60);
}

function setData(){
	
	var jTeach = {};//教学成果对比
	var jTrainTimes = {};//训练完成人数
	var jScore = {};//班级成绩统计
	var jTime = {};//班级用时统计
	var jWrong = {};//典型错误
	var jWrongCount = {};//错误人数
	var jWrongRatio = {};//错误率
	var jDetail = {};//错误操作详情
	var jScoreAvage = {};//班级平均成绩
	var jScorelowerst = {};//班级最低成绩
	var jScorehighest = {};//班级最高成绩
	var jTimeAvage = {};//班级平均用时
	var jTimeLongest = {};//班级最长用时
	var jTimeShortest = {};//班级最短用时

	var jWrongRatioLow = {};//错误率降低
	var jScoreHighest = {};//最高分
	var jScoreLowest = {};//最低分
	var jTimeHighest = {};//用时最长
	var jTimeLowest = {};//用时最短
	var jNotrain = {};//未训练人员名单

	var json = {
		'1':{
			command:'report/querypostreport', //接口地址-查询课后报告
			accountname:getCookie('gy_un'),  //用户名
			reportid:findurl('report')    //报告id
		}
	};
	
	Api.dataToJava({
		istoken:1, //是否验证token
		isShade:1, //是否显示加载圆圈
		json:{
			url:2, //一次性走几个接口
			data:JSON.stringify(json)
			},
		fn:function (base) {
			base = base[1]; //取接口的第一个返回值
			console.log(base);
			//判断接口是否走成功， errcode为0是成功
			if (base.errcode!=0) {
				uselayer(3,base.errdesc);
				return false;
			}
			//报告标题拼接， 班级+课程名+课前/课后报告
			$('.report-title').html(base.classinfo.classname+base.classinfo.coursename+'&nbsp;课后报告');
			if( !base.classinfo.classname || !base.classinfo.coursename ){
				$('.report-title').html('课后报告');
			}
			
			$('.train-tip').eq(1).html('学生对您的评价'+parseFloat(base.evaluationavg?base.evaluationavg:'0')+'分，最高分'+parseFloat(base.evaluationmax?base.evaluationmax:'0')+'。');

			$('.courseName').html(base.classinfo.coursename);//课程名称
			$('.class-name').html(base.classinfo.classname);//班级名称
			$('.attendance').html('共'+(base.classinfo.totalstudentcount?base.classinfo.totalstudentcount:'0')+'人/'+(base.classinfo.absentcount?base.classinfo.absentcount:'0')+'人缺勤');//出勤情况  缺勤人数:absentcount 总学生数:totalstuentcount

			$('.absence').html(base.classinfo.absentstuents.join('/'));//缺勤学生  缺勤学生数组:absentstuents
			//上课时间格式转换
			$('.report-time').html(timetodate(datetotime(base.classinfo.coursebegintime),6)+'-'+timetodate(datetotime(base.classinfo.courseendtime),2));

			//教学成果对比
			(function () {
				for (var i = 0 ; i < base.teachingresult.length; i++) {					
					
					if (!jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype]) {
						jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype]={
							aName:[],
							aBefore:[],
							aAfter:[]
						};
					}
		            jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype].aName.push(base.teachingresult[i].opstep);
					var _b = (parseFloat(base.teachingresult[i].preerrorratio)*100).toFixed(2);
					var _a = (parseFloat(base.teachingresult[i].posterrorratio)*100).toFixed(2);
					var _json = {
		            		value:_b,
		            		itemStyle:{normal:{label:{show:false,textStyle:{color:'#333'},formatter: "{c}%"}}}
			            };					
					jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype].aBefore.push(_json);
					var　rightl = _a-_b;
					if(!rightl) rightl = 0;
					var _json = {
		            		value:_a,
		            		itemStyle:{normal:{label : {show : true,textStyle:{color:'#f19759'},formatter: (rightl.toFixed(2))+"%"}}}
			            };
					jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype].aAfter.push(_json);            
				}							
				console.log(jTeach);							
			})();

			//对应训练完成的人数数据组装
			(function () {
				for (var i = 0 ; i < base.finishinfo.length; i++) {
					if (!jTrainTimes[base.finishinfo[i].trainitemname+base.finishinfo[i].traintype]) {
						jTrainTimes[base.finishinfo[i].trainitemname+base.finishinfo[i].traintype]={
							aTimes:[],
							aCount:[]
						};
					}
					jTrainTimes[base.finishinfo[i].trainitemname+base.finishinfo[i].traintype].aTimes.push(base.finishinfo[i].finishtime+'次');
					jTrainTimes[base.finishinfo[i].trainitemname+base.finishinfo[i].traintype].aCount.push(base.finishinfo[i].count);									
				}
				console.log({jTrainTimes:jTrainTimes});
			})();

			/*班级成绩统计
			(function () {
				for (var i = 0 ; i < base.classscore.length; i++) {
					jScore[base.classscore[i].trainitemname] = [
		                {
		                	value:base.classscore[i].beyond80, 
		                	name:'80以上',
		                	itemStyle : {normal : {color:'#49c1c0'}}
		                },
		                {
		                	value:base.classscore[i].between6080, 
		                	name:'60~80',
		                	itemStyle : {normal : {color:'#64b500'}}
		                },
		                {	
		                	value:base.classscore[i].below60, 
		                	name:'60以下',
		                	itemStyle : {normal : {color:'#dce003'}}
				        }
		            ];	
		            jScoreAvage[base.classscore[i].trainitemname] = parseFloat(base.classscore[i].averagescore);
		            jScorelowerst[base.classscore[i].trainitemname] = parseFloat(base.classscore[i].lowestscore);
		            jScorehighest[base.classscore[i].trainitemname] = parseFloat(base.classscore[i].highestscore);

				}							
				console.log(jScore);		
			})();*/

			//班级成绩统计	
			(function () {
				for (var i = 0 ; i < base.classscore.length; i++) {
					jScore[base.classscore[i].trainitemname+base.classscore[i].traintype] = [
		                {
		                	value:base.classscore[i].beyond80, 
		                	name:'80以上',
		                	itemStyle : {normal : {color:'#49c1c0'}}
		                },
		                {
		                	value:base.classscore[i].between6080, 
		                	name:'60~80',
		                	itemStyle : {normal : {color:'#64b500'}}
		                },
		                {	
		                	value:base.classscore[i].below60, 
		                	name:'60以下',
		                	itemStyle : {normal : {color:'#dce003'}}
				        }
		            ];	
		            jScoreAvage[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].averagescore).toFixed(2);
		            jScoreHighest[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].highestscore).toFixed(2);
		            jScoreLowest[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].lowestscore).toFixed(2);
					
				}
				console.log(jScore);		
			})();

			//班级用时统计
			(function () {
				for (var i = 0 ; i < base.traintime.length; i++) {
					jTime[base.traintime[i].trainitemname+base.traintime[i].traintype] = [
		                {
		                	value:base.traintime[i].belowhalf, 
		                	name:'平均时间以内',
		                	itemStyle : {normal : {color:'#49c1c0'}}
		                },
		                {
		                	value:base.traintime[i].beyondhalf, 
		                	name:'平均时间以上',
		                	itemStyle : {normal : {color:'#64b500'}}
		                },
		                {	
		                	value:base.traintime[i].overtimecount, 
		                	name:'超时',
		                	itemStyle : {normal : {color:'#dce003'}}
				        }
		            ];	
		            jTimeAvage[base.traintime[i].trainitemname+base.traintime[i].traintype] = parseFloat(base.traintime[i].averagetime);
		            jTimeLongest[base.traintime[i].trainitemname+base.traintime[i].traintype] = parseFloat(base.traintime[i].longesttime);
		            jTimeShortest[base.traintime[i].trainitemname+base.traintime[i].traintype] = parseFloat(base.traintime[i].shortesttime);
				}
				console.log(jTime);
				console.log({jTimeAvage:jTimeAvage});
				console.log({jTimeLongest:jTimeLongest});
				console.log({jTimeShortest:jTimeShortest});
			})();

			//典型错误
			(function () {
				for (var i = 0 ; i < base.typicalerror.length; i++) {
					if (!jWrong[base.typicalerror[i].trainitemname+base.typicalerror[i].traintype]) {
						jWrong[base.typicalerror[i].trainitemname+base.typicalerror[i].traintype]={
							'严重错误':[],
							'一般错误':[]
						};
					}								
		            if( base.typicalerror[i].errortype == '严重错误' || base.typicalerror[i].errortype == '一般错误' ){
						jWrong[base.typicalerror[i].trainitemname+base.typicalerror[i].traintype][base.typicalerror[i].errortype].push(base.typicalerror[i].errordetail);
					}
				}							
				console.log(jWrong);							
			})();

			//错误人数，错误率
			(function () {
				for (var i = 0 ; i < base.errorratio.length; i++) {
					//错误人数
					if (!jWrongCount[base.errorratio[i].trainitemname+base.errorratio[i].traintype]) {
						jWrongCount[base.errorratio[i].trainitemname+base.errorratio[i].traintype]={
							aName:[],
							aScore:[]
						};
					}	
					var _json = {
				            		value:parseFloat(base.errorratio[i].errorcount),
				            		itemStyle:{normal:{color:'#0496ca',label:{show : true,textStyle:{color:'#333'},formatter: "{c}人"}}}
			            	};					
					if (parseFloat(base.errorratio[i].errorcount)>=10) {
						_json.itemStyle.normal.color = '#ed7d31';
					}
					jWrongCount[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aName.push(base.errorratio[i].opstep);
					jWrongCount[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aScore.push(_json);						
					//错误率
					if (!jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype]) {
						jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype]={
							aName:[],
							aScore:[]
						};
					}	
					var _json = {
				            		value: (parseFloat(base.errorratio[i].errorratio)*100).toFixed(2),
				            		itemStyle:{normal:{color:'#0496ca',label:{show : true,textStyle:{color:'#333'},formatter: "{c}%"}}}
			            	};					
					if (parseFloat(base.errorratio[i].errorratio)>=0.5) {
						_json.itemStyle.normal.color = '#ed7d31';
					}
					jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aName.push(base.errorratio[i].opstep);
					jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aScore.push(_json);	
				}					
				console.log(jWrongCount);	
				console.log(jWrongRatio);							
			})();

			//错误操作详情
			(function () {
				base.errordetails.sort(function (a,b) {
					return b.errorcount-a.errorcount; 
				});								
				for (var i = 0 ; i < base.errordetails.length; i++) {
					if (!jDetail[base.errordetails[i].trainitemname+base.errordetails[i].traintype]) {
						jDetail[base.errordetails[i].trainitemname+base.errordetails[i].traintype]=[];
					}								
					jDetail[base.errordetails[i].trainitemname+base.errordetails[i].traintype].push(base.errordetails[i]);
				}		
				console.log(jDetail);							
			})();


			//错误率降低
			(function () {
				for (var i = 0 ; i < base.teachingsummary.length; i++) {						
		           jWrongRatioLow[base.teachingsummary[i].trainitemname+base.teachingsummary[i].traintype]=base.teachingsummary[i].errorratioreduce;
				}
				console.log({jWrongRatioLow:jWrongRatioLow});
			})();

			//未训练人员名单
			(function () {
				for (var i = 0 ; i < base.nottrainstudent.length; i++) {
					/*if (!base.nottrainstudent[i].trainitemname) {
						base.nottrainstudent[i].trainitemname = '胸腔穿刺术';
					}*/
					if (!jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype]) {
						jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype]=[];
					}
					jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype].push(base.nottrainstudent[i].name);
				}
				console.log(jNotrain);

			})();

			
			//生成训练项目列表
			/*$('.skill-list').html('');
			for (var i = 0 ; i < base.classinfo.trainitemname.length; i++) {
				var str = 
				'<li class="clearfix"><span class="cu">训练项目'+(i+1)+'：</span><span>'+base.classinfo.trainitemname[i]+'</span></li>';
				$('.skill-list').append(str);
			}
			//注册项目点击事件
			$('.skill-list li').click(function () {
				$('.skill-list li').removeClass('active');
				$(this).addClass('active');
				allwrite($(this).find('span').eq(1).html());//点击项目之后的方法
			});
			$('.skill-list li').eq(0).click();//默认第一个项目点中*/
			
			var activeNum = 0;
			for (var i = $('.skillBox .skillImgOuter').length - 1; i >= 0; i--) {
					if($('.skillBox .skillImgOuter').eq(i)[0] == $('.active')[0]){
						activeNum = i;
					} 
			}
			//训练技能内容图标
			$('.skillOuter').html('');
			for (var i = 0 ; i < base.classinfo.trainitemname.length; i++) {
				
				/*var traintype = 0;
				for( var j = 0; j < i; j++ ){
					var trainitemname = $('.skillBox').eq(j).find('span').html();
					if( trainitemname == base.classinfo.trainitemname[i] ){
						traintype++;
					}
				}*/

				var traintype;
				if( base.classinfo.trainitems[i].traintype == 0 ){
					traintype = '在线训练';
				}else if( base.classinfo.trainitems[i].traintype == 1 ){
					traintype = '模型训练';
				}else if( base.classinfo.trainitems[i].traintype == 2 ){
					traintype = '智能训练';
				}

				var str = 
					'<div class="skillBox" type="'+base.classinfo.trainitems[i].traintype+'">'+
						'<div class="skillImgOuter">'+
							'<div class="skillIcon"></div>'+
						'</div>'+
						'<span><p class="trainitemname">'+base.classinfo.trainitems[i].trainitemname+'</p>('+traintype+')</span>'+
					'</div>';
				$('.skillOuter').append(str);
			}	

			//注册项目点击事件
			$('.skillBox').click(function () {
				$('.skillImgOuter').removeClass('active');
				$(this).find('.skillImgOuter').addClass('active');
				allwrite($(this).find('.trainitemname').html()+$(this).attr('type'));//点击项目之后的方法
			});

			$('.skillBox').eq(activeNum).click();//默认第一个项目点中
			

			/*function timeconvert(_num){
		        var res=new Array();
		        if(typeof (_num) == "number"){
		            if( parseInt( _num/3600 ) > 0){
		                res['hour']=parseInt(_num/3600);
		                res['minute']=parseInt(_num/60)-60;
		                res['second']=parseInt(_num%60);
		            }else if( parseInt(_num/60) > 0 ){
		                res['hour']=0;
		                res['minute']=parseInt(_num/60);
		                res['second']=parseInt(_num%60);
		            }else{
		                res['hour']=0;
		                res['minute']=0;
		                res['second']=parseInt(_num%60);
		            }
		        }else{
		            res['hour']=0;
		            res['minute']=0;
		            res['second']=0;
		        }
		        //console.log(res);
		        return res;
		    }

		    function secondToMinute(second){//把秒转换成分钟和秒的字面描述
		    	if(typeof(second) == "undefined"){
					var minuteAndSecond = '暂无';
				}else{
					var toTime = timeconvert(second);
					var minuteAndSecond = toTime['minute']+'分'+toTime['second']+'秒';
				}
				return minuteAndSecond;
		    }*/

		    function secondToMinute(second){//处理时间，把秒转换成分，秒
				var minuteAndSecond;
				if( typeof(second) == "undefined" ){
					minuteAndSecond = '暂无';
				}else{
					var minute = Math.ceil(second/60)-1; var second = (second%60).toFixed(1);
					minuteAndSecond =  minute+'分'+second+'秒';
				}
				return minuteAndSecond;
			}

			function allwrite(skill) {
				console.log(skill);

				//alert(jNotrain[skill].length);
				var avageTime;
				var shortestTime;
				var longestTime;
				
				avageTime = secondToMinute(jTimeAvage[skill]);
				shortestTime = secondToMinute(jTimeShortest[skill]);
				longestTime = secondToMinute(jTimeLongest[skill]);


				if ($('.train-tip')[0]) {
					var finishedRate = (base.classinfo.totalstudentcount-jNotrain[skill].length)/base.classinfo.totalstudentcount*100;
					finishedRate = finishedRate.toFixed(2);
					var str = '因为您的辛勤教导，'
							+(jWrongRatioLow[skill]&&jWrongRatioLow[skill]>0?'本班级的错误率降低了'+(jWrongRatioLow[skill]*100).toFixed(2)+'%；':'')
							+(jNotrain[skill]? finishedRate+'%完成课堂技能训练；':'')
							+'平均得分'+(jScoreAvage[skill]?jScoreAvage[skill]:'暂无')+'，最高分'+(jScoreHighest[skill]?jScoreHighest[skill]:'暂无')+'，最低分'+(jScoreLowest[skill]?jScoreLowest[skill]:'暂无')+'；'
							+'平均用时'+avageTime+'，最短'+shortestTime+'，最长'+longestTime+'；';
					
					$('.train-tip').eq(0).html(str);
				}

				
				//$('.train-time')[0].show = false; //重置画图元素的变量
				
				//绘制教学成果对比图表
				if (jTeach[skill]&&$('.achievements')[0]) {
					writeTeach($('.achievements')[0],jTeach[skill].aName,jTeach[skill].aBefore,jTeach[skill].aAfter,'%',{});							
				} else {
					$('.achievements').html('<p class="no-data">教学成果对比</p>');
				}

				//绘制完成人数图表
				if ($('.completed-time')[0]&&jTrainTimes[skill]) {
					if(jTrainTimes[skill].aTimes.length == 1){
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
					}else if( jTrainTimes[skill].aTimes.length == 2 ){
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
					}else if( jTrainTimes[skill].aTimes.length == 3 ){
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aCount.push('');
						jTrainTimes[skill].aCount.push('');
					}
					else if( jTrainTimes[skill].aTimes.length == 4 ){
						jTrainTimes[skill].aTimes.push(' ');
						jTrainTimes[skill].aCount.push('');
					}
					writeTraintime($('.completed-time')[0],jTrainTimes[skill].aTimes,jTrainTimes[skill].aCount,{});
				} else {
					$('.completed-time').html('<p class="no-data">暂无该项信息</p>');
				}

				//错误率平均降低
				$('.jWrongRatioAvg').html(jWrongRatioLow[skill]&&jWrongRatioLow[skill]>0?'错误率平均降低'+(jWrongRatioLow[skill]*100).toFixed(2)+'%':'');

				//填写未训练人员
				if (jNotrain[skill]) {
					console.log(jNotrain[skill]);
					$('.jNotrain').html(jNotrain[skill].join('/'));
				}

				//班级成绩统计图表
				if ($('.class-result')[0]&&jScore[skill]) {
					$('.jScoreAvage').html('平均'+jScoreAvage[skill]+'分');
					wirteResultcount($('.class-result')[0],jScore[skill]);								
				} else {
					$('.jScoreAvage').html('');
					$('.class-result').html('<p class="no-data">暂无该项信息</p>');
				}

				//班级用时统计图表
				if ($('.class-time')[0]&&jTime[skill]) {
					$('.jTimeAvage').html('平均'+(jTimeAvage[skill]/60).toFixed(1)+'分钟');
					wirteResultcount($('.class-time')[0],jTime[skill]);								
				} else {
					$('.jTimeAvage').html('');
					$('.class-time').html('<p class="no-data">暂无该项信息</p>');
				}

				//错误率人数统计
				if ($('.error-person')[0]&&jWrongCount[skill]) {
					writeErrorrate($('.error-person')[0],jWrongCount[skill].aName,jWrongCount[skill].aScore,'人',{});														
				} else {
					$('.error-person').html('<p class="no-data">暂无该项信息</p>');
				}

				//错误率统计
				if ($('.error-rate')[0]&&jWrongRatio[skill]) {
					writeErrorrate($('.error-rate')[0],jWrongRatio[skill].aName,jWrongRatio[skill].aScore,'%',{});														
				} else {
					$('.error-rate').html('<p class="no-data">暂无该项信息</p>');
				}


				//填写未训练人员
				if (jNotrain[skill]) {
					console.log(jNotrain[skill]);
					$('.jNotrain').html(jNotrain[skill].join('/'));
				}

				$('.table').html(
					'<div class="tr clearfix">'+
						'<div class="td1">'+
							'严重错误'+
						'</div>'+
						'<div class="td2">'+
							'无'+
						'</div>'+
					'</div>'+
					'<div class="tr clearfix">'+
						'<div class="td1">'+
							'一般错误'+
						'</div>'+
						'<div class="td2">'+
							'无'+
						'</div>'+
					'</div>'
				);
				//典型错误填充数据
				if ($('.table')[0]&&jWrong[skill]) {
					$(".td1").html(''); $(".td2").html('');//清空错误表格里的内容
					var json = jWrong[skill];
					var num = 0;
					for (var name in json) {
						$('.td1').eq(num).html(name);
						if (json[name].length==0) {
							$('.td2').eq(num).append('<div>无</div>');
						} else {
							for (var i = 0 ; i < json[name].length; i++) {
								$('.td2').eq(num).append((i+1)+'.'+json[name][i]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
							}										
						}									
						num++;
					}								
				} else {
					$('.table').html('<p class="no-data">暂无典型错误</p>');
				}

				//操作错误详情
				if ($('.wrongDetailCon')[0]&&jDetail[skill]&&jDetail[skill].length!=0) {
					$('.wrongDetailCon').html('');
					var arr = jDetail[skill];
					for (var i = 0 ; i < arr.length; i++) {
						var str = 						
							'<div class="itemP clearfix" id="'+(i<3?'wrongDetailRed':'')+'">'
								+'<h3>'+arr[i].opstepcontent+'</h3>'
								+'<h4>'+arr[i].errordetail+'</h4>'
								+'<span>'+arr[i].errorcount+'</span>'
								+'<h5><p class="wrongDetailBtn '+(i<3?'wrongBtnRed':'wrongBtnNormal')+'" trainitemno="'+arr[i].trainitemno+'" itemno="'+arr[i].itemno+'">详情</p></h5>'
							+'</div>';						
						$('.wrongDetailCon').append(str);
					}
					$('.wrongDetailBtn').click(function() {//点击错误详情按钮
						var reportid = findurl('report');
						var trainitemno = $(this).attr('trainitemno');
						var itemno = $(this).attr('itemno');
						window.location.href = 'train-report-detail.html?trainitemno='+trainitemno+
						'&itemno='+itemno+'&report='+reportid;
					});
				} else {
					$('.wrongDetailCon').html('<p class="no-data" id="no-data">暂无典型错误</p>');
				}

				var notTrainNum = jNotrain[skill].length;
				var wrongRate = notTrainNum/base.classinfo.totalstuentcount;


			};
			
			
			
			
		}
		
	});

	

	
	
};