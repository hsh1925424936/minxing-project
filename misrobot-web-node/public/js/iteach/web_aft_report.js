window.onload = function () {
	'use strict';
	webcommon();
	if (findurl('u')!='') {
		setCookie('gy_un',findurl('u'),7);
	}	
	$('.roleEvaluate').click(function () {
		$(this).attr('href',$(this).attr('href')+'?report='+findurl('report'));
	})
	
	
	var jWrong = {};//错误分析统计
	var jTeach = {};//教学成果对比
	var jTrainTimes = {};//对应训练完成的人数
	var jScore = {};//班级成绩统计
	var jScoreAvage = {};//班级平均分
	var jTime = {};//班级用时统计
	var jTimeAvage = {};//班级平均用时
	var jWrongCount = {};//错误人数统计
	var jWrongRatio = {};//错误率
	var jDetail = {};//错误详情信息
	var jEvaluate= {aName:[],aValue:[]}; //评价信息
	
	var jWrongRatioLow = {};//错误率降低
	var jScoreHighest = {};//最高分
	var jScoreLowest = {};//最低分
	var jTimeHighest = {};//用时最长
	var jTimeLowest = {};//用时最短
	var jNotrain = {};//未训练人员名单
	
	
	Api.R({
		isShade:1,
		json:{
			"1": {
				command:'report/querypostreport',
				accountname: getCookie('gy_un'),
				sessionid: getCookie('gy_t'),
				reportid:findurl('report'),
				loginid: getCookie('gy_u')
			}
		},
		fn:function (base) {
			base = base[1];
			console.log(base);
			if (base.errcode!=0) {
				uselayer(1,base.errdesc);
				return false;
			}
			
			$('.topTxt').html(base.classinfo.classname+base.classinfo.coursename+'课堂报告');
			writeWater($('.teachingNum'),parseInt(base.teachingindex));			
			
			$('.train-tip').eq(1).html('学生对您的评价'+parseFloat(base.evaluationavg?base.evaluationavg:'0')+'分，最高分'+parseFloat(base.evaluationmax?base.evaluationmax:'0')+'。');
			
			$('.itemVal').eq(0).html(base.classinfo.classname);
			$('.itemVal').eq(1).html(base.classinfo.coursename);
			$('.itemVal').eq(2).html(timetodate(datetotime(base.classinfo.coursebegintime))+'-'+timetodate(datetotime(base.classinfo.courseendtime),2));
			$('.itemVal').eq(3).html('共'+base.classinfo.totalstudentcount+'人/'+base.classinfo.absentcount+'人缺勤');
			$('.itemVal').eq(4).html(base.classinfo.absentstuents.join('/'));
			$('.trainSkillBox').html('');
			
			for (var i = 0 ; i < base.classinfo.trainitemname.length; i++) {
				/*var traintype = 0;
				for( var j = 0; j < i; j++ ){
					var trainitemname = $('.skillCon').eq(j).find('span').html();
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
					'<div class="itemCon clearfix">'
						+'<div class="itemName">训练项目'+(i+1)+'</div>'
						+'<div class="itemVal">'+base.classinfo.trainitemname[i]+'</div>'
					+'</div>'														
				$('.skill-list').append(str);
				
				var str = 
					'<div class="skillCon" type="'+base.classinfo.trainitems[i].traintype+'">'
						+'<div class="skillImg"></div>'
						+'<span><p>'+base.classinfo.trainitems[i].trainitemname+'</p>('+traintype+')</span>'
					+'</div>';							
				$('.trainSkillBox').append(str);
			}			
			
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
					if (!jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype]) {
						jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype]=[];
					}
					jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype].push(base.nottrainstudent[i].name);
				}
				console.log(jNotrain);

			})();	

			//错误分析统计
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
					var　rightl = _a - _b;
					if(!rightl) rightl = 0;
					var _json = {
		            		value:_a,
		            		itemStyle:{normal:{label : {show : true,textStyle:{color:'#f19759'},formatter: (rightl.toFixed(2)) + "%"}}}
			            };					
					jTeach[base.teachingresult[i].trainitemname+base.teachingresult[i].traintype].aAfter.push(_json);            
				}	
				console.log(jTeach);
			})();			
			//对应训练完成的人数
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
				console.log(jTrainTimes);
			})();			
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
		            jScoreAvage[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].averagescore);
		            jScoreHighest[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].highestscore);
		            jScoreLowest[base.classscore[i].trainitemname+base.classscore[i].traintype] = parseFloat(base.classscore[i].lowestscore);
					
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
		            jTimeHighest[base.traintime[i].trainitemname+base.traintime[i].traintype] = parseFloat(base.traintime[i].longesttime);
		            jTimeLowest[base.traintime[i].trainitemname+base.traintime[i].traintype] = parseFloat(base.traintime[i].shortesttime);
				
				}
				console.log(jTime);		
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
				            		value: parseFloat(base.errorratio[i].errorcount),
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
				            		value:(parseFloat(base.errorratio[i].errorratio)*100).toFixed(2),
				            		itemStyle:{normal:{color:'#0496ca',label:{show : true,textStyle:{color:'#333'},formatter: "{c}%"}}}
			            	};					
					if (parseFloat(base.errorratio[i].errorratio)>=0.5) {
						_json.itemStyle.normal.color = '#ed7d31';
					}
					jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aName.push(base.errorratio[i].opstep);
					jWrongRatio[base.errorratio[i].trainitemname+base.errorratio[i].traintype].aScore.push(_json);
				}					
				console.log(jWrongCount);	
				console.log({jWrongRatio:jWrongRatio});							
			})();						
			//错误详情信息
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
			
			//教师评价jEvaluate
			(function () {						
				for (var i = 0 ; i < base.myevaluation.length; i++) {
					jEvaluate.aName.push({text:base.myevaluation[i].evaluationitem,max:base.myevaluation[i].fullscore});
					jEvaluate.aValue.push(parseFloat(base.myevaluation[i].score));
				}		
				console.log(jEvaluate);	
				if ($('.jEvaluate')[0]) {
					writeradar({
						obj:$('.jEvaluate')[0],
						name:jEvaluate.aName,
						value:jEvaluate.aValue,
						bg:'#fff',
						line:'#589ad6',
						type:'solid',
						color:'rgba(88,154,214,0.2)'
					});					
				}				
			})();			
			
			
			
			//技能切换点击事件
			$('.skillCon').click(function () {
				$('.skillCon').removeClass('skillImgOn');
				$(this).addClass('skillImgOn');
				allwrite($(this).find('p').html()+$(this).attr('type'));
			});			
			$('.skillCon').eq(0).click();		

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

			//点击之后数据重新刷新						
			function allwrite(skill) {
				//alert(jNotrain[skill].length);

				var avageTime;
				var shortestTime;
				var longestTime;

				avageTime = secondToMinute(jTimeAvage[skill]);
				shortestTime = secondToMinute(jTimeLowest[skill]);
				longestTime = secondToMinute(jTimeHighest[skill]);

				if ($('.train-tip')[0]) {
					var finishedRate = (base.classinfo.totalstudentcount-jNotrain[skill].length)/base.classinfo.totalstudentcount*100;
					finishedRate = finishedRate.toFixed(2);
					var str = '因为您的辛勤教导，'
							+(jWrongRatioLow[skill]&&jWrongRatioLow[skill]>0?'本班级的错误率降低了'+(jWrongRatioLow[skill]*100).toFixed(2)+'%；':'')
							+(jNotrain[skill]?'其中'+finishedRate+'%完成课堂技能训练；':'')
							+'平均得分'+((jScoreAvage[skill] || jScoreAvage[skill] == '0') ? jScoreAvage[skill]:'暂无')+'，最高分'+((jScoreHighest[skill] || jScoreHighest[skill] == 0)?jScoreHighest[skill]:'暂无')+'，最低分'+((jScoreLowest[skill]||jScoreLowest[skill] ==0)?jScoreLowest[skill]:'暂无')+'；'
							+'平均用时'+avageTime+'，最短'+shortestTime+'，最长'+longestTime+'；';
					
					$('.train-tip').eq(0).html(str);
				}
				
				if ($('.wrong')[0]&&jWrong[skill]) {
					$('.wrong').html('<div class="detail clearfix"></div><div class="detail clearfix"></div><div class="detail clearfix"></div>');
					var json = jWrong[skill];
					var num = 0;
					for (var name in json) {
						$('.detail').eq(num).html('<div style="font-weight:bold;">'+name+'</div>');
						if (json[name].length==0) {
							$('.detail').eq(num).append('<div>无</div>');
						} else {
							for (var i = 0 ; i < json[name].length; i++) {
								$('.detail').eq(num).append('<div>'+(i+1)+'.'+json[name][i]+'</div>');
							}										
						}									
						num++;
					}								
				} else {
					$('.wrong').html('<p class="no-data">暂无典型错误</p>');
				}
				if (jTeach[skill]&&$('.achievements')[0]) {
					writeTeach($('.achievements')[0],jTeach[skill].aName,jTeach[skill].aBefore,jTeach[skill].aAfter,'%',{is_phone:'1'});							
				} else {
					$('.achievements').html('<p class="no-data">教学成果对比</p>');
				}				
				if ($('.completed-time')[0]) {
					$('.completed-time')[0].show = false;
				}			
				if ($('.class-result')[0]) {
					$('.class-result')[0].show = false;
				}		
				if ($('.class-time')[0]) {
					$('.class-time')[0].show = false;
				}		
				if ($('.error-person')[0]) {
					$('.error-person')[0].show = false;
				}		
				if ($('.error-rate')[0]) {
					$('.error-rate')[0].show = false;
				}
				
				if ($('.wrong-detail')[0]) {
					if (jDetail[skill]&&jDetail[skill].length!=0) {
						$('.wrong-detail').html('');
						var arr = jDetail[skill];
						for (var i = 0 ; i < arr.length; i++) {
							var str = 						
								'<div class="wrongItem clearfix '+(i<3?'wrongItemRed':'')+'">'
									+'<div class="wrongName">'+arr[i].errordetail+'</div>'
									+'<div class="wrongPeople">'+arr[i].errorcount+'</div>'
								+'</div>';						
							$('.wrong-detail').append(str);
						}
					} else {
						$('.wrong-detail').html('<p class="no-data">暂无操作错误详情</p>');
					}					
				}

				//错误率平均降低
				$('.jWrongRatioAvg').html(jWrongRatioLow[skill]&&jWrongRatioLow[skill]>0?'错误率平均降低'+(jWrongRatioLow[skill]*100).toFixed(2)+'%':'');

			};			
			
			
			
			
			
			$(window).scroll(function() {
				var _t = $(document).scrollTop()+$(window).height();
				var skill = $('.skillCon.skillImgOn span p').html()+$('.skillCon.skillImgOn').attr('type');
				//完成次数图表
				if ($('.completed-time')[0]) {
					if ($('.completed-time').offset().top-_t<0&&!$('.completed-time')[0].show) {
						$('.completed-time')[0].show = true;
						console.log(jTrainTimes);
						if (jTrainTimes[skill]) {
							if(jTrainTimes[skill].aTimes.length == 1){
								jTrainTimes[skill].aTimes.push(' ');
								jTrainTimes[skill].aTimes.push(' ');
								jTrainTimes[skill].aCount.push('');
								jTrainTimes[skill].aCount.push('');
							}else if( jTrainTimes[skill].aTimes.length == 2 ){
								jTrainTimes[skill].aTimes.push(' ');
								jTrainTimes[skill].aCount.push('');
							}
							writeTraintime($('.completed-time')[0],jTrainTimes[skill].aTimes,jTrainTimes[skill].aCount,{is_phone:'1'});														
						} else {
							$('.completed-time').html('<p class="no-data">暂无该项信息</p>');
						}	
					}					
				}
				//班级成绩统计图表
				if ($('.class-result')[0]) {
	            	if ($('.class-result').offset().top-_t<100&&!$('.class-result')[0].show) {
	        			$('.class-result')[0].show = true;
						if (jScore[skill]) {
							$('.jScoreAvage').html('平均'+jScoreAvage[skill]+'分');
							wirteResultcount($('.class-result')[0],jScore[skill]);								
						} else {
							$('.jScoreAvage').html('');
							$('.class-result').html('<p class="no-data">暂无该项信息</p>');
						}								
	            	}						
				}
				//班级用时统计图表
				if ($('.class-time')[0]) {
	            	if ($('.class-time').offset().top-_t<100&&!$('.class-time')[0].show) {
	        			$('.class-time')[0].show = true;
						if (jTime[skill]) {
							$('.jTimeAvage').html('平均'+jTimeAvage[skill]+'分钟');
							wirteResultcount($('.class-time')[0],jTime[skill]);								
						} else {
							$('.jTimeAvage').html('');
							$('.class-time').html('<p class="no-data">暂无该项信息</p>');
						}								
	            	}						
				}
				//错误率人数统计
				if ($('.error-person')[0]) {
	            	if ($('.error-person').offset().top-_t<100&&!$('.error-person')[0].show) {
						$('.error-person')[0].show = true;
						if (jWrongCount[skill]) {
							writeErrorrate($('.error-person')[0],jWrongCount[skill].aName,jWrongCount[skill].aScore,'人',{is_phone:'1'});														
						} else {
							$('.error-person').html('<p class="no-data">暂无该项信息</p>');
						}								
	            	} 					
				}	
				//错误率统计
				if ($('.error-rate')[0]) {
	        if ($('.error-rate').offset().top-_t<100&&!$('.error-rate')[0].show) {
						$('.error-rate')[0].show = true;
						if (jWrongRatio[skill]) {
							writeErrorrate($('.error-rate')[0],jWrongRatio[skill].aName,jWrongRatio[skill].aScore,'%',{is_phone:'1'});														
						} else {
							$('.error-rate').html('<p class="no-data">暂无该项信息</p>');
						}								
	        } 					
				}	
			});			
		}
	});
};