window.onload = function () {
	'use strict';
	common();

	$('.changeSeat').click(function() {
		open_dialog('choose-seat.html');//打开选择训练位的弹窗
	});

	$('.nextBtn1').click(function() { //第一步选择模式和技能
		$('.step').css('display', 'none');

		// if ($('.trainMode').val() != '1') {
		// 	$('.nextBtn3').html('确认预约');
		// }

		$('.step3').css('display', 'block');
	});
	$('.nextBtn2').click(function() { //第三步选择训练位
		if ( $('.step2').attr('nostation') ){
			uselayer(1,'该时间段目前没有空闲的训练位',function(){
				window.location.reload();
			});
			return false;
		}
 		if ( !$('.step2').attr('placeid') ){
 			uselayer(1,'请选择训练位');
			return false;
 		}

		if( $('.trainMode').val() == '1' ){
			getstudent();//选择伙伴
		}else{
			towrite();//提交预约
		}
	});

	$('.nextBtn3').click(function() { //第二步选择时间
		if (!$('.sel-date').attr('_start')) {
			uselayer(1,'请选择时间');
			return false;
		}
		show_default_seat();//显示默认的训练位
		$('.step').css('display', 'none');
		$('.step2').css('display', 'block');

	});

	$('.nextBtn4').click(function() { //如果是模型人训练进行第四步-选择伙伴
		if ($('.friendOuter .friendConOn').length==0) {
			uselayer(3,'请选择小伙伴');
			return false;
		}
		towrite();

	});

	function show_default_seat(){//显示学生默认的座位
		$('.step2 .subscribeTxt3 span').eq(1).html('暂无训练位');
		var _start = $('.sel-date').attr('_start');
		var _end = $('.sel-date').attr('_end');
		var ymd = $('.sel-date').attr('ymd');
		Api.R({
			url: "/learn/querystationbytime",
			istoken:1,
			isShade:1,
			json:{
				"1": {
					command: "learn/querystationbytime",
					//openid:$('.sel-date').attr('openid'),
					learnid:$('.applylist').val(),
					sessionid:getCookie('gy_t'),
					loginid:getCookie('gy_u'),
					applydate:$('.sel-date').attr('ymd')+' 00:00:00',
					open_start_dt:_start,
					open_end_dt:_end
				}							
			},
			fn:function (json) {
				console.log(json);
				if ( json[1].workstations.length == 0 ){
					$('.step2').attr('nostation', '1');
					return false;
				}
				var data = json[1].workstations[0];
				//311智能一体化教室,10号训练位
				var str = data.displayname+','+data.workstationcode+'训练位';
				$('.step2 .subscribeTxt3 span').eq(1).html(str);
				$('.step2').attr({
					workstationid:data.workstationcode,
					placeid:data.placeid,
					roomnum:data.room_num,
					openid:data.openid,
					_id:data.id
				});
				$('.sel-date').attr('openid',data.openid);
			}
		});
	}

	function getstudent() {
		$('.step').css('display', 'none');

		$('.step4 .searchImg').click(function () {
			Api.R({
				url: "/learn/querysatisfystudents",
				istoken:1,
				isShade:1,
				json:{
					"1": {
						command: "learn/querysatisfystudents",
						learnid:$('.applylist').val(),
						sessionid:getCookie('gy_t'),
						loginid:getCookie('gy_u'),
						content:$('.friendInp').val().trim()
					}
				},
				fn:function (json) {
					console.log(json);
					var arr = json[1].students;
					if (arr.length==0) {
						$('.friendOuter').html('<p class="no-data">对不起,没有搜索到伙伴!</p>');
						return false;
					}
					$('.friendOuter').html('');
					$('.friendOuter').css('width',arr.length*145+'px');
					for (var i = 0 ; i < arr.length; i++) {
						var str =
							'<div class="friendCon" _id="'+arr[i].stdid+'" _name="'+arr[i].name+'">'
							+'<img src="'+(arr[i].imageurl!=undefined?arr[i].imageurl:'../../images/ostp/feifei.png')+'" />'
							+'<div class="friendInfo">'
							+arr[i].name+'<br/>'+arr[i].card_num+'<br/>'+arr[i].mname+'<br/>'
							+'</div>'
							+'</div>';
						$('.friendOuter').append(str);
					}

					$('.friendOuter .friendCon').click(function () {
						$('.friendOuter .friendCon').removeClass('friendConOn');
						$(this).addClass('friendConOn');
					});



				}
			});
		});

		$('.step4').css('display', 'block');
	};


	function towrite() {
		var _start = $('.sel-date').attr('_start');
		var _end = $('.sel-date').attr('_end');
		var ymd = $('.sel-date').attr('ymd');
		var json = {
			"1":{
				command:"learn/submitbookinglearn",
				learnid:$('.applylist').val(),
				type:$('.trainMode').val(),
				sessionid:getCookie('gy_t'),
				loginid:getCookie('gy_u'),
				placeid:$('.step2').attr('placeid'),
				uid:getCookie('gy_u'),
				openid:$('.sel-date').attr('openid'),
				workstationid:$('.step2').attr('_id'),
				applystartdt:ymd+' '+_start,
				applyenddt:ymd+' '+_end
			}
		};

		if ($('.trainMode').val() == 1) {
			json[1].uid2 = $('.friendOuter .friendConOn').attr('_id');
		}


		Api.R({
			url: "/learn/submitbookinglearn",
			isShade:1,
			json:json,
			fn:function (base) {
				console.log(base);
				if( base[1].errcode!= 0 ){
					uselayer(3,base[1].errdesc);//接口报错
                    return false;
				}

				var str = '';
				if ( $('.trainMode').val() == 1 ){//模型人训练要加伙伴姓名
					str += ' 训练人:'+codetostr(getCookie('gy_n'))+' '+
					$('.friendOuter .friendConOn').attr('_name')+'<br/>';
				}else{
					str += ' 训练人:'+codetostr(getCookie('gy_n'))+'<br/>';
				}
				
				switch ( $('.trainMode').val() ){
					case 0:
						str += '训练类型:在线训练<br/>';
						break;
					case 1:
						str += '训练类型:模型人训练<br/>';
						break;
					case 2:
						str += '训练类型:智能训练<br/>';
						break;
				}

				str += '训练项目:'+$('.applylist option:selected').html()+'<br/>';
				str += '预约时间:'+ymd+' '+_start+'--'+ymd+' '+_end+'<br/>';
				str += '训练地点:'+$('.step2 .subscribeTxt3 span').eq(1).html();

				$('.subscribeCancel').attr({
					'applystudentid':base[1].applystudentid
				});

				$('.step5 .subscribeTxt3').html(str);

				$('.step').css('display', 'none');
				$('.step5').css('display', 'block');

				$('.subscribeCancel').click(function () {
					uselayer(2,'确定要取消预约吗？',function () {
						Api.R({
							url:"/learn/deletebookedlist",
							isShade:1,
							json:{
								"1":{
									command:"learn/deletebookedlist",
									applystudentid:$('.subscribeCancel').attr('applystudentid'),
									sessionid:getCookie('gy_t'),
									loginid:getCookie('gy_u')
								}
							},
							fn:function (base) {
								console.log(base);
								if( base[1].errcode == 0 ){
									window.location.reload();
								}

							}
						});
					});
				});


			}


		});



	};

	$('.sel-date').click(function () {
	
		$('.week-list').html('');
		$('.date-list').html('');
		var oDate = new Date();
		var week_arr = ['周日','周一','周二','周三','周四','周五','周六'];
		for ( var i = 0; i < 7; i++ ){
			$('.week-list').append('<div class="dayCon">'+week_arr[oDate.getDay()]+'</div>');
			$('.date-list').append('<div class="dayCon" ymd="'+oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'">'+oDate.getDate()+'</div>');
			oDate.setDate(oDate.getDate()+1);
		}

		$('.date-list .dayCon').click(function () {//点击某个日期
			$('.time-part ul').html('');
			var ymd = $(this).attr('ymd');//存放年月日
			$('.timeTable .YM').html( ymd );
			var currentdate = ymd+' 00:00:00';
			
			Api.R({
				url: "/learn/queryopentimebyid",
				isShade:1,
				json:{
					"1": {
						command: "learn/queryopentimebyid",
						learnid:$('.applylist').val(),
						currentdate:currentdate,
						sessionid:getCookie('gy_t'),
						loginid:getCookie('gy_u')
					}							
				},
				fn:function (json) {
					var _arr = json[1].placeopentimes;
					for ( var i = 0; i < _arr.length; i++ ){
						var _str = '<li class="timeCon" start="'+_arr[i].open_start_dt
							+'" end="'+_arr[i].open_end_dt
							+'" ymd="'+ymd+'">'
							+_arr[i].open_start_dt+'-'+_arr[i].open_end_dt+'</li>';

						var _hour = parseInt( _arr[i].open_start_dt.substring(0,2) );
						var _num = 2;
						if( _hour < 12 ){
							_num = 0;
						}else if( _hour < 18 ){
							_num = 1;
						}
						$('.time-part').eq(_num).find('ul').append(_str);
					}
				}
			});

			$('.date-list .dayCon').removeClass('dayOn');
			$(this).addClass('dayOn');

		});
		$('.date-list .dayCon').eq(0).click();

		$('.time-part ul').click(function (e) {
			if (e.target.className=='timeCon') {
				$('.time-part ul li').removeClass('timeConOn');
				$(e.target).addClass('timeConOn');

			}
		});
		$('.timeTable').css('display', 'block');
	});

	$('.dateBtn').click(function() {
		var $obj=$('.time-part ul .timeConOn');
		if ($($obj).length==0) {
			uselayer(3,'请选择一个时间');
			return false;
		}
		var _start = $($obj).attr('start');
		var _end = $($obj).attr('end');
		$('.sel-date').attr({
			'_start':_start,
			'_end':_end,
			'ymd':$($obj).attr('ymd')
			// 'openid':$($obj).attr('openid')
		})
		$('.sel-date').html(_start+'-'+_end);

		$('.timeTable').css('display', 'none');
	});

	$('.trainMode').change(function() {//当训练类型改变时查询相应的训练项目
		var type = $('.trainMode').val();
		Api.R({//根据训练类型查询训练项
			url: "/learn/querysatisfylearn",
			isShade: 1,
			json: {
				"1": {
					command: "learn/querysatisfylearn",
					type:type,
					sessionid: getCookie('gy_t'),
					uid: getCookie('gy_u'),
					loginid: getCookie('gy_u')
				}
			},
			fn: function(result){
				if(result["1"].errcode != 0){
					uselayer(3, result["1"].errdesc);
					return false;
				}

				var arr = result["1"].learnids;
				$('.applylist').html('');
				for (var i = 0 ; i < arr.length; i++) {
					$('.applylist').append('<option value="'+arr[i].learnid+'">'+arr[i].name+'</option>');
				}
				
			}
		});
	});
	$('.trainMode').change();

	$('.timeTable-close').click(function () {//关闭选择时间段的窗口
		$('.timeTable').css('display','none');
	});

};

