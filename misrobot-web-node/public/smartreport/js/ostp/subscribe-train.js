window.onload = function () {
	'use strict';
	common();
	$('.nextBtn1').click(function() { //选择技能
		$('.step').css('display', 'none');
		$('.step2').css('display', 'block');
	});
	$('.nextBtn2').click(function() { //选择模式
		$('.step').css('display', 'none');

		if ($('.trainMode').val() == '2') {
			$('.nextBtn3').html('确认预约');
		}

		$('.step3').css('display', 'block');
	});
	$('.nextBtn3').click(function() { //选择时间
		if (!$('.sel-date').attr('openid')) {
			uselayer(1,'请选择时间');
			return false;
		}

		if( $('.trainMode').val() == '1' ){
			getstudent();
		}else{
			towrite();
		}

	});
	$('.nextBtn4').click(function() { //选择伙伴
		if ($('.friendOuter .friendConOn').length==0) {
			uselayer(3,'请选择小伙伴');
			return false;
		}
		towrite();

	});

	function getstudent() {
		$('.step').css('display', 'none');

		$('.step4 .searchImg').click(function () {
			Api.applyStudent({
				isShade:1,
				json:{
					username:$.trim($('.step4 .friendInp').val()),
					ctime:timetodate($('.sel-date').attr('_start'),4),
					jname:$('.applylist').val(),
					atime:$('.sel-date').attr('_start'),
					btime:$('.sel-date').attr('_end')
				},
				fn:function (json) {
					console.log(json);
					if (json.data.length==0) {
						$('.friendOuter').html('<p class="no-data">'+json.message+'</p>');
						return false;
					}
					var arr = json.data;
					$('.friendOuter').html('');
					$('.friendOuter').css('width',arr.length*145+'px');
					for (var i = 0 ; i < arr.length; i++) {
						var str =
							'<div class="friendCon" _id="'+arr[i].id+'">'
							+'<img src="'+(arr[i].imgurl!=undefined?arr[i].imgurl:'../../images/ostp/feifei.png')+'" />'
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

		var json = {
			atime:$('.sel-date').attr('_start'),
			btime:$('.sel-date').attr('_end'),
			ctime:timetodate($('.sel-date').attr('_start'),4),
			type:$('.trainMode').val(),
			learn_id:$('.sel-date').attr('learn_id'),
			place_id:$('.sel-date').attr('place_id'),
			openid:$('.sel-date').attr('openid')
		};
		if ($('.trainMode').val()==1) {
			json.fuid=$('.friendOuter .friendConOn').attr('_id');
		}


		Api.applyWrite({
			isShade:1,
			json:json,
			fn:function (json) {
				console.log(json);
				uselayer(3,json.message);
				if (json.status!=1) {
					return false;
				}

				var str =json.data.skill+'<br/>预约时间：'+json.data.time+'<br/>'+json.data.address;
				$('.subscribeCancel').attr({
					'appstuid':json.data.appstuid,
					'plappid':json.data.plappid
				});

				$('.step5 .subscribeTxt3').html(str);

				$('.step').css('display', 'none');
				$('.step5').css('display', 'block');

				$('.subscribeCancel').click(function () {
					uselayer(2,'确定要取消预约吗？',function () {
						Api.applyCancelapply({
							isShade:1,
							json:{
								atime:$('.sel-date').attr('_start'),
								appstuid:$('.subscribeCancel').attr('appstuid'),
								plappid:$('.subscribeCancel').attr('plappid')
							},
							fn:function (json) {
								console.log(json);
								uselayer('3',json.message,function () {
									if (json.status==1) {
										window.location.reload();
									}
								});

							}
						});
					});
				});


			}


		});



	};


	$('.sel-date').click(function () {
		Api.applySelcalendar({
			isShade:1,
			json:{
				type:$('.trainMode').val(),
				jname:$('.applylist').val()
			},
			fn:function (arr) {
				if (!arr.length) {
					uselayer(1,arr.message,function () {
						window.location.reload();
					});
					return false;
				}
				console.log(arr);//{status: 1, msg: "没有可预约的日历"}
				var json = {};
				for (var i = 0 ; i < arr.length; i++) {
					var oDate = new Date();
					oDate.setTime(arr[i].starttime*1000);
					var _date = oDate.getDate();
					console.log(_date)
					if (!json[_date]) {
						json[_date]={
							't':'',
							'm':[],
							'a':[],
							'n':[]
						};
					}
					var _h = oDate.getHours();
					if (_h<12) {
						json[_date].m.push(arr[i]);
					} else if (_h<18) {
						json[_date].a.push(arr[i]);
					} else {
						json[_date].n.push(arr[i]);
					}
					json[_date].t=arr[i].starttime;
				}

				$('.week-list').html('');
				$('.date-list').html('');

				for (var name in json) {
					var oDate = new Date();
					oDate.setTime(json[name].t*1000);
					var _day = '日';
					switch (oDate.getDay()){
						case 1:	_day='一';
							break;
						case 2:	_day='二';
							break;
						case 3:	_day='三';
							break;
						case 4:	_day='四';
							break;
						case 5:	_day='五';
							break;
						case 6:	_day='六';
							break;
						default:_day='日';
							break;
					}
					$('.week-list').append('<div class="dayCon">'+_day+'</div>');
					$('.date-list').append('<div class="dayCon">'+oDate.getDate()+'</div>');
				}
				$('.date-list .dayCon').click(function () {
					$('.time-part ul').html('');
					var _json = json[$(this).html()];
					$('.timeTable .YM').html(timetodate(_json.t,4));
					for (var name in _json) {
						var _arr = _json[name];
						var _num = 0;
						switch (name){
							case 'm':_num = 0;
								break;
							case 'a':_num = 1;
								break;
							case 'n':_num = 2;
								break;
							default: continue;
								break;
						}
						for (var i = 0 ; i < _arr.length; i++) { //timeConNo
							var _str = '<li class="'+(_arr[i].code?'timeConNo':'timeCon')+'" start="'+_arr[i].starttime
								+'" end="'+_arr[i].endtime
								+'" learn_id="'+_arr[i].learn_id
								+'" place_id="'+_arr[i].place_id
								+'" openid="'+_arr[i].openid+'">'
								+timetodate(_arr[i].starttime,2)+'-'+timetodate(_arr[i].endtime,2)+'</li>';

							$('.time-part').eq(_num).find('ul').append(_str);
						}
					}
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
				console.log(json)
			}
		});



		$('.timeTable').css('display', 'block');


	});

	$('.dateBtn').click(function() {
		var $obj=$('.time-part ul li.timeConOn');
		if ($($obj).length==0) {
			uselayer(3,'请选择一个时间');
			return false;
		}
		var _start = $($obj).attr('start');
		var _end = $($obj).attr('end');
		$('.sel-date').attr({
			'_start':_start,
			'_end':_end,
			'learn_id':$($obj).attr('learn_id'),
			'place_id':$($obj).attr('place_id'),
			'openid':$($obj).attr('openid')
		})
		$('.sel-date').html(timetodate(_start,3)+'-'+timetodate(_end,2));

		$('.timeTable').css('display', 'none');
	});



	Api.applaySelproject({
		isShade:1,
		fn:function (base) {
			console.log(base);
			if (base.code!=1) {
				uselayer(1,base.message,function () {
					jumplogin();
				});
				return false;
			}
			var arr = base.data;
			if (arr.length==0) {
				Api.applyMsgapply({
					isShade:1,
					json:{},
					fn:function (json) {
						console.log(json);
						$('.step0 .subscribeTxt3 p').html('满足自主训练'+json.data.count+'次，最高分达到'+json.data.score+'分');
					}
				});
				$('.step').css('display','none');
				$('.step0').css('display','block');
				return false;
			}

			$('.step').css('display','none');
			$('.step1').css('display','block');
			$('.applylist').html('');
			for (var i = 0 ; i < arr.length; i++) {
				$('.applylist').append('<option value="'+arr[i].name+'">'+arr[i].name+'</option>');
			}


		}
	});



	$('.timeTable-close').click(function () {
		$('.timeTable').css('display','none');
	});


};
