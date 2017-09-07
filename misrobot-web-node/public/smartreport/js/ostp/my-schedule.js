window.onload = function () {
	'use strict';
	common();			
	showpersoncenter('技能课表');
	
	getweek();
	

	$('.sel-schedule').change(function () {
		if ($(this).val()==1) {
			getweek();
		} else {
			getday();
		}
		
	});



	
	
	var oWeekiNow = 0;
	function getday() {
		$('.week-schedule').css('display','none');	
		$('.schedule-list').html('');
		$('.calendar1,.schedule-list').css('display','block');
		oWeekiNow = 0;	
		
		var oBox = document.getElementsByClassName('calendar1')[0];
		var oBox2 = document.getElementsByClassName('calendar2')[0];
		var nowDate = new Date();
		var oWeekToday = nowDate.getDate();
		var selDay = oWeekToday;
		var oWeek = document.getElementById('div2');
		var oWeekUl = oWeek.getElementsByTagName('ul')[0];
		
		var oWeekNum=0;
		var iW=0;
		writecalendar('change',nowDate.getFullYear(),nowDate.getMonth()-1,nowDate.getDate());
		oBox.getElementsByClassName('calendarTitle')[0].onclick = function () {
			oBox2.style.display = 'block';
			newcalendar(parseInt(oWeek.getElementsByClassName('last')[0].innerHTML),
						parseInt(oWeek.getElementsByClassName('next')[0].innerHTML)-1,
						$(oWeekUl).find('li.selday span').html()
			);
		};
		function writecalendar(type,year,month,date) {
			oWeekUl.innerHTML = '';
			oWeekUl.style.width = 'auto';
			oWeekUl.style.position = 'relative';
			
			var oDate = new Date();
			if (year) {
				oDate.setFullYear(year);
			}
			if (month) {
				oDate.setMonth(month);
			}
			if (date) {
				oDate.setDate(date);
				selDay = date;
			}
			
			oDate.setMonth(nowDate.getMonth()+oWeekiNow);
			oWeek.getElementsByClassName('calendarTitle')[0].innerHTML = oDate.getFullYear()+'年 '+(oDate.getMonth()+1)+'月';
			oWeek.getElementsByClassName('next')[0].innerHTML = (oDate.getMonth()+1)+'月';
			oDate.setDate(1);
			var day = oDate.getDay();
			if (day ==0) { 
				day = 7;
			}
			day--;
			for (var i = 0; i<day; i++) { 
				var oLi = document.createElement('li');
				oWeekUl.appendChild(oLi);
			}
			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			var allday = oDate.getDate();
			for (var i = 0; i < allday; i++) { 
				var oLi = document.createElement('li');
				oLi.innerHTML ='<span>'+(i+1)+'</span><i></i>';
				if (oWeekiNow < 0) { 
					oLi.className = 'past';
				} else if (oWeekiNow == 0) { 
					if (i+1 < oWeekToday ) { 
						oLi.className = 'past';
					} else if ( i+1 == oWeekToday) { 
						oLi.className = 'today';
					}
				}
				if ((i+1)==date) {
					oLi.className = 'selday';
				}
				oWeekUl.appendChild(oLi);							
			}
			iW = oWeekUl.children[oWeekUl.children.length-1].offsetWidth;
			for (var i = 0; i <  oWeekUl.children.length; i++) { 
				oWeekUl.children[i].style.width = iW+'px';
				oWeekUl.children[i].style.float = 'left';							
				if (i % 7 == 5 ||i % 7 ==6) {
					if (oWeekUl.children[i].className == '') { 
						oWeekUl.children[i].className = 'week_end';
					} 
				}
			}
			$(oWeekUl).find('li').on('click',function (){
				getcoursetable(
					parseInt($('.calendar1 .calendarTitle').html()),
					parseInt($('.calendar1 .next').html()),
					parseInt($(this).find('span').eq(0).html())
				);
				$(oWeekUl).find('li').removeClass('selday');
				$(this).addClass('selday');
				
			});					
			$(oWeekUl).find('li span').css({'height':iW*0.5+'px','line-height':iW*0.5+'px'});							
			oWeekUl.style.width = iW*oWeekUl.children.length+'px';
			oWeekUl.style.position = 'absolute';
			switch (type){
				case 'prev':
					oWeekNum = Math.ceil(oWeekUl.children.length/7)-1;
					break;
				case 'next':
					oWeekNum = 0;
					break;
				case 'new':
					oWeekNum = Math.ceil(oWeekToday/7);
					break;
				case 'change':
					selDay = oWeekToday;
					var count = 0;
					for (var i = 0 ; i < oWeekUl.children.length;  i++) {
						count++;
						var _span = oWeekUl.children[i].getElementsByTagName('span');
						if (_span.length>0&&parseInt(_span[0].innerHTML)>=date) {
							break;
						}
					}
					if (count%7>3) {
						oWeekNum = Math.ceil(selDay/7)-1;
					} else {
						oWeekNum = Math.ceil(selDay/7);
					}
					if (oWeekUl.offsetWidth<=(iW*7)*oWeekNum) {
						oWeekNum--;
					}
					oWeekNum = Math.ceil(count/7)-1;
					break;
			}
			oWeekUl.style.left = -(iW*7)*oWeekNum+ 'px';						
			getmonthtesk(oWeekUl);					
		};
		$(oWeekUl).parent().swipe({
			swipeLeft:function(event, direction, distance, duration, fingerCount) {
				dateleft();
			 },
			swipeRight:function(event, direction, distance, duration, fingerCount) {
				dateright()
			}
		});
		$('.prev-date').click(dateright);
		$('.next-date').click(dateleft);
		function dateleft() {
			oWeekNum++;
			if (oWeekNum>(Math.ceil(oWeekUl.children.length/7)-1)) {
				oWeekiNow++;
				writecalendar('next');
				return false;
			}
			$(oWeekUl).stop().animate({'left':-(iW*7)*oWeekNum});			
		};
		function dateright() {
			oWeekNum--;
			if (oWeekNum<0) {
				oWeekiNow--;
				writecalendar('prev');
				return false;
			}
			$(oWeekUl).stop().animate({'left':-(iW*7)*oWeekNum});			
		};
		
		
		var arr = ['一','二','三','四','五','六','日'];
		var oDiv = document.getElementById('div1');
		var oLast = oDiv.getElementsByClassName('last')[0];
		var oNext = oDiv.getElementsByClassName('next')[0];
		var oTitle = oDiv.getElementsByClassName('calendarTitle')[0];
		var oOl = oDiv.getElementsByTagName('ol')[0];
		var oUl = oDiv.getElementsByTagName('ul')[0];
		oNext.onclick = function () {
			oWeekiNow++;
			newcalendar();
		};
		oLast.onclick = function () {
			oWeekiNow--;
			newcalendar();
		};
	
		oBox2.getElementsByClassName('calendarTitle')[0].onclick = function () {
			oBox2.style.display = 'none';
		};
	
		function newcalendar(year,month,date) {
			oUl.innerHTML = '';
			oUl.style.height = 'auto';
			var oDate = new Date();
			if (year) {
				oDate.setFullYear(year);
			}
			if (month) {
				oDate.setMonth(month);
			}
			if (date) {
	//							oDate.setDate(date);
			}						
			oDate.setMonth(nowDate.getMonth()+oWeekiNow);
			oTitle.innerHTML = '<span>'+oDate.getFullYear() + '</span>年 <span>' + (oDate.getMonth()+1) + '</span>月';
			oLast.innerHTML = '< '+oDate.getMonth() + '月';
			oNext.innerHTML = (oDate.getMonth()+2) + '月 >';
			var today = oDate.getDate();
			oDate.setDate(1);
			var day = oDate.getDay();
			if (day ==0) { 
				day = 7;
			}
			day--;
			for (var i = 0; i<day; i++) { 
				var oLi = document.createElement('li');
				oUl.appendChild(oLi);
			}
			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			var allday = oDate.getDate();
			for (var i = 0; i < allday; i++) { 
				var oLi = document.createElement('li');
				oLi.innerHTML ='<span>'+(i+1)+'</span><i></i>';
				if (oWeekiNow < 0) { 
					oLi.className = 'past';
				} else if (oWeekiNow == 0) { 
					if (i+1 < today ) { 
						oLi.className = 'past';
					} else if ( i+1 == today) { 
						oLi.className = 'today';
					}  
				}
				if ( (i+1) == date&&(month+1)==oTitle.getElementsByTagName('span')[1].innerHTML) {
					oLi.className = 'selday';
				}							
				var oYear = oTitle.getElementsByTagName('span')[0].innerHTML;
				var oMonth = oTitle.getElementsByTagName('span')[1].innerHTML;
				oLi.setAttribute('date',oYear+'-'+oMonth+'-'+(i+1));
				oUl.appendChild(oLi);
			}
			for (var i = 0; i <  oUl.children.length; i++) { 
				if (i % 7 == 5 ||i % 7 ==6) {
					if (oUl.children[i].className == '') { 
						oUl.children[i].className = 'week_end';
					} 
				}
			}
			$(oUl).find('li').on('click',function (){
				$('.calendar2').css('display','none');
				writecalendar('change',oYear,oMonth-1,this.getElementsByTagName('span')[0].innerHTML);
				getcoursetable(
					parseInt($('.calendar2 .calendarTitle').find('span').eq(0).html()),
					parseInt($('.calendar2 .calendarTitle').find('span').eq(1).html()),
					parseInt($(this).find('span').eq(0).html())
				);						
			});	
			$(oUl).find('li span').css({'height':iW*0.5+'px','line-height':iW*0.5+'px'});							
			oUl.style.height = (oUl.offsetHeight-2)+'px';						
			getmonthtesk(oUl);
	
		};
		var cDate = new Date();
		getcoursetable(cDate.getFullYear(), (cDate.getMonth() + 1), cDate.getDate());
		// getcoursetable();		
		
	};
	
	
		
		

		
	function getcoursetable(year,month,date) {
			console.log(year,month,date)
			var _date = year + '-';
			_date += (month.toString().length > 1) ? month : ( '0' + month );
			_date += '-';
			_date += (date.toString().length > 1) ? date : ( '0' + date );
								
			Api.courseTable({
				isShade:1,
				json:{
					nowtime: _date,
					type:0
				},
				fn:function (data) {
					var json = data.data;
					console.log(json);
					$('.schedule-list').html('');
					for (var name in json) {
						if (json[name].length==0) {
							continue;
						}
						var arr = json[name];
						var _str = '';
						for (var i = 0 ; i <arr.length; i++ ) {
							_str+=
								'<div class="scheduleBox clearfix '+(data.nowtime>arr[i].end_time?'pass':'')+'">'
									+'<div class="time">'+timetodate(arr[i].start_time,2)+'-'+timetodate(arr[i].end_time,2)+'</div>'
									+'<div class="address">'
										+'<span>技能中心</span>&nbsp;'+arr[i].room_num+'室'
									+'</div>'
									+'<div class="lesson">'+arr[i].coursename+'</div>'
									+'<div class="txt">'+arr[i].teachername+'老师</div>'
								+'</div>';									
						}							
						var _time = '上午';
						switch (name){
							case 'mor':
								_time = '上午';
								break;
							case 'lunch':
								_time = '下午';
								break;
							case 'night':
								_time = '晚上';
								break;
						}
						var str = 
							'<div class="scheduleOuter clearfix">'
								+'<div class="timeBucket '+(data.nowtime>arr[arr.length-1].end_time?'pass':'')+'">'+_time+'</div>'
								+'<div class="scheduleCon">'
									+_str
								+'</div>'
							+'</div>';							
						$('.schedule-list').append(str);
					}
					
					if ($('.schedule-list').html()=='') {
						$('.schedule-list').html('<p class="no-data">该日暂无课程</p>');
					}
				}
			});
	};	
	
	
	
	
	
	
	function getmonthtesk(obj) {
		var _date = new Date();
		_date.setMonth(_date.getMonth()+oWeekiNow);
		_date.setDate(1);
		_date.setHours(0,0,0,0);
		var starttime = _date.getTime()/1000;
		_date.setMonth(_date.getMonth()+1);
		var endTime = _date.getTime()/1000;					
		Api.monthTesk({
			isShade:1,
			json:{
				nowtime:starttime,
				endtime:endTime
			},
			fn:function (arr) {
				console.log(arr);
				$(obj).find('li').each(function () {
					for (var j = 0 ; j < arr.length; j++) {
						if (parseInt($(this).find('span').eq(0).html())==parseInt(arr[j].day)) {
							$(this).addClass('task');
						}
					}							
				});							
			}
		});					
	};	

};

