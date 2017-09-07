function writeTeach(obj,arr1,arr2,arr3,type,opt) {
	var fontSize;
	opt.is_phone?fontSize='':fontSize='24';
	var myChart = echarts.init(obj);
	var option = {
	    title:{
	    	show:false,
	        text: ''
	    },
	    tooltip:{
	        trigger:'item',
	        formatter:'{b}：{c}'+type,
	    	textStyle:{
	    		fontSize:fontSize
	    	}

	    },
	    legend:{
	        show:true,
	        data:['上课前','上课后'],
	        textStyle:{
	        	fontSize:fontSize
	        }
	    },
	    toolbox:{show:false},
	    calculable:false,  //可拖动
	    grid:{// 控制图的大小，调整下面这些值就可以，
	    	borderWidth:0,
         	y: 40,
        	y2: 40
	    },
	    xAxis:[
	        {
	            type : 'value',
	            axisLabel:{
	                formatter: '{value}'+type
	            },        
	            boundaryGap:[0, 0.01],
	            axisLine:{
	            	lineStyle:{
					    color:'#ccc',
					    width:2,
					    type:'solid'
					}
	            },
	            axisLabel:{
	            	textStyle:{
	            		fontSize:fontSize
	            	}
	            }
	        }
	    ],
	    yAxis:[
	        {
	            type : 'category',
	            splitLine:{show:false},
	            data : arr1,
	            axisLabel:{
	            	textStyle:{
	            		fontSize:12
	            	}
	            }
	        }
	    ],
	    series:[
	        {
	            name:'上课前',
	            type:'bar',
	            stack: '总量',
	            data:arr2
	        },
	        {
	            name:'上课后',
	            type:'bar',
	            stack: '总量',
	            data:arr3
	        }
	    ]
	};
	myChart.setOption(option);
};

function writemeter(obj) {	
	obj.myChart = echarts.init(obj);
	obj.option = {
	    tooltip : {
	    	show:false,
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	    toolbox: {
	        feature: {
	            restore: {},
	            saveAsImage: {}
	        }
	    },				    
	    series: [
	        {
	            name: '教学指数',
	            type: 'gauge',
	            startAngle:180,
	            endAngle:0,
	            radius:'140%',
	            center : ['50%','90%'],
	            detail: {show:false},
	            axisLine: { //仪表盘轴线样式 
	                lineStyle: { 
	                    width: 20,
	                    color:"#8ED0E7"
	                } 
	            },
                axisTick : { // 坐标轴小标记  
                	
                    splitNumber : 2, // 每份split细分多少段  
                    length : 12, // 属性length控制线长  
                    lineStyle : { // 属性lineStyle控制线条样式  
                        color : '#fff'  
                    }  
                }, 				            
	            splitLine: { //分割线样式 
	            	show:false,
	            	length: 20,
	            	lineStyle:{
	            		width:1
	            	}
	            }, 
	            splitNumber:10,
	            data: [{value: 0, name: '',show:false}]
	        }
	    ]
	};
	obj.myChart.setOption(obj.option);
	
	
	
	
	
	
};




function writeWater(obj,num) {
	if( num <= 1 ){
		$(obj).find('p').html(num);
		return false;
	}
    var timer = null;
    var i = 0;
    timer = setInterval(function () {
    	i++;
    	$(obj).find('p').html(i);
    	if (i==parseInt(num)) {
    		clearInterval(timer);
    	}
    },500/parseInt(num));				
	$(obj).find('div').stop().animate({'top':120-((num>100?100:num)/100*120)+'px'},500);
};


							
/**
 * 折线图
 * @author sunjie
 * @date    2016-07-22
 * @version [1.0]
 * @param   {string}   title 图表标题
 * @param   {array}   arr1  横轴数据
 * @param   {array}   arr2  [纵轴具体数据]
 */
//成长趋势折线图
function writeline(obj,arr1,arr2,title) {
	obj.option = {
	    title : {
	        text: title,
	        
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
	        show:false,      //图列
	        x:'right',
	        data:['得分']
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
	            name:'得分',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'#0495ca'
				    }
				},
				clickable:true,
	            data:arr2
	        }
	    ]
	};
	function eConsole(param) {
		var str = '';
		if (param.dataIndex==0) {
			str = param.name+param.data+'分';
		} else {
			if (param.data>=arr2[param.dataIndex-1]) {
				str = (param.name+param.data)+'分，比上个月增长'+(param.data-arr2[param.dataIndex-1])+'分';
			} else {
				str = (param.name+param.data)+'分，比上个月降低'+(arr2[param.dataIndex-1]-param.data)+'分';
			}
		}
		$('.txt2').html(str);
	}					
	obj.myChart = echarts.init(obj);
	obj.myChart.setOption(obj.option);
	obj.myChart.on('click', eConsole);
									
};
			
	

