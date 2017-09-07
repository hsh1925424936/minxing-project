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

function setData() {

	var jTrainTimes = {};//训练完成人数
	var jNotrain = {};//未训练人员名单
	var jWrongCount = {};//错误人数
	var jWrongRatio = {};//错误率
	var jScore = {};//班级成绩统计
	var jScoreAvage = {};//班级平均分
	var jRank = {};//学生排行

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
			$('.report-title').html((base.classinfo.classname?base.classinfo.classname:'')+(base.classinfo.coursename?base.classinfo.coursename:'')+'&nbsp;课堂报告');
			
			$('.courseName').html(base.classinfo.coursename);//课程名称
			$('.class-name').html(base.classinfo.classname);//班级名称
			$('.attendance').html('共'+base.classinfo.totalstuentcount+'人/'+base.classinfo.absentcount+'人缺勤');//出勤情况  缺勤人数:absentcount 总学生数:totalstuentcount
			$('.absence').html(base.classinfo.absentstuents.join('/'));//缺勤学生  缺勤学生数组:absentstuents
			//上课时间格式转换
			$('.report-time').html(timetodate(datetotime(base.classinfo.coursebegintime),6)+'-'+timetodate(datetotime(base.classinfo.courseendtime),2));

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
				            		value:parseFloat(base.errorratio[i].errorratio)*100,
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


			//分值统计
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
				}							
				console.log(jScore);		
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
				console.log(jTrainTimes);
			})();

			//学生排行
			(function () {
				for (var i = 0 ; i < base.studentrank.length; i++) {
					if (!jRank[base.studentrank[i].trainitemname+base.studentrank[i].traintype]) {
						jRank[base.studentrank[i].trainitemname+base.studentrank[i].traintype]=[];
					}
					jRank[base.studentrank[i].trainitemname+base.studentrank[i].traintype].push(base.studentrank[i]);
				}
				/*for (var name in jRank) {
					jRank[name].sort(function (a,b) {
						return b.rank-a.rank;
					});
				}*/
				console.log(jRank);								
			})();


			//未训练名单
			(function () {
				for (var i = 0 ; i < base.nottrainstudent.length; i++) {
					if (!jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype]) {//判断json里是否有这个key
						jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype] = [];//没有就默认设置空数组
					}
					jNotrain[base.nottrainstudent[i].trainitemname+base.nottrainstudent[i].traintype].push(base.nottrainstudent[i].name);//往数组里push值
				}
				console.log(jNotrain);
			})();
			
			var activeNum = 0;
			for (var i = $('.skill-list li').length - 1; i >= 0; i--) {
					if($('.skill-list li').eq(i)[0] == $('.active')[0]){
						activeNum = i;
					} 
			}

			//生成训练项目列表
			$('.skill-list').html('');
			for (var i = 0 ; i < base.classinfo.trainitems.length; i++) {
				/*var traintype = 0;
				for( var j = 0; j < i; j++ ){
					var trainitemname = $('.skill-list li').eq(j).find('span').eq(1).html();
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
				'<li class="clearfix" type="'+base.classinfo.trainitems[i].traintype+'"><span class="cu">'+traintype+'：</span><span>'+base.classinfo.trainitems[i].trainitemname+'</span></li>';
				$('.skill-list').append(str);
			}
			//注册项目点击事件
			$('.skill-list li').click(function () {
				$('.skill-list li').removeClass('active');
				$(this).addClass('active');
				allwrite($(this).find('span').eq(1).html()+$(this).attr('type'));//点击项目之后的方法
			});
			
			$('.skill-list li').eq(activeNum).click();//默认第一个项目点中

			/*
			
			*/

			function allwrite(skill) {
				console.log(skill);
				
				//$('.train-time')[0].show = false; //重置画图元素的变量

				//绘制完成情况统计图表
				if (jNotrain[skill]&&$('.completed-status')[0]) {
					var jComplete = [
		                {
		                	value:base.classinfo.totalstudentcount-jNotrain[skill].length, 
		                	name:'已完成',
		                	itemStyle : {normal : {color:'#49c1c0'}}
		                },
		                {	
		                	value:jNotrain[skill].length, 
		                	name:'未完成',
		                	itemStyle : {normal : {color:'#dce003'}}
				        }
		            ];								
					wirteResultcount($('.completed-status')[0],jComplete);						
				} else {
					$('.completed-status').html('<p class="no-data">暂无该项信息</p>');
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

				//填写未训练人员
				if (jNotrain[skill]) {
					console.log(jNotrain[skill]);
					$('.jNotrain').html(jNotrain[skill].join('/'));
				}

				//错误率人数统计
				if ($('.error-person')[0]&&jWrongCount[skill]) {
					writeTraintime($('.error-person')[0],jWrongCount[skill].aName,jWrongCount[skill].aScore,'人');														
				} else {
					$('.error-person').html('<p class="no-data">暂无该项信息</p>');
				}

				//完成情况统计

				//分值统计
				if ($('.class-result')[0]&&jScore[skill]) {
					$('.jScoreAvage').html('平均'+jScoreAvage[skill]+'分');
					wirteResultcount($('.class-result')[0],jScore[skill]);								
				} else {
					$('.jScoreAvage').html('');
					$('.class-result').html('<p class="no-data">暂无该项信息</p>');
				}

				//学生排名
				//先清除一遍之前的数据
				for( var i = 0; i < 6; i++ ){
					$('.tr').eq(i).find('.td').eq(1).html('');
					$('.tr').eq(i).find('.td').eq(2).html('');
				}

				if( jRank[skill] ){

					if( jRank[skill].length > 0 ){
						if( jRank[skill].length < 6 ){
							for( var i = 0; i < jRank[skill].length; i++ ){
								if( !jRank[skill][i].name ){
									$('.stuTd').eq(i).html('');
								}else{
									$('.stuTd').eq(i).html(jRank[skill][i].name);
								}
								if( !jRank[skill][i].score ){
									$('.stuScore').eq(i).html('');
								}else{
									var score = parseFloat(jRank[skill][i].score).toFixed(1);
									$('.stuScore').eq(i).html(score);
								}
								
							}
						}else{
							for( var i = 0; i < 6; i++ ){
								if( !jRank[skill][i].name ){
									$('.stuTd').eq(i).html('');
								}else{
									$('.stuTd').eq(i).html(jRank[skill][i].name);
								}
								if( !jRank[skill][i].score ){
									$('.stuScore').eq(i).html('');
								}else{
									var score = parseFloat(jRank[skill][i].score).toFixed(1);
									$('.stuScore').eq(i).html(score);
								}
								
							}
						}
					}else{
						$('table').html('<p class="no-data">暂无该项信息</p>');
					}

				};
			
			}
			
		}
		
	});

	
}
