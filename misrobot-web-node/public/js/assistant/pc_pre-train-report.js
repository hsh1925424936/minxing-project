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
	
	var jScore = {};//班级成绩统计
	var jTimes = {};//对应训练完成的人数
	var jNotrain = {};//未训练人员名单
	var jAvage = {}; //平均分	
	var jWrong = {};//错误情况
	var jRatio = {};//错误率
	var jDetail = {};//错误详情
	
	var json = {
		'1':{
			command:'report/queryprereport', //接口地址
			accountname:getCookie('gy_un'),  //用户名
			reportid:findurl('report')    //报告id
		}
	};
	
	Api.dataToJava({
		istoken:1, //是否验证token
		isShade:1, //是否显示加载圆圈
		json:{
			url:1, //一次性走几个接口
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
			$('.report-title').html(base.classinfo.classname+base.classinfo.coursename+'&nbsp;课前报告');
			if( !base.classinfo.classname || !base.classinfo.coursename ){
				$('.report-title').html('课前报告');
			}
			
			$('.courseName').html(base.classinfo.coursename);//课程名称
			$('.class-name').html(base.classinfo.classname);//班级名称
			$('.depart').html(base.classinfo.majorname);//系别
			$('.college').html(base.classinfo.departmentname);//学院
			$('.studentNum').html(base.classinfo.studentcount+'人');//学生人数
			if( !base.classinfo.studentcount ){
				$('.studentNum').html('0人');//学生人数
			}

			//典型错误数据组装
			(function () {
				for (var i = 0 ; i < base.typicalerror.length; i++) {
					/*if (base.typicalerror[i].trainitemname=='洗胃术') {
						base.typicalerror[i].trainitemname = '胸腔穿刺术';
					}*/
					if (!jWrong[base.typicalerror[i].trainitemname]) {
						jWrong[base.typicalerror[i].trainitemname]={
							'严重错误':[],
							'一般错误':[]
						};
					}								
		            if( base.typicalerror[i].errortype == '严重错误' || base.typicalerror[i].errortype == '一般错误' ){
						jWrong[base.typicalerror[i].trainitemname][base.typicalerror[i].errortype].push(base.typicalerror[i].errordetail);
					}
				}							
				console.log(jWrong);							
			})();

			//错误详情
			(function () {
				base.errordetails.sort(function (a,b) {
					return b.errorcount-a.errorcount; 
				});								
				for (var i = 0 ; i < base.errordetails.length; i++) {
					/*if (base.errordetails[i].trainitemname=='洗胃术') {
						base.errordetails[i].trainitemname = '胸腔穿刺术';
					}*/
					if (!jDetail[base.errordetails[i].trainitemname]) {
						jDetail[base.errordetails[i].trainitemname]=[];
					}								
					jDetail[base.errordetails[i].trainitemname].push(base.errordetails[i]);
				}		
				console.log(jDetail);							
			})();



			//时间格式
			$('.report-time').html(timetodate(datetotime(base.classinfo.coursebegintime),6)+'-'+timetodate(datetotime(base.classinfo.courseendtime),2));
			
			//组装未训练人员名单数据
			(function () {
				for (var i = 0 ; i < base.nottrainstudent.length; i++) {
					if (!jNotrain[base.nottrainstudent[i].trainitemname]) {//判断json里是否有这个key
						jNotrain[base.nottrainstudent[i].trainitemname] = [];//没有就默认设置空数组
					}
					jNotrain[base.nottrainstudent[i].trainitemname].push(base.nottrainstudent[i].name);//往数组里push值
				}
				console.log(jNotrain);
			})();
			
			//训练次数人数
			(function () {
				for (var i = 0; i< base.finishinfo.length; i++ ) {
					if (!jTimes[base.finishinfo[i].trainitemname]) {//判断json里是否有这个key
						jTimes[base.finishinfo[i].trainitemname] = {//没有就默认设置json {aName:[],aCount:[]}
							aTimes:[],
							aCount:[]
						};
					}
					jTimes[base.finishinfo[i].trainitemname].aTimes.push(base.finishinfo[i].finishtime+'次');
					jTimes[base.finishinfo[i].trainitemname].aCount.push(base.finishinfo[i].count);
				}
				
				console.log(jTimes);			
				
			})();
			
			//班级成绩统计
			(function () {
				for (var i = 0 ; i < base.classscore.length; i++) {
					if (!base.classscore[i].trainitemname) {
						base.classscore[i].trainitemname = '胸腔穿刺术';
					}
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
		            
		            jAvage[base.classscore[i].trainitemname] = base.classscore[i].averagescore;
				}
				console.log(jScore);		
			})();

			//错误率
			(function () {
				for (var i = 0 ; i < base.errorratio.length; i++) {
					/*if (base.errorratio[i].trainitemname=='洗胃术') {
						base.errorratio[i].trainitemname = '胸腔穿刺术';
					}*/
					if (!jRatio[base.errorratio[i].trainitemname]) {
						jRatio[base.errorratio[i].trainitemname]={
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
					jRatio[base.errorratio[i].trainitemname].aName.push(base.errorratio[i].opstep);
					jRatio[base.errorratio[i].trainitemname].aScore.push(_json);	
				}								
				console.log(jRatio);							
			})();
			
			
			var activeNum = 0;
			for (var i = $('.skill-list li').length - 1; i >= 0; i--) {
					if($('.skill-list li').eq(i)[0] == $('.active')[0]){
						activeNum = i;
					} 
			}

			//生成训练项目列表
			$('.skill-list').html('');
			for (var i = 0 ; i < base.classinfo.trainitemname.length; i++) {
				var str = 
				'<li class="clearfix"><span class="cu">在线项目：</span><span>'+base.classinfo.trainitemname[i]+'</span></li>';
				$('.skill-list').append(str);
			}
			//注册项目点击事件
			$('.skill-list li').click(function () {
				$('.skill-list li').removeClass('active');
				$(this).addClass('active');
				allwrite($(this).find('span').eq(1).html());//点击项目之后的方法
			});

			$('.skill-list li').eq(activeNum).click();//默认第一个项目点中

			function allwrite(skill) {
//				$('.train-time')[0].show = false; //重置画图元素的变量
				//绘制完成人数图表
				if (jTimes[skill]) {//判断是否有改技能的数据，有就画图，没有就给提示
					if(jTimes[skill].aTimes.length == 1){
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
					}else if( jTimes[skill].aTimes.length == 2 ){
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
					}else if( jTimes[skill].aTimes.length == 3 ){
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aCount.push('');
						jTimes[skill].aCount.push('');
					}
					else if( jTimes[skill].aTimes.length == 4 ){
						jTimes[skill].aTimes.push(' ');
						jTimes[skill].aCount.push('');
					}
					writeTraintime($('.train-time')[0],jTimes[skill].aTimes,jTimes[skill].aCount,{});
				} else {
					$('.train-time').html('<p class="no-data">暂无相关数据</p>');
				}

				//绘制班级成绩统计图表
				if (jScore[skill]) {
					wirteResultcount($('.result-count')[0],jScore[skill]);								
				} else {
					$('.result-count').html('<p class="no-data">暂无该项信息</p>');
				}

				//绘制错误率图表
				if (jRatio[skill]) {
					writeErrorrate($('.error-rate')[0],jRatio[skill].aName,jRatio[skill].aScore,'%',{});														
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
				//填写典型错误
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
				
				//填写错误详情
				if ($('.wrongDetailCon')[0]&&jDetail[skill]&&jDetail[skill].length!=0) {
					$('.wrongDetailCon').html('');
					var arr = jDetail[skill];
					for (var i = 0 ; i < arr.length; i++) {
						var str = 						
							'<div class="itemP clearfix" id="'+(i<3?'wrongDetailRed':'')+'">'
								+'<h3>'+arr[i].opstepcontent+'</h3>'
								+'<h4>'+arr[i].errordetail+'</h4>'
								+'<span>'+arr[i].errorcount+'</span>'
							+'</div>';						
						$('.wrongDetailCon').append(str);
					}
				} else {
					$('.wrongDetailCon').html('<p class="no-data">暂无典型错误</p>');
				}

				
			};
			
			
			
			/*$(window).scroll(toscroll);//注册浏览器滚动事件
			toscroll(); 默认执行一次该事件
			function toscroll() {
				var _t = $(document).scrollTop()+$(window).height(); //页面已经被滚动的高度
				var skill = $('.skill-list li.active').find('span').eq(1).html(); //当前选中的技能名称
				
//				if ($('.train-time').offset().top-_t<0&&!$('.train-time')[0].show) { //判断元素高度是否已在可视区域内，并且默认变量是否为假
//					$('.train-time')[0].show = true;  //为真说明没有执行过下面的方法，立即执行并且把变量变为true防止再次执行， 该变量的重置在技能的点击事件里面
//					if (jTimes[skill]) { //判断是否有该技能的数据
//						writeTraintime($('.train-time')[0],jTimes[skill].aName,jTimes[skill].aCount);						
//					} else {
//						$('.train-time').html('<p class="no-data">暂无相关数据</p>')
//					}
//					
//				}				
				
			}*/
			
			
			
		}
		
	});
	
	
	
	
//	var arr = [
//		{
//			name:'张三',
//			train:"腹腔穿刺术"
//		},
//		{
//			name:'李四',
//			train:"胸腔"
//		},
//		{
//			name:'王五',
//			train:"胸腔"
//		},
//		{
//			name:'赵六',
//			train:"腹腔穿刺术"
//		},
//		{
//			name:'范七',
//			train:"胸腔"
//		},
//		{
//			name:'兰八',
//			train:"腹腔穿刺术"
//		},
//		{
//			name:'邹九',
//			train:"胸腔"
//		},
//		{
//			name:'唐十',
//			train:"腹腔穿刺术"
//		},
//	];
//		
//	var json = {};
	
//	{
//		'胸腔':[],
//		'腹腔穿刺术':[]
//	}
		
//	for (var i = 0 ; i < arr.length; i++) {
//		
//		if (!json[arr[i].train]) {
//			json[arr[i].train] =[];
//		} 
//		
//		json[arr[i].train].push(arr[i].name);
//		
//		
//		
//	}
//	
//	console.log(json);
	
	
	
	
	
	
	
	
	
	
	
	
	
}