function writeTraintime(obj,arr1,arr2,opt) {//绘制完成人数图表
	var fontSize;
	opt.is_phone?fontSize='':fontSize='24'
	var myChart = echarts.init(obj);
	var option = {
	    title : {show:false},
	    tooltip : {
	        trigger: 'item',
	        textStyle:{
	        	fontSize:fontSize			
	        },
	        formatter : '{b}：{c}人'
	    },
	    legend: {
	        show:false,data:['人数']
	    },
	    toolbox: {show : false},
	    calculable : false,  //可拖动
	    xAxis : [
	        {
	            type : 'category',
	            splitLine:{show:false},
	            data : arr1,
	            axisLabel:{
	            	textStyle:{
	            		fontSize:fontSize,
	            		color:'black'
	            	}
	            }
	        }
	    ],
	    grid:{// 控制图的大小，调整下面这些值就可以，
	    	borderWidth:0,
         	x: 40,
        	x2: 40,
         	y: 40,
        	y2: 40
	    },
	    yAxis : [
	        {
	            type : 'value',	            
	            axisLine:{
	            	lineStyle:{
					    color: '#fff',
					    width: 1,
					    type: 'solid'
					}
	            },
	            axisLabel:{
	            	textStyle:{
	            		fontSize:fontSize,
	            		color:'black'
	            	}
	            }
	        }
	    ],
	    series : [
	        {
	            name:'得分',
	            type:'bar',
	            radius : '150%',
	            itemStyle: {
			    normal: {
			        	color:'#0496ca',
			        	label : {
	                        show : true,
	                        textStyle:{
	                        	color:'#333',
	                        	fontSize : fontSize,
	                            fontWeight : 'bold'
	                        },
	        				formatter: "{c}"
		                }
				    }
				},
	            data:arr2
	        }
	    ]
	};
	myChart.setOption(option);
};			
function writeErrorrate(obj,arr1,arr2,type,opt) {
	var fontSize; var fontSize2;
	if(opt.is_phone){
		fontSize='';
		fontSize2='';
	}else{
		fontSize='24';
		fontSize2='16';
	}
	var max = 0;
	for (var i = 0; i < arr2.length; i++) {
		if(max < arr2[i].value ) {
			max = arr2[i].value;
		}
	}
	var splitNumber = max*2 < 5 ? max*2 : 5;
	var myChart = echarts.init(obj);
	var option = {
	    title:{
	    	show:false,
	        text: ''
	    },
	    tooltip:{
	        trigger:'item',
	        formatter:'{b}：{c}'+type,
	        textStyle:{
	    		fontSize:fontSize
	    	}
	    },
	    legend:{
	        show:false,data:['知识点']
	    },
	    toolbox:{show:false},
	    calculable:false,  //可拖动
	    grid:{// 控制图的大小，调整下面这些值就可以，
	    	borderWidth:0,
       	x: 120,
      	x2: 40,
       	y: 40,
      	y2: 40
	    },
	    xAxis:[
	        {
	            type : 'value',
	            splitNumber: splitNumber,
	            axisLabel:{
	                formatter: '{value}'+type
	            },        
	            boundaryGap:[0, 0.01],
	            axisLine:{
	            	lineStyle:{
					    color:'#ccc',
					    width:2,
					    type:'solid'
					}
	            },
	            axisLabel:{
	            	textStyle:{
	            		fontSize:fontSize
	            	}
	            }
	        }
	    ],
	    yAxis:[
	        {
	            type : 'category',
	            splitLine:{show:false},
	            data : arr1,
	            axisLabel:{
	            	textStyle:{
	            		fontSize:fontSize2
	            	}
	            }
	        }
	    ],
	    series:[
	        {
	            name:'',
	            type:'bar',
	            max:100,
	            data:arr2,
	            itemStyle: {
			    	normal: {
			        	label : {
	                        show : true,
	                        textStyle:{
	                        	fontSize : fontSize,
	                            fontWeight : 'bold'
	                        }
		                }
				    }
				},
	        }
	    ]
	};
	myChart.setOption(option);
};	
function wirteResultcount(obj,arr) {
    var myChart = echarts.init(obj);
    var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b}<br/>{d}%",
		        textStyle:{
		        	fontSize:'24'
		        }
		    },
		    legend: {
		    	show:false,
		        data:['','','','']
		    },
		    toolbox: {
		        show : false
		    },
		    calculable : false,
		    series : [
		        {
		            type:'pie',
		            radius : ['45%', '75%'],
		            itemStyle : {
		                normal : {
		                    label : {
		                        show : true,
		        				formatter: "{b}:\n{d}%",
		        				textStyle : {
		                            fontWeight : 'bold'
		                        }
		                    },
		                    labelLine : {
		                        show : true
		                    }
		                },
		                emphasis : {
		                    label : {
		                        show : true,
		                        position : 'center',
		                        textStyle : {
		                            fontSize : '24',
		                            fontWeight : 'lighter'
		                        }
		                    }
		                }
		            },

		            data:arr
		        }
		    ]
		};
		myChart.setOption(option);
};	
			

