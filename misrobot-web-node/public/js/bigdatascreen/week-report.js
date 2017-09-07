/*本周老师报告（封装为一个组件）*/
var c_teacher_week = {
	template:
		'<div class="reportcontrol">'+
			'<h2 class="report_tit">'+
				'本周老师情况'+
			'</h2>'+
			'<div class="report_outer">'+
				'<div class="report_item_con report_item_con1">'+
					'<p class="report_item_tit report_item_tit_blue">{{scorechange}}</p>'+
					'<div class="report_item1 clearfix">'+
						'<div class="report_item1_left">'+
							'<p class="greytext">老师平均分</p>'+
							'<div class="chartcontrol chart1 teacher_chart1"></div>'+
						'</div>'+
						'<div class="report_item1_right">'+
							'<p class="greytext">最受欢迎的教师TOP3<br/>(分数=学生主观评价平均分)</p>'+
							'<div class="top3item" v-for="(item,index) in welcometeacher" v-if="index<3">'+
								'<h3>NO.{{index+1}}<span>{{item.name}}</span></h3>'+
								'<div class="clearfix">'+

									'<span>{{item.data}}分</span>'+
									'<span class="up_icon" v-if="item.up>0"></span>'+
									'<span class="down_icon" v-else-if="item.up<0"></span>'+
									'<span v-else-if="item.up==0">上周持平</span>'+
									'<span v-else>暂无比较</span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="report_item_con">'+
					'<p class="report_item_tit report_item_tit_blue">{{classtimechange}}</p>'+
					'<p class="greytext">老师学时统计</p>'+
					'<div class="chartcontrol teacher_chart2">'+
					'</div>'+
				'</div>'+

				'<div class="report_item_con report_item_con2">'+
					'<p class="report_item_tit">最勤奋教师TOP3(本周实际学时)</p>'+
					'<div class="clearfix">'+
						'<div class="top3item top3item2" v-for="(item,index) in hardworkingteacher" v-if="index<3">'+
							'<h3>NO.{{index+1}}<span>{{item.name}}</span></h3>'+
							'<div class="clearfix">'+

								'<span>{{item.data}}学时</span>'+
								'<span class="up_icon" v-if="item.up>0"></span>'+
								'<span class="down_icon" v-else-if="item.up<0"></span>'+
								'<span v-else-if="item.up==0">上周持平</span>'+
								'<span v-else>暂无比较</span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>',
	props:['teacherscorereport','teacherclassreport','swiper_ready'],
	data: function () {
		return {

		}
	},
	methods: {
        
    },
	computed:{
		scorechange:function(){//计算老师本周得分变化
			if(this.teacherscorereport.weekvecotr){
				var length = this.teacherscorereport.weekvecotr.length;
				if( length < 2 ){
					return '暂无比较';
				}else{
					var scorechange = this.teacherscorereport.weekvecotr[length-1] - this.teacherscorereport.weekvecotr[length-2];
					if ( scorechange > 0 ){
						return '本周老师得分上升'+scorechange+'分(过往10次的平均分)';
					}else if( scorechange == 0 ){
						return '本周老师得分和上周持平';
					}else{
						return '本周老师得分下降'+(-scorechange)+'分(过往10次的平均分)';
					}
					
				}			
			}else{
				return '';
			}

		},
		classtimechange:function(){//计算老师完成计划学时百分比变化
			if(this.teacherclassreport.classweekvecotr){
				var length = this.teacherclassreport.classweekvecotr.length;
				if( length < 2 ){
					return '暂无比较';
				}else{
					//和上周百分比变化
					var classtimechange = 
						this.teacherclassreport.classweekvecotr[length-1].realhour/this.teacherclassreport.classweekvecotr[length-1].planhour*100
						-
						this.teacherclassreport.classweekvecotr[length-2].realhour/this.teacherclassreport.classweekvecotr[length-2].planhour*100;
					if( classtimechange > 0 ){
						return '本周老师学时完成计划学时,环比上升'+classtimechange.toFixed(1)+'%';
					}else if( classtimechange == 0 ){
						return '本周老师学时完成计划学时和上周持平';
					}else{
						return '本周老师学时完成计划学时,环比下降'+(-classtimechange).toFixed(1)+'%';
					}
				}
			}else{
				return '';
			}
			
		},
		welcometeacher:function(){//本周得分top3老师
			return this.teacherscorereport.order;
		},
		hardworkingteacher:function(){//本周top3勤奋老师
			return this.teacherclassreport.order;
		}
	},
	mounted:function(){
		
	},
	watch:{
		swiper_ready:function(_val,oldval){
			var self = this;
			if( _val == true ){
				(function(){
					//老师学时统计
					var val = self.teacherclassreport.classweekvecotr;
					var xAxis_data = []; var data = {}; data.actual = []; data.plan = [];
					$(val).each(function(index, el) {
						xAxis_data.push(index+1);
						var text = '';
						if (val.length == index+1){
							text = '本周';
						}
						data.actual.push({value:el.realhour,text:''});
						data.plan.push({value:el.planhour,text:text});
					});
					$('.teacher_chart2').each(function(i,el) {
						var element = $(this)[0];
						multi_bar({
							element:element,
							legend:['教师计划学时(h)','教师实际学时(h)'],
							xAxis_data:xAxis_data,
				            data:data
						});
					});
					
				})();

				(function(){
					//老师平均分图表
					var val = self.teacherscorereport.weekvecotr;
					var xAxis_data = []; var data = [];
					$(val).each(function(index, el) {
						xAxis_data.push(index+1);
						var text = '';
						if (val.length == index+1){
							text = '本周';
						}
						data.push({value:el,text:text});
					});
					$('.teacher_chart1').each(function(i, el) {
						var element = $(this)[0];
						single_bar({
							element:element,
							xAxis_data:xAxis_data,
							data:data
						});
					});
					
				})();

			}
		}

	}
}