function show_seat_table(){//弹窗中展示座位表格
	var _start = $('.sel-date').attr('_start');
	var _end = $('.sel-date').attr('_end');
	var ymd = $('.sel-date').attr('ymd');
	Api.R({
		url: "/learn/querystationbytime",
		isShade:1,
		json:{
			"1": {
				command: "learn/querystationbytime",
				learnid:$('.applylist').val(),
				sessionid:getCookie('gy_t'),
				loginid:getCookie('gy_u'),
				applydate:$('.sel-date').attr('ymd')+' 00:00:00',
				open_start_dt:_start,
				open_end_dt:_end
			}							
		},
		fn:function (json) {
			console.log(json);
			var workstations = json[1].workstations;//有效训练位数组
			document.getElementById('iframe_dialog').contentWindow.show_seat_table(workstations);
		}
	});
}

function show_selected_seat( Workstationid,displayname,placeid,roomnum,openid,id ){//当选择训练位并按确定后，重新显示文字
	var str = displayname+','+Workstationid+'训练位';
	$('.step2 .subscribeTxt3 span').eq(1).html(str);
	$('.step2').attr({
		workstationid:Workstationid,
		placeid:placeid,
		roomnum:roomnum,
		openid:openid,
		_id:id
	});
	$('.sel-date').attr('openid',openid);
}