function writeradar(options) {
	var fontColor = options.bg?'#000':'#fff';
	
	options.bg = options.bg||'#0496ca';
	options.line = options.line||'#0496ca';
	options.type = options.type||'dotted';
	options.color = options.color||'rgba(0,0,0,0)';
	options.show = options.show||false;
	
	
	
	var option = {
		backgroundColor:options.bg,
	    title : {
	    	show:false
	    },
	    tooltip : {
	    	show:options.show,
	        trigger: 'axis',
	        formatter : '{d}：{c}分'
	    },
	    legend: {
	    	show:false,
	        x : 'center',
	        data:['']
	    },
	    toolbox: {
	        show : false     //工具栏
	    },
	    calculable : false,  //可拖动
	    polar : [
	        {
	            indicator : options.name,
	            axisLine: {            // 坐标轴线
	                show: true,        // 默认显示，属性show控制显示与否
	                lineStyle:{
	                	type:'dashed'
	                }
	            },
	            splitArea : {
	                show : true,
	                areaStyle : {
	                    color: [options.bg,options.bg]
	                }
	            },
				name:{
				    textStyle: {
				    	color:fontColor
				    }
				}
	        }
	    ],					    
	    series : [
	        {
	            name: '',
	            type: 'radar',
	            data : [
	                {	
			            symbolSize:0,
			            itemStyle: {
			                normal: {
							    color: options.line,
							    lineStyle:{
								    width: 2,
								    type: options.type
							    },
							    areaStyle:{
							    	color:options.color
							    }
			                }
			            },
	                    value : options.value,
	                    name : ''
	                }
	            ]
	        }
	    ]
	};
	var my_chart = echarts.init(options.obj);
	my_chart.setOption(option);
	$(window).resize(function(){
		my_chart.resize();
	});
};				



function writeAchievements(obj,arr1,arr2,arr3) {
	var option = {
	    title : {
	    	show:false,
	        text: '教学成果课前课后对比',
	        subtext: '（错误人数对比）',
	        x:'left'
	    },
	    tooltip : {
	        trigger: 'axis',
	        backgroundColor:'#428bca',
	        axisPointer:{
	        	type:'line',
	        	lineStyle:{
	        		color:'#428bca',
	        		type:'dashed'
	        	}
	        },
	        textStyle:{
	        	fontSize:12			
	        },
	        formatter : function (params) {//具体值显示提示
            	var str = params[0].name+
              			'<br/>授课后错误降低：' + (params[1].data-params[0].data) +
                        '%<br/>上课前：' +params[0].data + '%<br/>上课后：' +params[1].data + '%';
            	return str;
            }
	    },
	    legend: {
	        show:true,      //图列
	        x:'left',
	        data:['课前','课后']
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
	                formatter: '{value} %'
	            },		            
	            axisLine:{
	            	lineStyle:{
					    color: '#ccc',
					    width: 1,
					    type: 'solid'
					}
	            }
	        }
	    ],
	    series : [
	        {
	            name:'课前',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'blue'
				    }
				},
				clickable:false,
	            data:arr2
	        },
	        {
	            name:'课后',
	            type:'line',
	            symbol:'emptyCircle',
	            symbolSize:4,
	            itemStyle: {
			    normal: {
			        	color:'orange'
				    }
				},
				clickable:false,
	            data:arr3
	        },
	    ]
	};

	echarts.init(obj).setOption(option);
};