function getweek() {
	
	$('.calendar1,.calendar2,.schedule-list').css('display','none');
	$('.week-schedule').css('display','block');
	
	var date = new Date();
	date.setHours(0,0,0,0);
	var _day = date.getDay();
	if (_day==0) {
		_day=7
	}
	
	var _date = date.getFullYear() + '-';
	var month = (date.getMonth() + 1).toString();
	var dd = (date.getDate()-_day+1).toString();
	_date += (month.length > 1) ? month : ( '0' + month );
	_date += '-';
	_date += (dd.length > 1) ? dd : ( '0' + dd );
	
	Api.courseTable({
		isShade:1,
		json:{
			nowtime:_date,
			type:1
		},
		fn:function (data) {
			console.log(data);
			var _arr = data.data;
			$('.dayOuter').html('');
			
			for (var j=0; j<_arr.length; j++) {
				
				var arr = _arr[j].data;
				var _str= '';
				for (var i = 0 ; i < arr.length; i++) {
					var _str2 = '上午';
					switch (arr[i].iftime){
						case 1:_str2 = '上午';
							break;
						case 2:_str2 = '下午';
							break;
						case 3:_str2 = '晚上';
							break;
					}
					_str+=
						'<div class="clearfix">'
							+'<div class="timePart time_'+arr[i].iftime+' ">'+_str2+'</div>'
							+'<div class="lessonCon clearfix ">'
								+'<div class="time">'+timetodate(arr[i].start_time,2)+'-'+timetodate(arr[i].end_time,2)+'</div>'
								+'<div class="address">'
									+'<span class="address1">技能中心 </span>'
									+'<span class="address2">' +arr[i].room_num+'室</span>'
								+'</div>'
								+'<div class="name">'+arr[i].coursename+'</div>'
								+'<div class="txt">'+arr[i].teachername+'老师</div>'
							+'</div>'
						+'</div>';
				}
				var _day = '';
				var oDate = new Date();
				oDate.setTime(data.nowtime*1000);
				var _date = oDate.getDate();
				if (parseInt(_date)==parseInt(_arr[j].day)) {
					_day = '今天';
				} else {
					oDate.setDate(_arr[j].day);
					switch (oDate.getDay()){
						case 1:_day = '周一';
							break;
						case 2:_day = '周二';
							break;
						case 3:_day = '周三';
							break;
						case 4:_day = '周四';
							break;
						case 5:_day = '周五';
							break;
						case 6:_day = '周六';
							break;
						default:_day = '周日';
							break;
					}								
				}
				var str = 
					'<div class="dayCon clearfix">'
						+'<div class="day">'
							+'<p>'+_day+'</p>'
							+'<span>'+data.moon+'-'+_arr[j].day+'</span>'
						+'</div>'
						+'<div class="lessonOuter">'+_str+'</div>'
					+'</div>';							
				$('.dayOuter').append(str);
				$('.timePart').css({'height':$('.timePart').css('width'),'line-height':$('.timePart').css('width')});
			}
			if ($('.dayOuter').html()=='') {
				$('.dayOuter').html('<p class="no-data">本周暂无课程</p>');
			}						
		}
	});						
};