/*本周学生报告（封装为一个组件）*/
var c_student_week = {
	template:
		'<div class="reportcontrol">'+
			'<h2 class="report_tit">'+
				'本周学生情况'+
			'</h2>'+
			'<div class="report_outer">'+
				'<div class="report_item_con report_item_con1">'+
					'<p class="report_item_tit report_item_tit_blue">{{scorechange}}</p>'+
					'<div class="report_item1 clearfix">'+
						'<div class="report_item1_left">'+
							'<p class="greytext">学生平均分</p>'+
							'<div class="chartcontrol chart1 student_chart1"></div>'+
						'</div>'+
						'<div class="report_item1_right">'+
							'<p class="greytext">评价最好的学生TOP3<br/>(分数=老师主观评价平均分)</p>'+
							'<div class="top3item" v-for="(item,index) in welcomestudent" v-if="index<3">'+
								'<h3>NO.{{index+1}}<span>{{item.name}}</span></h3>'+
								'<div class="clearfix">'+

									'<span>{{item.data}}分</span>'+
									'<span class="up_icon" v-if="item.up>0"></span>'+
									'<span class="down_icon" v-else-if="item.up<0"></span>'+
									'<span v-else-if="item.up==0">上周持平</span>'+
									'<span v-else>暂无比较</span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="report_item_con">'+
					'<p class="report_item_tit report_item_tit_blue">{{classtimechange}}</p>'+
					'<p class="greytext">学生学时统计</p>'+
					'<div class="chartcontrol student_chart2">'+
					'</div>'+
				'</div>'+

				'<div class="report_item_con">'+
					'<p class="report_item_tit">'+
						'TOP10缺勤学生(本榜单仅提供上课出勤,如有调休/出差等请联系运营人员修改)'+
					'</p>'+
					'<div class="clearfix">'+
						'<table class="absenttable">'+
							'<tr>'+
								'<th></th>'+
								'<th>NO.1</th>'+
								'<th>NO.2</th>'+
								'<th>NO.3</th>'+
								'<th>NO.4</th>'+
								'<th>NO.5</th>'+
								'<th>NO.6</th>'+
								'<th>NO.7</th>'+
								'<th>NO.8</th>'+
								'<th>NO.9</th>'+
								'<th>NO.10</th>'+
							'</tr>'+
							'<tr>'+
								'<td>姓名</td>'+
								'<td v-for="(item,index) in absentstudent" v-if="index<10">{{item.name}}</td>'+
							'</tr>'+
							'<tr>'+
								'<td>缺勤<br/>次数</td>'+
								'<td v-for="(item,index) in absentstudent" v-if="index<10">{{item.data}}</td>'+
							'</tr>'+
						'</table>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>',
	props:['studentscorereport','studentclassreport','swiper_ready'],
	data: function () {
		return {
			
		}
	},
	methods: {

    },
	computed:{
		scorechange:function(){//计算学生本周得分变化
			if(this.studentscorereport.weekvecotr){
				var length = this.studentscorereport.weekvecotr.length;
				if( length < 2 ){
					return '暂无比较';
				}else{
					var scorechange = this.studentscorereport.weekvecotr[length-1] - this.studentscorereport.weekvecotr[length-2];
					if ( scorechange > 0 ){
						return '本周学生得分上升'+scorechange+'分(过往10次的平均分)';
					}else if( scorechange == 0 ){
						return '本周学生得分和上周持平';
					}else{
						return '本周学生得分下降'+(-scorechange)+'分(过往10次的平均分)';
					}
					
				}
			}else{
				return '';
			}

		},
		classtimechange:function(){//计算学生完成计划学时百分比变化
			if(this.studentclassreport.classweekvecotr){
				var length = this.studentclassreport.classweekvecotr.length;
				if( length < 2 ){
					return '暂无比较';
				}else{
					//和上周百分比变化
					var classtimechange = 
						this.studentclassreport.classweekvecotr[length-1].realhour/this.studentclassreport.classweekvecotr[length-1].planhour*100
						-
						this.studentclassreport.classweekvecotr[length-2].realhour/this.studentclassreport.classweekvecotr[length-2].planhour*100;
					if( classtimechange > 0 ){
						return '本周学生学时完成计划学时,环比上升'+classtimechange.toFixed(1)+'%';
					}else if( classtimechange == 0 ){
						return '本周学生学时完成计划学时和上周持平';
					}else{
						return '本周学生学时完成计划学时,环比下降'+(-classtimechange).toFixed(1)+'%';
					}
				}
			}else{
				return '';
			}

		},
		welcomestudent:function(){//本周得分top3学生
			return this.studentscorereport.order;
		},
		absentstudent:function(){
			var absentstudent = [];
			if(this.studentclassreport.order){
				if( this.studentclassreport.order.length > 0 ){
					absentstudent = this.studentclassreport.order;
					var absentstudent_length = absentstudent.length;
					if( absentstudent_length < 10 ){
						for( var i = 0; i < 10-absentstudent_length; i++ ){
							absentstudent.push({data:'',name:''});
						}
					}
				}else{
					for( var i = 0; i < 10; i++ ){
						absentstudent.push({data:'',name:''});
					}
				}
			}
			
			return absentstudent;
		}
	},
	mounted:function(){

	},
	watch:{
		studentscorereport:function(val,oldval){
			(function(){
				//学生平均分图表
				val = val.weekvecotr;
				var xAxis_data = []; var data = [];
				$(val).each(function(index, el) {
					xAxis_data.push(index+1);
					var text = '';
					if (val.length == index+1){
						text = '本周';
					}
					data.push({value:el,text:text});
				});
				single_bar({
					element:$('.student_chart1')[0],
					xAxis_data:xAxis_data,
					data:data
				});
			})();

		},
		studentclassreport:function(val,oldval){
			(function(){
				//学生学时统计
				val = val.classweekvecotr;
				var xAxis_data = []; var data = {}; data.actual = []; data.plan = [];
				$(val).each(function(index, el) {
					xAxis_data.push(index+1);
					var text = '';
					if (val.length == index+1){
						text = '本周';
					}
					data.actual.push({value:el.realhour,text:''});
					data.plan.push({value:el.planhour,text:text});
				});
				multi_bar({
					element:$('.student_chart2')[0],
					legend:['学生计划学时(h)','学生实际学时(h)'],
					xAxis_data:xAxis_data,
		            data:data
				});
			})();
			
		}
	}
}