function drawTraintime(opt){//大数据大屏饼图的方法
	var all_train_time = 0;
	for( var i = 0; i < opt.data.length; i++ ){
		all_train_time += opt.data[i].value;
	}
	$('.leftChart h4').html(Math.ceil(all_train_time*5)+'人');
	$('.logoOuter2 h3').html(all_train_time+'小时');
	var option = {
	    title : {
	        text: opt.skillname+'训练总时长',
	        subtext: all_train_time+'小时',
	        x:'center',
	        subtextStyle:{
	        	color:'#000'
	        }
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c}小时 ({d}%)",
	        textStyle : {
                fontSize : '16'
            }
	    },
	    
	    calculable : false,
	    series : [
	        {
	            name:opt.skillname,
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:opt.data,
	            itemStyle : {
	                normal : {
	                    label : {
	                        show : true,
	        				textStyle : {
	                            fontSize : '14'
	                        }
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                }
	            }
	        }
	    ]
	};

	echarts.init(opt.obj).setOption(option);
}

function drawExamPopulation(opt){//大数据大屏柱状图
	opt.skillname = opt.skillname || '';
	opt.count = opt.count || '';
	if( opt.skillname == '' || opt.count == '' ){
		opt.title = {};
	}else{
		/*opt.title = {
			text: opt.skillname+'/合计考试总人数',
	        subtext: opt.count+'人'
		};*/
		$('.leftChart h3').html(opt.skillname+'/合计考试总人数');
	}
	var option = {
	    //title : opt.title,
	    /*tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },*/
	    legend: {
	        selectedMode:true,
	        data:['考试人数','考试通过人数','预测考试人数','预测考试通过人数']
	    },
	    
	    calculable : false,
	    xAxis : [
	        {
	            type : 'category',
	            data : opt.xAxis
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            boundaryGap: [0, 0.1]
	        }
	    ],
	    series : [
	        {
	        	name:'考试通过人数',
	        	type:'bar',
	        	data:opt.arr1,
	        	stack:'sum'
	        },
	        {
	        	name:'考试人数',
	        	type:'bar',
	        	data:opt.arr2,
	        	stack:'sum'
	        },
	        {
	        	name:'预测考试通过人数',
	        	type:'bar',
	        	data:opt.arr3,
	        	stack:'sum1'
	        },
	        {
	        	name:'预测考试人数',
	        	type:'bar',
	        	data:opt.arr4,
	        	stack:'sum1'
	        }

	    ]
	};

	echarts.init(opt.obj).setOption(option);
}

function writeStudentCount(opt){//参赛学生数量环行图
	option = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x: 'left',
	        data:opt.legend_data,
	        textStyle : {
                fontSize : '14'
            }
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
	            radius: ['50%', '70%'],
	            avoidLabelOverlap: false,
	            
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            itemStyle : {
	                normal : {
	                    label : {
	                        show : true,
	        				formatter: "{b}:\n{d}%",
	        				textStyle : {
	                            fontSize : '14'
	                        }
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                },
	                emphasis : {
	                    label : {
	                        show : true,
	                        position : 'center',
	                        textStyle : {
	                            fontSize : '26'
	                        }
	                    }
	                }
	            },
	            data:opt.data
	        }
	    ]
	};
	echarts.init(opt.obj).setOption(option);
}

