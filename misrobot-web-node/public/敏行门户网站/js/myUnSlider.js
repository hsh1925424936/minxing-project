'use strict';

var myUnSlider = {
	option:{},
	T:{},//一格定时器
	isClearT:false,//判断是否清除了定时器
	//图片左移或右移的方法 参数有移动速度方向
	slidePic:function(direction,speed){//direction 1为向左移动1格，-1为向右移动一格
		if( direction == 0 ){
			if( myUnSlider.isClearT ){
				//重新启动定时器
				myUnSlider.set_interval(myUnSlider.option);
				myUnSlider.isClearT = false;
			}
			return false;
		}
		var liArr = $('.take_turns_change_content').children();
		liArr.css('display', 'none');
		var liLen = liArr.length;
		var index = $('.take_turns_change_content').attr('index');
		if( direction > 0 ){//向左移动的情况
			liArr.eq(index).css('display', 'block');
			liArr.eq(index).css('left','0');
			var next = 0;
			if( parseInt(index)+1 < liLen ){
				next = parseInt(index)+1;
			}
			liArr.eq(next).css('display', 'block');
			liArr.eq(next).css('left', '50%');
			$('.take_turns_change_content').css('left', '0');

			$('.take_turns_change_content').animate({
				left:'-100%'
			},
			speed,
			function() {
				$('.take_turns_change_content').attr('index',next);
				$('.take_turns_change_outer>p>span').removeClass('span_onclick');
				$('.take_turns_change_outer>p>span').eq(next).addClass('span_onclick');
				if( --direction >= 0 ){
					myUnSlider.slidePic(direction,speed);
				}
			});

		}else if( direction < 0 ){//向右移动的情况
			liArr.eq(index).css('display', 'block');
			liArr.eq(index).css('left', '50%');
			var next = parseInt(liLen)-1;
			if( index > 0 ){
				next = parseInt(index)-1;
			}
			liArr.eq(next).css('display', 'block');
			liArr.eq(next).css('left', '0');
			$('.take_turns_change_content').css('left', '-100%');

			$('.take_turns_change_content').animate({
				left:'0'
			},
			speed,
			function() {
				$('.take_turns_change_content').attr('index',next);
				$('.take_turns_change_outer>p>span').removeClass('span_onclick');
				$('.take_turns_change_outer>p>span').eq(next).addClass('span_onclick');
				if( ++direction <= 0 ){
					myUnSlider.slidePic(direction,speed);
				}
			});

		}
	},
	set_interval:function(opt){
		this.T = setInterval(function(){//生成计时器
			myUnSlider.slidePic(1,opt.speed);
		},opt.wait);
	},

	init:function(opt){//初始化的方法
		this.option.speed = opt.speed;
		this.option.wait = opt.wait;

		$('.take_turns_change_content').attr('index', '0');
		$('.take_turns_change_content li').eq(0).css('display', 'block');
		myUnSlider.option = opt;
		opt.speed = opt.speed || 1000;
		opt.wait = opt.wait || 2000;
		if( $('.take_turns_change_content li').length < 2 ){//如果只有一张图或者没有图
			//$('.take_turns_change_content li').css('display', 'block');
			return false;
		}
		var str = '';
		var picLen = $('.take_turns_change_content li').length;
		for( var i = 0; i < picLen; i++ ){
			if( i == 0 ){
				str+='<span index="'+i+'" class="span_onclick"></span>';
			}else{
				str+='<span index="'+i+'"></span>';
			}
		}
		$('.take_turns_change_outer').append('<p></p>');
		$('.take_turns_change_outer>p').html(str);
		$('.take_turns_change_outer>p>span').click(function() {//轮播图圆圈点击的事件
			clearInterval(myUnSlider.T);
			myUnSlider.isClearT = true;
			
			var indexTo = parseInt($(this).attr('index'));
			var indexNow = parseInt($('.take_turns_change_content').attr('index'));
			var direction = indexTo-indexNow;
			var speed_ =  myUnSlider.option.speed/direction;
			speed_ = Math.abs(speed_)/1.5;
			myUnSlider.slidePic(direction,speed_);
		});
		this.set_interval(opt);
		if( opt.toslide ){
			this.toslide();
		}
	},
	tonext:function(){//重新启动轮播的方法/手动划到下一个的方法
		myUnSlider.slidePic(1,this.option.speed);
	},
	topre:function(){//滑动到前一页的方法
		myUnSlider.slidePic(-1,this.option.speed);
	},
	pause:function(){//暂停轮播的方法
		clearInterval(this.T);
		myUnSlider.isClearT = true;
	},
	toslide:function(){//支持手机上滑动
		var self = this;
		$('.take_turns_change_outer')[0].addEventListener("touchstart",function(event){
			event.preventDefault();
			self.pause();
			self.start_x = event.touches[0].pageX;
		},false);
		$('.take_turns_change_outer')[0].addEventListener("touchend",function(event){
			event.preventDefault();
			var end_x = event.changedTouches[0].pageX;
			if( end_x - self.start_x > 50 ){//切到前面一页
				self.topre();
			}else if( end_x - self.start_x < -50 ){//切到后面一页
				self.tonext();
			}else{
				if( self.isRestarting == true ){
					return false;
				}
				self.isRestarting = true;
				setTimeout(function(){
					self.isRestarting = false;
					self.tonext();
				},myUnSlider.option.wait);
			}
		},false);
	},
	isRestarting:false,//标志是否重启中
	start_x:0//记录开始滑动的位置

}

/*$(function() {
	myUnSlider.init({
		speed:800,
		wait:2000,
		toslide:true//是否启动手机滑动切换
	});

});调用的时候*/