/*本周教学环境（封装为一个组件）*/
var c_environment_week = {
	template:
		'<div class="reportcontrol">'+
			'<h2 class="report_tit">'+
				'本周教学环境'+
			'</h2>'+
			'<div class="report_outer">'+
				'<div class="report_item_con report_item_con1">'+
					'<p class="report_item_tit report_item_tit_blue">'+
						'本周共{{teacherclasstimes[7]}}位老师上课'+
					'</p>'+
					'<div class="chartcontrol chart1 environment_report_chart1">'+

					'</div>'+
				'</div>'+
				'<div class="report_item_con">'+
					'<p class="report_item_tit report_item_tit_blue">'+
						'本周共{{studentclasstimes[7]}}位学生上课'+
					'</p>'+
					'<div class="chartcontrol chart1 environment_report_chart2">'+

					'</div>'+
				'</div>'+
			'</div>'+
		'</div>',
	props:['teacherclasstimes','studentclasstimes','swiper_ready'],
	data: function () {
		return {
			
		}
	},
	methods: {
        
    },
	computed:{
		
	},
	mounted:function(){
		
	},
	watch:{
		swiper_ready:function(_val,oldval){
			var self = this;
			if( _val == true ){
				(function(){
					var val = self.teacherclasstimes;
					var week_arr = ['周一','周二','周三','周四','周五','周六','周日'];
					//本周教师人次折线图
					var xAxis_data = []; var data = [];
					$(val).each(function(index, el) {
						if(index > 6){
							return false;
						}
						xAxis_data.push(week_arr[index]);
						data.push(el);
					});
					$('.environment_report_chart1').each(function(i, el) {
						var element = $(this)[0];
						draw_line({
							element:element,
							linecolor:'#F0991C',
							xAxis_data:xAxis_data,
							yAxis_name:'教师人次',
							data:data
						});
					});
				})();

				(function(){
					var val = self.studentclasstimes;
					var week_arr = ['周一','周二','周三','周四','周五','周六','周日'];
					//本周学生人次折线图
					var xAxis_data = []; var data = [];
					$(val).each(function(index, el) {
						if(index > 6){
							return false;
						}
						xAxis_data.push(week_arr[index]);
						data.push(el);
					});
					$('.environment_report_chart2').each(function(i, el) {
						var element = $(this)[0];
						draw_line({
							element:element,
							linecolor:'#7DDF64',
							xAxis_data:xAxis_data,
							yAxis_name:'学生人次',
							data:data
						});
					});
					
				})();
			}
		}
	}
}
// reportcontrol2