function write_bigdata_line(options) {//参赛学生成绩折线图
	if( $('.rightChartCon')[0].hasInit ){
		clearInterval(line_label_t); //切换成绩曲线每个点标签的定时器
	}
	$('.rightChartCon')[0].hasInit = 1;
	var obj = options.obj;

	options.linecolor = options.linecolor||['#08AF64','#05b3f1','#BA55D3'];
	
	
	obj.option = {
		
	    title : {
	        text: ''
	    },
	    tooltip : {
	        trigger: 'item',
	        // backgroundColor:'#0495ca',
	        textStyle:{
	        	fontSize:14
	        },
	        formatter : '{b} {a} {c}分'
	    },
	    legend: {
	        show:true,      //图列
	        x:'right',
	        padding:5,
	        itemGap:40,
	        textStyle:{
	        	fontSize:14
	        },
	        data:options.linename
	    },
	    toolbox: {
	        show : false     //工具栏
	    },
	    calculable : false,  //可拖动
	    xAxis : [
	        {
	            type : 'category',
	            nameTextStyle : {
		        	color:'white'
		        },
	            boundaryGap: false,
	            splitLine:{
	            	show:true,
	            	lineStyle:{
	            		color:'#ccc',
	            		width:0.5,
	            	}
	            },
	            axisLine:{
	            	lineStyle:{
					    // color: '#fff',
					    width: 1,
					    type: 'solid'
					}
	            },
	            axisLabel : {
	            	show:true,
	                formatter: '{value}',
	                textStyle:{
	            		fontSize:'14'
	            	}
	            },
	            data : options.name
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
	            	show:false,
	            	lineStyle:{
	            		type:'dotted'
	            	}
	            },
	            axisLabel : {
	            	show:true,
	                formatter: '{value}',
	                textStyle:{
	            		fontSize:'14'
	            	}
	            },		            
	            axisLine:{
	            	lineStyle:{
					    // color: '#fff',
					    width: 1,
					    type: 'solid'
					}
	            },
	            max:100
	        }
	    ],
	    series : []
	};
	
	for (var i = 0 ; i < options.value.length; i++) {
		obj.option.series.push(
	        {
	            name:options.linename[i],
	            type:'line',
	            symbol:'circle',
	            symbolSize:3,
	            itemStyle: {
			    normal: {
			        	color:options.linecolor[i]
				    }
				},
				clickable:true,
	            data:options.value[i]
	        }			
			
		)
		
		
	}
	
	obj.myChart = echarts.init(obj);
	obj.myChart.setOption(obj.option);
	
	var ecConfig = echarts.config;

	//可以获取有效的数据元素，数据元素属性包含坐标点和长宽（如果页面有变化需要重新获取）
	// var zrender = obj.myChart.getZrender();
	// var elements = zrender.storage._elements;
	// console.log(elements);
	// var counts = 0;
	// for( var i = 0; i < obj.option.series.length; i++ ){
	// 	counts += obj.option.series[i].data.length;
	// }
	// var times = 0;
	// var aKey = [];
	// for (var name in elements) {
	// 	//根据series中的一系列name值对elements进行归类排序，然后在进行hover
	// 	if (elements[name]._echartsData) {
	// 		aKey.push(name);
	// 	}
	// }
	// setTimeout(function(){
	// 	line_label_t = setInterval(function () {
	// 		var style = elements[aKey[times]].style;
	// 		//模拟坐标鼠标悬浮
	// 		zrender.trigger('mousemove', {
	// 			zrenderX: Math.ceil(style.x + style.width/2),
	// 			zrenderY: Math.ceil(style.y + style.height/2)
	// 		});		
		
	// 		times++;
	// 		times==counts?times=0:'';	
	// 	},1000);
	// },1000)
	
}

