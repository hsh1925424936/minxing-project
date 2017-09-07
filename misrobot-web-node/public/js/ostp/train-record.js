window.onload = function () {
	'use strict';
	if (findurl('t')) {
		setCookie('gy_t',findurl('t'),60);
		setCookie('gy_u',findurl('u'),7);
		Api.R({
			url: "/usr/querymyinfo",
			isShade:1,
			json:{
				"1": {
					command: "usr/querymyinfo",
					sessionid: getCookie('gy_t'),
					uid: getCookie('gy_u'),
					loginid: getCookie('gy_u')
				}
			},				
			fn:function (base) {
				if (base["1"].errcode!=0) {
					uselayer(3,base["1"].errdesc);
					return false;
				}
				setCookie('gy_a',base["1"].imgurl? base["1"].imgurl:'../../images/ostp/feifei.png',7);
				setCookie('gy_n',base["1"].name,7);
				setCookie('gy_un',base["1"].username,7);
				// setCookie('gy_g',strtocode((base["1"].grade? base["1"].grade:16)+'级'));
				
				$('.userName').html(codetostr(getCookie('gy_n')));
				$('.headImg').attr('src',getCookie('gy_a'));
				// $('.gradeYear,.year').html(codetostr(getCookie('gy_g')));
			}
		});	

	}
	common();

	$('.table-con').css('height',$(window).height()-354+'px');
	
	var _g = parseInt(getCookie('gy_g'));
	_g = 2013;
	var oBegin = new Date();
	oBegin.setHours(0,0,0,0);
	oBegin.setFullYear(_g,8,1);
	
	
	
	var oNow = new Date();
	oNow.setHours(0,0,0,0);
	oNow.setDate(1);
	oNow.setMonth(oNow.getMonth()+1);
	console.log(oNow.getMonth());
	
	while (oBegin.getTime()<=oNow.getTime()) {
		var _end = oNow.getTime()/1000;
		oNow.setMonth(oNow.getMonth()-1);
		var str = 
				'<div class="th2">'
					+'<div class="month-time clearfix" _start="'+oNow.getTime()/1000+'" _end="'+_end+'">'
						+'<div class="td1">'+oNow.getFullYear()+'年'+(oNow.getMonth()+1)+'月</div>'							
					+'</div>'	
					+'<div class="month-list"></div>'	
				+'</div>';				
		$('.table-con').append(str);				
	}
	$('.month-time').eq(0).addClass('active');
	$('.month-list').eq(0).css('display','block');	
	
	$('.month-time').click(function () {
		$('.month-time').removeClass('active');
		$(this).addClass('active');
		
		$('.month-list').css('display','none');
		var $div = $('.month-time.active').parent().find('.month-list');
		$($div).css('display','block');				
		
		
		getdatalist();
	});
	
	Api.R({
		url: "/learn/querylearninfo",
		isShade: 1,
		json: {
			"1": {
				command: "learn/querylearninfo",
				type: 0,
				sessionid: getCookie('gy_t'),
				loginid: getCookie('gy_u'),
				uid: getCookie('gy_u')
			}
		},
		fn:function (data) {
			if(data["1"].errcode != 0){
				uselayer(3, data["1"].errdesc);
				return;
			}
			var arr = data["1"].learnids;
			
			$('.skillList').css('width',120*arr.length+'px');
			$('.skillList').html('');
			for (var i = 0 ; i < arr.length; i++) {
				var str = 
					'<div class="skillItem" _id="'+arr[i].learnid+'">'+arr[i].name+'</div>';		
				$('.skillList').append(str);
			}

			var max = Math.ceil(arr.length/7); 
			if (max>1) {
				$('.turnRight').css('visibility','visible');
				var iNow = 0;
				console.log(max);
				$('.turnRight').click(function () {
					iNow++;
					if (iNow>=(max-1)) {
						$('.turnRight').css('visibility','hidden');
					}
					$('.skillList').stop().animate({'left':-iNow*840+'px'});
					$('.turnLeft').css('visibility','visible');
				});
				$('.turnLeft').click(function () {
					iNow--;
					if (iNow<=0) {
						$('.turnLeft').css('visibility','hidden');
					}
					$('.skillList').stop().animate({'left':-iNow*840+'px'});
					$('.turnRight').css('visibility','visible');
				});		
			}
		
			$('.skillItem').click(function () {
				$('.skillItem').removeClass('skillItemOn');
				$(this).addClass('skillItemOn');
//						changepage($(this).attr('_id'));//原来的
				setCookie('gy_train',$(this).attr('_id'),60);//后改的
				if ($('.table').css('display')=='block') {
					getdatalist();
				} else {
					getlinelist();
				}
			});
			
			if ( findurl('gy_train') && $('.recordTit').attr('isfirst') == '0' ){
				$('.skillItem').each(function () {
					if ($(this).attr('_id') && ($(this).attr('_id').split('_').indexOf(findurl('gy_train')) > -1)) {
						$(this).click();
					}
					$('.recordTit').attr('isfirst','1')
				});
			}else{
				if (getCookie('gy_train') =='') {
					$('.skillItem').eq(0).click();
				} else {
					$('.skillItem').each(function () {
						if ($(this).attr('_id')== getCookie('gy_train')) {
							$(this).click();
							return false;
						}
					});				
				}
			}

			var _num = Math.floor($('.skillItem.skillItemOn').index('.skillItem')/7);
			if (_num>0) {
				for (var i = 0 ; i < _num; i++) {
					$('.turnRight').click();
				}
			}
		}
		
	});				
	
	$('.changeBtn1').click(function() {
		$('.changeBtn1').css('display', 'none');
		$('.changeBtn2').css('display', 'block');
		$('.table').css('display', 'none');
		$('.chartOuter').css('display', 'block');
		
		getlinelist();
		
	});

	$('.changeBtn2').click(function() {
		$('.changeBtn2').css('display', 'none');
		$('.changeBtn1').css('display', 'block');
		$('.table').css('display', 'block');
		$('.chartOuter').css('display', 'none');
		getdatalist();
	});
	
	$('.timeOuterSpan').click(function() {
		$('.timeOuterSpan').removeClass('timeOuterSpanOn');
		$(this).addClass('timeOuterSpanOn');
		getlinelist();
	});	
		
	
	$('.month-time').click(function () {
		if ($(this)[0].bClick) {
			$(this).parent().find('.month-list').css('display','block');
			$(this)[0].bClick = false;
		} else {
			$(this).parent().find('.month-list').css('display','none');
			$(this)[0].bClick = true;
		}
		
	});
	
	
	function getlinelist() {
		Api.R({
			url: "/grade/getscorelist",
			isShade:1,
			json:{
				"1": {
					command:'grade/getscorelist',
					operatoraccount:getCookie('gy_un'),
					learnname:$('.skillItem.skillItemOn').html(),
					begintime:timetodate($('.month-time.active').attr('_start'),1),
					endtime:timetodate($('.month-time.active').attr('_end'),1),
					sessionid: getCookie('gy_t'),
					loginid: getCookie('gy_u'),
					uid: getCookie('gy_u')
				}
			},
			fn:function (base) {
				if(base["1"].errcode != 0){
					uselayer(3, data["1"].errdesc);
					return;
				}
				console.log(base);
				var aZx = [];
				var aZn = [];
				var aMx = [];
				var aName = [];
				var _len = 0;
				
				for (var name in base) {
					var _arr = base[name].queryresult;
					if (_arr.length>_len) {
						_len = _arr.length;
						aName = [];
					}
					for (var i = 0 ; i < _arr.length; i++) {
						aName.push('');
					}
					
					for (var i =  _arr.length-1; i >= 0; i--) {
						var str = _arr[i].scoresheetcode;
						var type = str.substring(str.indexOf('-')+1,str.indexOf('-')+2);
						switch (type){//这个name123是指接口返回的第一个第二个和第三个值，不是类型
							case '0'://在线训练
								aZx.push(parseFloat(_arr[i].totalscore));
								break;
							case '2'://智能设备
								aZn.push(parseFloat(_arr[i].totalscore));
								break;
							case '1'://传统模型
								aMx.push(parseFloat(_arr[i].totalscore));
								break;
						}
					}
				}
				console.log(aZx,aZn,aMx,aName);
		//		var arr1 = ['','','','','','','','','','','',''];
		//		var arr2 = [40,50,60,70,60,50,40,50,60,70,60,50];
		//		var arr3 = [90,80,70,60,50,50,60,70,80,90,80,70];
				if (aName.length==0) {
					$('.chartCon').html('<p class="no-data">该技能暂无训练记录</p>');
				} else {
					$('.chartCon').html('');
					writeline($('.chartCon')[0],aName,aZx,aZn,aMx);					
				}
			},
			error:function (str) {
				console.log(str);
			}
		});						
	};
	
	function getdatalist() {
		Api.R({
			url: "/grade/getscorelist",
			isShade:1,
			json:{
				"1": {
					command:'grade/getscorelist',
					operatoraccount:getCookie('gy_un'),
					learnname:$('.skillItem.skillItemOn').html(),
					begintime:timetodate($('.month-time.active').attr('_start'),1),
					endtime:timetodate($('.month-time.active').attr('_end'),1),
					sessionid: getCookie('gy_t'),
					loginid: getCookie('gy_u'),
					uid: getCookie('gy_u')
				}
			},
			fn:function (base) {
				base = base[1];
				console.log(base);
				if (base.errcode!=0) {
					uselayer(1,base.errdesc);
					return false;
				}
				
					
				$('.th1').html('<div class="td1 tdLeftTop"><p>时间</p><p>在线/模型/智能</p></div>');
				var sum = 0;
				var sum1 = 0; var score1 = 0;
				var sum2 = 0; var score2 = 0;
				var sum3 = 0; var score3 = 0;
				var count = 0;
				var str = '';
				for (var name in base.opstepcontent) {
					count++;
					score1 = base.opstepcontent[name].split('/')[0];
					if(!isNaN(score1)){
						sum1+= parseFloat(score1);
						score1 = parseFloat(score1).toFixed(1);
					}
					score2 = base.opstepcontent[name].split('/')[1];
					if(!isNaN(score2)){
						sum2+= parseFloat(score2);
						score2 = parseFloat(score2).toFixed(1);
					}
					score3 = base.opstepcontent[name].split('/')[2];
					if(!isNaN(score3)){
						sum3+= parseFloat(score3);
						score3 = parseFloat(score3).toFixed(1);
					}
					//sum1+=parseFloat(base.opstepcontent[name].split('/')[0]);
					str+='<div class="td"><p>'+name+'</p><p>'+score1+'/'+score2+'/'+score3+'</p></div>';
				}
				$('.th1,.th2').css('width',(count+1)*140+220+'px');
				
				$('.th1').append(str);
				sum1 = sum1.toFixed(1);
				sum2 = sum2.toFixed(1);
				sum3 = sum3.toFixed(1);
				if(sum1 == 0){
					sum1 = '-';
				}
				if(sum2 == 0){
					sum2 = '-';
				}
				if(sum3 == 0){
					sum3 = '-';
				}
				$('.th1').append('<div class="td"><p>总分</p><p>'+sum1+'/'+sum2+'/'+sum3+'</p></div>');
				
				var arr = base.queryresult;
				var $div = $('.month-time.active').parent().find('.month-list');

				if (arr.length==0) {
					$($div).html('<div class="no-data">暂无该技能的训练记录</div>');
					return false;
				}
				$($div).html('');
				for (var i = 0 ; i < arr.length; i++) {
					var _str = '';
					var _sum = Math.round(isnull(arr[i].totalscore));
					for (var name in base.opstepcontent) {
						if (arr[i].opstepscore[name]) {
							// _sum+=parseFloat(arr[i].opstepscore[name]);
							_str+='<div class="td">'+parseFloat(arr[i].opstepscore[name])+'</div>';
						} else {
							_str+='<div class="td">0</div>';
						}
					}
					_str+='<div class="td">'+_sum+'</div>';
					
					var trainType = arr[i].scoresheetcode.substring(arr[i].scoresheetcode.indexOf('-')+1,arr[i].scoresheetcode.indexOf('-')+2);
					switch (trainType){
						case '2': trainType = '(智能)' ;
							break;
						case '1': trainType = '(模型)' ;
							break;
						default: trainType = '(在线)' ;
							break;
					}

					var str = 
						'<a href="train-record-detail.html?detail='+arr[i].scoreid+'" class="tr clearfix">'
							+'<div class="td1">'+timetodate(datetotime(arr[i].endtime.substring(0,arr[i].endtime.indexOf('.'))),3)+'  '+trainType+'</div>'
							+_str
						+'</a>'								
					$($div).append(str);
				}
			},
			error:function (str) {
				console.log(str)
			}
			
			
		});		
	}	
};