function single_bar(opt){//绘制单个的柱状图
	var my_chart = echarts.init(opt.element);
	var option = {
		textStyle: {
            color: '#5E616A',
            fontWeight: 'normal'
        },
        title :{
            show:false
        },
        color: ['#116FCB'],//柱子的颜色
        tooltip : {//提示框
        	show:false,
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        grid: {//控制图表的边距
            left: '3%',
            right: '13%',
            bottom: '0%',
            containLabel: true,
            show:true,
            backgroundColor:'rgba(22, 24, 35, 0.95)',
            borderColor:'transparent'
            
        },
        xAxis :{
        	name : '周',
            type : 'category',
            data : opt.xAxis_data,
            axisTick: {//x轴的刻度
                show: false
            }
        },
        yAxis : 
        {
            name : '分数',
            type : 'value',
            axisTick: {//x轴的刻度
                show: false
            },
            min:70,
            interval:2
        },
        series : [
            {
                name:'分数',
                type:'bar',
                barWidth: '32%',
                itemStyle: {
                    normal: {
                    	barBorderRadius:[5,5,0,0],
                        label: {
                            textStyle: {
                                color: '#116FCB'
                            },
                            formatter:function(a){
                                return a.data.text;
                            },
                            show: true,
                            position: 'top',
                        }
                    }
                },
                data:opt.data
            }
        ]
	};
	my_chart.setOption(option);
	$(window).resize(function(){
		my_chart.resize();
	});
}

function multi_bar(opt){//绘制堆叠柱状图
	var my_chart = echarts.init(opt.element);
	var option = {
		textStyle: {
            color: '#5E616A',
            fontWeight: 'normal'
        },
        title :{
            show:false
        },
        color: ['#56B2BA','#CC49A3'],//柱子的颜色
        tooltip : {//提示框
        	show:false,
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        legend: {
	        data:opt.legend,
	        textStyle:{
	        	color:'#5E616A'
	        },
	        right:0,
	        itemWidth:10,
	        itemHeight:10
	    },
        grid: {//控制图表的边距
            left: '3%',
            right: '10%',
            bottom: '0%',
            containLabel: true,
            show:true,
            backgroundColor:'rgba(22, 24, 35, 0.95)',
            borderColor:'transparent'
            
        },
        xAxis :{
        	name : '周',
            type : 'category',
            data : opt.xAxis_data,
            axisTick: {//x轴的刻度
                show: false
            }
        },
        yAxis : 
        {
            name : '学时',
            type : 'value',
            axisTick: {//x轴的刻度
                show: false
            },
            splitNumber:3,
            min:680,
            interval:40
        },
        series : [
            {
                name:opt.legend[0],
                type:'bar',
                barWidth: '20%',
                barGap:0,
                itemStyle: {
                    normal: {
                    	barBorderRadius:[5,5,0,0],
                        label: {
                            textStyle: {
                                color: '#116FCB'
                            },
                            formatter:function(a){
                                return a.data.text;
                            },
                            show: true,
                            position: 'top',
                        }
                    }
                },
                data:opt.data.plan
            },
            {
                name:opt.legend[1],
                type:'bar',
                barWidth: '20%',
                barGap:0,
                itemStyle: {
                    normal: {
                    	barBorderRadius:[5,5,0,0],
                        label: {
                            textStyle: {
                                color: '#116FCB'
                            },
                            formatter:function(a){
                                return a.data.text;
                            },
                            show: true,
                            position: 'top',
                        }
                    }
                },
                data:opt.data.actual
            }
        ]
	};
	my_chart.setOption(option);
	$(window).resize(function(){
		my_chart.resize();
	});
}

function draw_line(opt){
	var my_chart = echarts.init(opt.element);
	var option = {
		textStyle: {
            color: '#5E616A',
            fontWeight: 'normal'
        },
        title :{
            show:false
        },
        color: [opt.linecolor],//线的颜色
        tooltip : {//提示框
        	show:false,
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        grid: {//图表网格区域
            left: '3%',//控制图表的边距
            right: '0',
            bottom: '0',
            containLabel: true,
            show:true,
            backgroundColor:'rgba(22, 24, 35, 0.95)',
            borderColor:'transparent'
            
        },
        xAxis :{
            type : 'category',
            data : opt.xAxis_data,
            axisTick: {//x轴的刻度
                show: false
            }
        },
        yAxis : 
        {
            name : opt.yAxis_name,
            type : 'value',
            axisTick: {//x轴的刻度
                show: false
            }
        },
        series : [
            {
                name:opt.yAxis_name,
                type:'line',
                areaStyle: {normal: {opacity:0.1,shadowOffsetY:10}},
                data:opt.data
            }
        ]
	};
	my_chart.setOption(option);
	$(window).resize(function(){
		my_chart.resize();
	});
}