function draw_line(opt){
	var fontSize = opt.fontSize || 14;
	var my_chart = echarts.init(opt.element);
	var option = {
		textStyle: {
			// color:'#ffffff',
            fontWeight: 'normal',
            fontSize:fontSize
        },
        title :{
            show:false
        },
        color: ['#3499DB'],//线的颜色
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
            // backgroundColor:'rgba(22, 24, 35, 0.9)',
            borderColor:'transparent'
            
        },
        xAxis :{
            type : 'category',
            data : opt.xAxis_data,
            axisTick: {//x轴的刻度
                show: false
            },
            axisLabel:{
            	textStyle:{fontSize:fontSize},
                interval:0
            },
            splitLine: {
                show:true,
                lineStyle:{
                    type:'dotted'
                }
            }
        },
        yAxis : 
        {
            name : opt.yAxis_name,
            type : 'value',
            // max : 1,
            axisTick: {//x轴的刻度
                show: false
            },
            axisLabel:{
            	textStyle:{fontSize:fontSize}
            },
            splitLine: {
                show:true,
                lineStyle:{
                    type:'dotted'
                }
            }
        },
        series : [
            {
                name:opt.yAxis_name,
                type:'line',
                // areaStyle: {normal: {color:opt.areacolor,opacity:1,shadowOffsetY:10}},
                data:opt.data
            }
        ]
	};
	my_chart.setOption(option);
	$(window).resize(function(){
		my_chart.resize();
	});
	return my_chart;
}

function draw_line_dark(opt){/*黑色背景的折线图*/
    var fontSize = opt.fontSize || 14;
    var my_chart = echarts.init(opt.element);
    var option = {
        textStyle: {
            // color:'#ffffff',
            fontWeight: 'normal',
            fontSize:fontSize,
            color:'#ADBEE2'
        },
        title :{
            show:false
        },
        color: ['#3499DB'],//线的颜色
        tooltip : {//提示框
            show:false,
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        grid: {//图表网格区域
            left: '3%',//控制图表的边距
            right: '3%',
            bottom: '0',
            containLabel: true,
            show:true,
            // backgroundColor:'rgba(22, 24, 35, 0.9)',
            borderColor:'transparent'
            
        },
        xAxis :{
            type : 'category',
            data : opt.xAxis_data,
            axisTick: {//x轴的刻度
                show: false
            },
            axisLabel:{
                textStyle:{fontSize:fontSize},
                interval:0
            },
            axisLine:{
                lineStyle:{
                    color:'#666A7A'
                }
            },
            splitLine: {
                show:true,
                lineStyle:{
                    color:['#666A7A'],
                    type:'dotted'
                }
            }
        },
        yAxis : 
        {
            name : opt.yAxis_name,
            type : 'value',
            max : 100,
            min : 50,
            // max : 1,
            axisTick: {//x轴的刻度
                show: false
            },
            axisLabel:{
                textStyle:{fontSize:fontSize}
            },
            axisLine:{
                lineStyle:{
                    color:'#666A7A'
                }
            },
            splitLine: {
                lineStyle:{
                    color:['#666A7A'],
                    type:'dotted'
                }
            }
        },
        series : [
            {
                name:opt.yAxis_name,
                type:'line',
                // areaStyle: {normal: {color:opt.areacolor,opacity:1,shadowOffsetY:10}},
                data:opt.data,
                lineStyle:{normal:{width:5}}
            }
        ]
    };
    my_chart.setOption(option);
    $(window).resize(function(){
        my_chart.resize();
    });
    return my_chart;
}

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