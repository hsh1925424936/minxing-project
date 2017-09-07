window.onload = function () {
	'use strict';
	webcommon();				
	if (findurl('u')!='') {
		setCookie('gy_un',findurl('u'),7);
	}
	var jAbility = {};//专业技能
	var jScore = {};//班级成绩统计
	var jTimes = {};//对应训练完成的人数
	var jNotrain = {};//未训练人员名单
	var jAvage = {}; //平均分	
	var jWrong = {};//错误情况
	var jRatio = {};//错误率
	var jDetail = {};//错误详情
	
	Api.R({
		isShade:1,
		json:{
			"1": {
				command:'report/queryprereport',
				accountname: getCookie('gy_un'),
				sessionid: getCookie('gy_t'),
				reportid: findurl('report'),
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
			
			$('.topTxt').html(base.classinfo.classname+base.classinfo.coursename+'课前报告');
			
			$('.val').eq(0).html(base.classinfo.coursename);
			$('.val').eq(1).html(timetodate(datetotime(base.classinfo.coursebegintime))+'-'+timetodate(datetotime(base.classinfo.courseendtime),2));
			$('.val').eq(2).html(base.classinfo.classname);
			$('.val').eq(3).html(base.classinfo.majorname);
			$('.val').eq(4).html(base.classinfo.departmentname);
			$('.val').eq(5).html(base.classinfo.studentcount);
			
						
			$('.scoreTxt').eq(0).html('');
			$('.scoreTxt').eq(1).html('');
			$('.trainSkillBox').html('');
			
			for (var i = 0 ; i < base.classinfo.trainitemname.length; i++) {
				
				var str = 
					'<div class="detail clearfix">'
						+'<div class="name">在线训练</div>'
						+'<div class="val">'+base.classinfo.trainitemname[i]+'</div>'
					'</div>';							
				$('.skill-list').append(str);
				
				var str = 
					'<div class="skillCon">'
						+'<div class="skillImg"></div>'
						+'<span>'+base.classinfo.trainitemname[i]+'</span>'
					+'</div>';							
				$('.trainSkillBox').append(str);
			}
			
			

			//专业技能
			(function () {
				for (var i = 0 ; i < base.abilityinfo.length; i++) {
					if (!jAbility[base.abilityinfo[i].trainitemname]) {
						jAbility[base.abilityinfo[i].trainitemname]={
							aName:[],
							aScore:[]
						};
					}
					var aScore = parseFloat(base.abilityinfo[i].abilityscore)  ? parseFloat(base.abilityinfo[i].abilityscore).toFixed(2) : 0;
					var max = base.abilityinfo[i].abilityfullscore ? parseInt(base.abilityinfo[i].abilityfullscore) : 0;
					jAbility[base.abilityinfo[i].trainitemname].aName.push({text:base.abilityinfo[i].abilityname, max: max});
					jAbility[base.abilityinfo[i].trainitemname].aScore.push(aScore);									
				}
				console.log(jAbility);
			})();
			
			//班级成绩统计
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
		            
		            jAvage[base.classscore[i].trainitemname] = base.classscore[i].averagescore;
				}							
				console.log(jScore);		
			})();
			
			//对应训练完成的人数
			(function () {
				for (var i = 0 ; i < base.finishinfo.length; i++) {
					if (!jTimes[base.finishinfo[i].trainitemname]) {
						jTimes[base.finishinfo[i].trainitemname]={
							aTimes:[],
							aCount:[]
						};
					}
					jTimes[base.finishinfo[i].trainitemname].aTimes.push(base.finishinfo[i].finishtime);
					jTimes[base.finishinfo[i].trainitemname].aCount.push(base.finishinfo[i].count);									
				}
				console.log(jTimes);

			})();						
			//未训练人员名单
			(function () {
				for (var i = 0 ; i < base.nottrainstudent.length; i++) {
					if (!jNotrain[base.nottrainstudent[i].trainitemname]) {
						jNotrain[base.nottrainstudent[i].trainitemname]=[];
					}
					jNotrain[base.nottrainstudent[i].trainitemname].push(base.nottrainstudent[i].name);
				}
				console.log(jNotrain);

			})();								
			//错误情况
			(function () {
				for (var i = 0 ; i < base.typicalerror.length; i++) {
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
			//错误率
			(function () {
				for (var i = 0 ; i < base.errorratio.length; i++) {
					if (!jRatio[base.errorratio[i].trainitemname]) {
						jRatio[base.errorratio[i].trainitemname]={
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
					jRatio[base.errorratio[i].trainitemname].aName.push(base.errorratio[i].opstep);
					jRatio[base.errorratio[i].trainitemname].aScore.push(_json);	
				}								
				console.log(jRatio);							
			})();
			//错误详情
			(function () {
				base.errordetails.sort(function (a,b) {
					return b.errorcount-a.errorcount; 
				});								
				for (var i = 0 ; i < base.errordetails.length; i++) {
					if (!jDetail[base.errordetails[i].trainitemname]) {
						jDetail[base.errordetails[i].trainitemname]=[];
					}								
					jDetail[base.errordetails[i].trainitemname].push(base.errordetails[i]);
				}		
				console.log(jDetail);							
			})();

			$('.skillCon').click(function () {
				$('.skillCon').removeClass('skillImgOn');
				$(this).addClass('skillImgOn');
				allwrite($(this).find('span').html());
			});
			$('.skillCon').eq(0).click();		
			
			
			
			
			function allwrite(skill) {
				$('.score')[0].show = false;
				$('.Radar')[0].show = false;
				if ($('.scoreCon').css('left')=='-'+$('.scoreOuter').css('width')) {
					showwater(skill);																
				} else {
					showradar(skill);								
				}
				if ($('.result-count')[0]) {
					$('.result-count')[0].show = false;
				}
				if ($('.train-time')[0]) {
					$('.train-time')[0].show = false;
				}
				
				
				if ($('.notrain')[0]&&jNotrain[skill]) {
					$('.notrain').html(jNotrain[skill].join('/'));								
				} else {
					$('.notrain').html('<p class="no-data">暂无未训练学生</p>');
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
				
				if ($('.error-rate')[0]) {
					$('.error-rate')[0].show = false;
				}
				
				if ($('.wrong-detail')[0]&&jDetail[skill]&&jDetail[skill].length!=0) {
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
					$('.wrong-detail').html('<p class="no-data">暂无典型错误</p>');
				}				
				
				
				
				
				
			};




			
			
            $(window).scroll(function() {
            	var _t = $(document).scrollTop()+$(window).height();
            	var skill = $('.skillCon.skillImgOn span').html();
            	if ($('.result-count')[0]) {
            		if ($('.result-count').offset().top-_t<100&&!$('.result-count')[0].show) {
            			$('.result-count')[0].show = true;
						if (jScore[skill]) {
							wirteResultcount($('.result-count')[0],jScore[skill]);								
						} else {
							$('.result-count').html('<p class="no-data">暂无该项信息</p>');
						}								
            		}
            	}
            	if ($('.train-time')[0]) {
            		if ($('.train-time').offset().top-_t<100&&!$('.train-time')[0].show) {
						$('.train-time')[0].show = true;
						if (jTimes[skill]) {
							if(jTimes[skill].aTimes.length == 1){
								jTimes[skill].aTimes.push(' ');
								jTimes[skill].aTimes.push(' ');
								jTimes[skill].aCount.push('');
								jTimes[skill].aCount.push('');
							}else if( jTimes[skill].aTimes.length == 2 ){
								jTimes[skill].aTimes.push(' ');
								jTimes[skill].aCount.push('');
							}
							writeTraintime($('.train-time')[0],jTimes[skill].aTimes,jTimes[skill].aCount,{is_phone:'1'});														
						} else {
							$('.train-time').html('<p class="no-data">暂无该项信息</p>');
						}								
            		}
            	} 
            	if ($('.error-rate')[0]) {
            		if ($('.error-rate').offset().top-_t<100&&!$('.error-rate')[0].show) {
						$('.error-rate')[0].show = true;
						if (jRatio[skill]) {
							writeErrorrate($('.error-rate')[0],jRatio[skill].aName,jRatio[skill].aScore,'%',{is_phone:'1'});														
						} else {
							$('.error-rate').html('<p class="no-data">暂无该项信息</p>');
						}								
            		}
            	}            	
            	
            });						
			
			
			
			
		}
		
	});
	
				

	$('.scoreOuter ol li').click(function () {
		$('.scoreOuter ol li').removeClass('active');
		$(this).addClass('active');
		movescoreCon();
	});
	
	function movescoreCon() {
		if ($('.scoreOuter ol li.active').attr('_type')==1) {
			$('.scoreCon').stop().animate({'left':'0%'},{complete:function () {
				showradar($('.skillCon.skillImgOn span').html());
			}});
		} else {
			$('.scoreCon').stop().animate({'left':'-100%'},{complete:function () {
				showwater($('.skillCon.skillImgOn span').html());
			}});
		}										
	};
	
	function showradar(skill) {
		if (!$('.Radar')[0].show) {
			$('.Radar')[0].show = true;
			if (jAbility[skill]) {
				writeradar({
					obj:$('.Radar')[0],
					name:jAbility[skill].aName,
					value:jAbility[skill].aScore,
					line:'#76e5ff',
					type:'solid',
					color:'rgba(255,255,255,0.2)'
				});									
			} else {
				$('.Radar').html('<p class="no-data">暂无该项信息</p>');
			}						
		}					
	};
	
	function showwater(skill) {
		if (!$('.score')[0].show) {
			$('.score')[0].show = true;
			$('.score p').html(0);
			$('.score div').css('top','120px');
			if (jAvage[skill]) {
				writeWater($('.score'),jAvage[skill]);							
			}						
		}	
	};
};
$('.switchLi1').click(function() {
	window.location.href = 'pre-course-report-finish.html?report='+findurl('report');
});
$('.switchLi2').click(function() {
	window.location.href = 'pre-course-report-wrong.html?report='+findurl('report');
});