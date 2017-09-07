		$(function() {
			//手机端头部
			$('body').prepend(
				'<div class="header">'+
					'<img src="img/wap_logo.png" class="logo"/>'+
					'<button class="spread_btn"><i class="icon iconfont icon-list"></i></button>'+
				'</div>'+

				//pc端头部和导航
				'<div class="pc_header">'+
					'<div class="pc_header_con limitwidth">'+
						'<img src="img/wap_logo.png" class="logo"/>'+
						'<ul>'+
							'<a href="index.html"><li class="pc_nav_li"><span>首页</span></li></a>'+
							'<li class="pc_nav_li">'+
								'<span>解决方案<i class="icon iconfont icon-arrow_unfold"></i></span>'+
								'<div class="sub_nav">'+
									'<div class="sub_nav_con limitwidth">'+
										'<a href="medical-school-solution.html">'+
											'<div class="solution">'+
												'<h5>医学院解决方案</h5>'+
												'<img src="img/solutiondropdown1.jpg">'+
												'<button>查看更多<i class="icon iconfont icon-arrow_next"></i></button>'+
											'</div>'+
										'</a>'+
										'<a href="hospital-solution.html">'+
											'<div class="solution">'+
												'<h5>医院解决方案</h5>'+
												'<img src="img/solutiondropdown2.jpg">'+
												'<button>查看更多<i class="icon iconfont icon-arrow_next"></i></button>'+
											'</div>'+
										'</a>'+
										'<a href="higher-vocational-college.html">'+
											'<div class="solution">'+
												'<h5>医学高职高专解决方案</h5>'+
												'<img src="img/solutiondropdown3.jpg">'+
												'<button>查看更多<i class="icon iconfont icon-arrow_next"></i></button>'+
											'</div>'+
										'</a>'+
									'</div>'+
								'</div>'+
							'</li>'+
							'<li class="pc_nav_li">'+
								'<span>产品<i class="icon iconfont icon-arrow_unfold"></i></span>'+
								'<div class="sub_nav">'+
									'<div class="sub_nav_con limitwidth">'+
										'<div class="product clearfix">'+
											'<div>'+
												'<h5>虚拟仿真训练机器人</h5>'+
												'<a href="mis-puncture.html"><span>综合穿刺智能训练系统</span></a>'+
												'<a href="mis-emergency.html"><span>情境化综合急救智能训练系统</span></a>'+
												'<a href="mis-laparo-rst.html"><span>腹腔镜手术智能训练系统（住院医师版）</span></a>'+
												'<a href="mis-laparo-vt.html"><span>腹腔镜手术智能训练系统（虚实结合版）</span></a>'+
												'<a href="mis-cvc.html"><span>中心静脉穿刺智能训练系统</span></a>'+
												'<a href="mis-airway.html"><span>气道管理智能训练系统</span></a>'+
												'<a href="mis-mit.html"><span>医学影像检查训练系统</span></a>'+
												'<a href="mis-mid.html"><span>医学影像诊断教学系统</span></a>'+
												'<a href="mis-uc.html"><span>导尿术智能训练系统</span></a>'+
											'</div>'+
											'<div>'+
												'<h5>&nbsp;</h5>'+
												'<a href="mis-clyster.html"><span>灌肠术智能训练系统</span></a>'+
												'<a href="mis-put-tube.html"><span>综合置管智能训练系统</span></a>'+
												'<a href="mis-nasal-feeding.html"><span>鼻饲术、胃肠减压术智能训练系统</span></a>'+
												'<a href="mis-sengstaken-blakemore-tube.html"><span>三腔二囊管止血术智能训练系统</span></a>'+
												'<a href="mis-wash-stomach.html"><span>洗胃术智能训练系统</span></a>'+
												'<a href="mis-sputum-suction.html"><span>吸痰术智能训练系统</span></a>'+
											'</div>'+
											'<div>'+
												'<h5>信息化系统</h5>'+
												'<a href="smart-class.html"><span>医学智能一体化课堂</span></a>'+
												'<a href="osce-system.html"><span>OSCE考试智能管理系统</span></a>'+
												'<a href="medical-online-study-system.html"><span>医学在线学习系统</span></a>'+
												'<a href="skill-center-system.html"><span>医学技能中心运营管理系统</span></a>'+
												'<a href="skill-train-analyze-system.html"><span>技能训练智能分析系统</span></a>'+
												'<a href="skill-train-manage-system.html"><span>技能中心自主训练管理系统</span></a>'+
												'<a href="bigdata-evaluate-system.html"><span>临床技能大数据与形成性评价系统</span></a>'+
											'</div>'+
											'<h3><a href="product-robot.html"><button class="product_more_btn">查看更多<i class="icon iconfont icon-arrow_next"></i></button></a></h3>'+
										'</div>'+
									'</div>'+

								'</div>'+
							'</li>'+
							'<a href="service.html"><li class="pc_nav_li"><span>服务</span></li></a>'+
							'<a href="technology.html"><li class="pc_nav_li"><span>技术</span></li></a>'+
							'<a href="partner.html"><li class="pc_nav_li"><span>合作伙伴</span></li></a>'+
							'<a href="aboutus.html"><li class="pc_nav_li"><span>关于我们</span></li></a>'+
						'</ul>'+
					'</div>'+
				'</div>'

			);
			$('body').append(
				//手机端页脚
				'<div class="footer">'+
					'<ul class="clearfix">'+
						'<li><a href="legal-notice.html">法律声明</a></li>'+
						'<li><a href="privacy-protection.html">隐私保护</a></li>'+
						'<li><a href="contactus.html">联系我们</a></li>'+
					'</ul>'+
					'<p>版权所有©苏州敏行医学信息技术有限公司<br/>苏ICP备11042841号</p>'+
				'</div>'+
				//手机端导航
				'<div class="nav">'+
					'<div class="navinner">'+
						'<a href="index.html">'+
							'<li>'+
								'<span style="color:#4896FC;">首页</span>'+
								'<i class="icon iconfont icon-close cancel_nav" style="font-size:26px;"></i>'+
							'</li>'+
						'</a>'+
						'<ul class="father_ul">'+
							'<div class="father_div">'+
								'<li><span>解决方案</span><i class="icon iconfont icon-arrow_unfold"></i></li>'+
								'<ul class="child_ul">'+
									'<a href="medical-school-solution.html"><li><span>医学院解决方案</span></li></a>'+
									'<a href="hospital-solution.html"><li><span>医院解决方案</span></li></a>'+
									'<a href="higher-vocational-college.html"><li><span>医学高职高专解决方案</span></li></a>'+
								'</ul>'+
							'</div>'+
							'<div class="father_div">'+
								'<li><span>产品</span><i class="icon iconfont icon-arrow_unfold"></i></li>'+
								'<ul class="child_ul">'+
									'<h5>虚拟仿真训练机器人</h5>'+
									'<a href="mis-puncture.html"><li><span>综合穿刺智能训练系统</span></li></a>'+
									'<a href="mis-emergency.html"><li><span>情境化综合急救智能训练系统</span></li></a>'+
									'<a href="mis-laparo-rst.html"><li><span>腹腔镜手术智能训练系统（住院医师版）</span></li></a>'+
									'<a href="mis-laparo-vt.html"><li><span>腹腔镜手术智能训练系统（虚实结合版）</span></li></a>'+
									'<a href="product-robot.html"><li><span>…查看更多</span></li></a>'+
									'<h5>信息化系统</h5>'+
									'<a href="smart-class.html"><li><span>医学智能一体化课堂</span></li></a>'+
									'<a href="osce-system.html"><li><span>OSCE考试智能管理系统</span></li></a>'+
									'<a href="medical-online-study-system.html"><li><span>医学在线学习系统</span></li></a>'+
									'<a href="skill-center-system.html"><li><span>医学技能中心运营管理系统</span></li></a>'+
									'<a href="skill-train-analyze-system.html"><li><span>技能训练智能分析系统</span></li></a>'+
									'<a href="skill-train-manage-system.html"><li><span>技能中心自主训练管理系统</span></li></a>'+
									'<a href="bigdata-evaluate-system.html"><li><span>临床技能大数据与形成性评价系统</span></li></a>'+
								'</ul>'+
							'</div>'+
							'<a href="service.html">'+
								'<div>'+
									'<li><span>服务</span><i class="icon iconfont icon-arrow_next"></i></li>'+
								'</div>'+
							'</a>'+
							'<a href="technology.html">'+
								'<div>'+
									'<li><span>技术</span><i class="icon iconfont icon-arrow_next"></i></li>'+
								'</div>'+
							'</a>'+
							'<a href="partner.html">'+
								'<div>'+
									'<li><span>合作伙伴</span><i class="icon iconfont icon-arrow_next"></i></li>'+
								'</div>'+
							'</a>'+
							'<a href="aboutus.html">'+
								'<div>'+
									'<li><span>关于我们</span><i class="icon iconfont icon-arrow_next"></i></li>'+
								'</div>'+
							'</a>'+
								
						'</ul>'+
					'</div>'+
				'</div>'+
				//手机端浮动按钮
				'<div class="to_top"><i class="icon iconfont icon-up"></i></div>'+

				//pc端页脚
				'<div class="pc_footer">'+
					'<div class="pc_footer_con limitwidth">'+
						'<p>版权所有©苏州敏行医学信息技术有限公司&nbsp;&nbsp;苏ICP备11042841号</p>'+
						'<ul class="clearfix"><li><a href="legal-notice.html">法律声明</a></li><li><a href="privacy-protection.html">隐私保护</a></li><li><a href="contactus.html">联系我们</a></li></ul>'+
					'</div>'+
				'</div>'
			);

			$('.father_div').click(function() {

				if( $(this).find('.child_ul').css('display') == 'block' ){
					$(this).find('.child_ul').slideUp();//把之前展开开过的收起
					$(this).children('li').removeClass('father_li_on');
				}else{
					$('.child_ul').slideUp();
					$(this).find('.child_ul').slideDown();//展开
					$('.father_div').children('li').removeClass('father_li_on');
					$(this).children('li').addClass('father_li_on');
				}

			});

			$('.spread_btn').click(function() {//显示导航
				$('.nav').animate({top:'0',opacity:'1'},500,function(){
					/*隐藏除导航之外的元素*/
					$('.header').addClass('phone_hidden');
					$('._body').addClass('phone_hidden');
					$('.footer').addClass('phone_hidden');
				});
				setTimeout(function(){
					$('.nav').css({
						top: '0',
						opacity: '1'
					});
					/*隐藏除导航之外的元素*/
					$('.header').addClass('phone_hidden');
					$('._body').addClass('phone_hidden');
					$('.footer').addClass('phone_hidden');
				},500);
				$('.nav').attr('_show', true);
				show_to_top();
			});
			$('.nav a').click(function(event) {
				event.stopPropagation();
				/*导航之外的元素显示*/
				$('.header').removeClass('phone_hidden');
				$('._body').removeClass('phone_hidden');
				$('.footer').removeClass('phone_hidden');

				$('.child_ul').slideUp();
				$('.father_div').children('li').removeClass('father_li_on');
				$('.nav').css({top:'110%',opacity:'0'});

				$('.nav').attr('_show', false);
				show_to_top();
			});
			$('.cancel_nav').click(function(event) {//关闭导航
				event.stopPropagation();
				/*导航之外的元素显示*/
				$('.header').removeClass('phone_hidden');
				$('._body').removeClass('phone_hidden');
				$('.footer').removeClass('phone_hidden');

				$('.child_ul').slideUp();
				$('.father_div').children('li').removeClass('father_li_on');
				$('.nav').css({
					top: '110%',
					opacity: '0'
				});

				$('.nav').attr('_show', false);
				show_to_top();
				return false;
			});

			//点击上箭头页面滚动到顶部
			$('.to_top').on('touchstart', function(event) {
				event.preventDefault();
				$(this).toggleClass('to_top_on');
			});
			$('.to_top').on('touchend', function(event) {
				event.preventDefault();
				$(this).toggleClass('to_top_on');
				if( !$('.nav').attr('_show') || $('.nav').attr('_show') == 'false' ){
					document.querySelector('body').scrollIntoView();
				}else{
					document.querySelector('.navinner').scrollIntoView();
				}
			});
			$(window).scroll(function () {
				show_to_top();
			});
			$('.nav').scroll(function(event) {
				show_to_top();
			});
			function show_to_top(){//控制向上滚动按钮的显示与隐藏
				if( !$('.nav').attr('_show') || $('.nav').attr('_show') == 'false' ){
					if ( $(document).scrollTop() > 100 ) {
						$('.to_top').addClass('to_top_show');
					}else{
						$('.to_top').removeClass('to_top_show');
					}
				}else{
					if ( $('.nav').scrollTop() > 100 ) {
						$('.to_top').addClass('to_top_show');
					}else{
						$('.to_top').removeClass('to_top_show');
					}
				}
			}

		});

		function pc_tab_emphasis(tabname){//给pc端当前的tab加选中样式
			var arr = ['首页','解决方案','产品','服务','技术','合作伙伴','关于我们'];
			$(arr).each(function(index, el) {
				if( el == tabname ){
					$('.pc_header li').eq(index).addClass('pc_tab_on');
					return false;
				}
			});
		}