function writeline(obj,arr1,arr2,arr3,arr4) {
	obj.option = {
	    title : {
	        text: '',
	        
	        textStyle:{
	        	color:'#747676'
	        },
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        backgroundColor:'#0495ca',
	        textStyle:{
	        	fontSize:12			
	        },
	        formatter : '{c}分'
	    },
	    legend: {
	        show:true,      //图列
	        x:'right',
	        data:['在线训练','智能设备','传统模型']
	    },
	    toolbox: {
	        show : false     //工具栏
	    },
	    calculable : false,  //可拖动
	    xAxis : [
	        {
	            type : 'category',
	            splitLine:{show:false},
	            axisLine:{
	            	lineStyle:{
					    color: '#ccc',
					    width: 1,
					    type: 'solid'
					}
	            },
	            
	           data : arr1
	        }
	    ],
	    grid:{// 控制图的大小，调整下面这些值就可以，
	    	borderWidth:0,
         	x: 40,
        	x2: 40
	    },
	    yAxis : [
	        {
	            type : 'value',
	            splitLine:{
	            	show:true,
	            	lineStyle:{
	            		type:'dotted'
	            	}
	            },
	            axisLabel : {
	            	show:true,
	                formatter: '{value}'
	            },		            
	            axisLine:{
	            	lineStyle:{
					    color: '#fff',
					    width: 1,
					    type: 'solid'
					}
	            },
	            max:100
	        }
	    ],
	    series : [
	        {
	            name:'在线训练',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'orange'
				    }
				},
	            data:arr2
	        },
	        {
	            name:'智能设备',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'#0495ca'
				    }
				},
	            data:arr3
	        },
	        {
	            name:'传统模型',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'#000'
				    }
				},
	            data:arr4
	        }
	    ]
	};
				
	obj.myChart = echarts.init(obj);
	obj.myChart.setOption(obj.option);
									
};	