function write_graph(opt){//画关系图

	var myChart = echarts.init(opt.obj);
	myChart.showLoading();
	$.get('webkit-dep.json', function (webkitDep) {
	    myChart.hideLoading();

	    //从json文件组装成echarts需要的数据格式
	    webkitDep.legend = [];
	    webkitDep.categories = [];
	    webkitDep.nodes = [];
	    webkitDep.links = [];
	    webkitDep.parentindex = [];//记录父节点的索引

	    for( var i = 0; i < webkitDep.parent.length; i++ ){
	    	var parent = webkitDep.parent[i];
	    	webkitDep.legend.push(parent.name);
	    	var itemColor = parent.color?parent.color:''
	    	webkitDep.categories.push({'name':parent.name,'base':parent.name,itemStyle:{normal:{color:itemColor}}});

	    	if( opt.traintimeObj ){//如果传入每个大项的时长，就执行这一段，用来显示时长
		    	var name = parent.name;
		    	if( opt.traintimeObj[name] ){
					var traintime = opt.traintimeObj[name];
					parent.name = '训练总时长:'+traintime+'小时\n'+parent.name;
		    	}
		    	
		    	
		    }

	    	var source = webkitDep.nodes.push({'name':parent.name,'category':i,symbol:'pin',symbolSize:50,label:{normal:{show:true}}});
	    	source--;

	    	webkitDep.parentindex.push(source);//记录父节点的索引

	    	for (var j = 0; j < parent.children.length; j++){
	    		var children = parent.children;
	    		var target = webkitDep.nodes.push({'name':children[j],'category':i,symbolSize:20});
	    		target--;
	    		webkitDep.links.push({'source':source,'target':target});
	    	}
	    }

	    //添加一个大数据中心的节点，并和其他父节点相连
	    webkitDep.categories.push({'name':'大数据中心','base':'大数据中心',itemStyle:{normal:{color:'#A25F48'}}});
	    var bigsource = webkitDep.nodes.push({'name':'大数据中心','category':webkitDep.categories.length-1,symbolSize:80,symbol:'pin',label:{normal:{show:true,textStyle:{fontSize:26,fontWeight:'bold'}}}});
	    bigsource--;
	    webkitDep.parentindex.forEach(function(parent,index){
	    	if( index == webkitDep.parentindex.length-1 ){
	    		index = -1;
	    	}
			//webkitDep.links.push({'source':parent,'target':webkitDep.parentindex[index+1]});
			webkitDep.links.push({'source':bigsource,'target':parent});
	    });

	    //再添加一些游离的节点(随机生成每个category下的球的个数和大小)
	    for( var i = 0; i < webkitDep.categories.length-1; i++ ){

		    var randomNum = random_Num(1,15);//生成2-13之间的随机数,用作每个小球的个数
		    for ( var j = 0;  j < randomNum; j++ ){
		    	var randomSize = random_Num(11,20);//生成11-20之间的随机数,用作小球的大小
		    	webkitDep.nodes.push({'name':'','category':i,symbolSize:randomSize});
		    }
	    }
	    

	    console.log(webkitDep);

	    // webkitDep.nodes.forEach(function (node) {//设置球的大小
	    //     node.symbolSize = 15;
	    // });

	    option = {
	        legend: {
	            data: webkitDep.legend,
	            textStyle:{
		        	fontSize:'16'
		        }
	        },
	        series: [{
	            type: 'graph',
	            layout: 'force',
	            animation: false,
	            label: {
	                normal: {
	                    position: 'right',
	                    formatter: '{b}',
	                    textStyle:{
		            		fontSize:'20',
		            		fontWeight:'bold'
		            	}
	                }
	            },
	            draggable: true,
	            lineStyle:{
	            	normal:{
	            		width:2,//线的粗细
	            		color:'#000000'
	            	}
	            },
	            data: webkitDep.nodes.map(function (node, idx) {
	                node.id = idx;
	                return node;
	            }),
	            categories: webkitDep.categories,
	            force: {
	                initLayout: 'squarer',
	                // gravity: 0
	                // repulsion: 20,
	                edgeLength: 50,//连线的长度
	                repulsion: 100//梳密程度
	            },
	            edges: webkitDep.links
	        }]
		};

		myChart.setOption(option);
		myChart.on('click', function (params) {
			if( params.name == '待添加' || params.name == '教学' || params.name == '训练' || params.name == '考试' || params.name == '评价' || params.name == '管理' || params.name == '比赛' || params.name == ''|| params.name == '大数据中心'){
				return false;
			}
			
		    opt.fn(params);//点击事件相应的方法,调用时传入
		});
		// console.log(myChart._api.getZr());
	});
}

function random_Num(from,to){//生成x到y之间的随机数
	var randomNum = parseInt(Math.random()*(to-from+1))+from;
	return randomNum;
}



