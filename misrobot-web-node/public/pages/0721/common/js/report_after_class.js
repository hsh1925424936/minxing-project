function set_default_report(){//页面加载显示报告的默认值
    $("#course_name").html('无');        //课程名
    $("#attendClassTime").html('无');  //上课时间
    $("#classnameID").html('无');     //班级和班级人数
    $('#attendance').html('无');//出勤人数
    $('#absenteeism').html('无');//缺勤人数
    $('#absent_student').html('无');//缺勤人员
}

function writeradar(options){//画雷达图
    var fontColor = options.bg?'#000':'#fff';
    var nameColor = options.nameColor;
    options.bg = options.bg||'#0496ca';
    options.line = options.line||'#0496ca';
    options.type = options.type||'dotted';
    options.color = options.color||'rgba(0,0,0,0)';
    options.show = options.show||false;
    options.animation = options.animation||true;
    var obj = options.obj;
    obj.myChart = echarts.init(obj);
    obj.option = {
        animation:options.animation,
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
                    show: true,// 默认显示，属性show控制显示与否
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
                        color:nameColor?nameColor:fontColor,
                        fontSize: 13
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
                        value :options.value,
                        name : ''
                    }

                ]
            }
        ]
    };
    obj.myChart.setOption(obj.option);
}

function show_report(base){//显示报告的所有内容
    (function(){//填写头部的基本信息
        if( base.classinfo.coursename ){
            $('#beforereport').html(base.classinfo.coursename);
            $('#course_name').html(base.classinfo.coursename);
            $('#classnameID').html("<span>" + base.classinfo.classname + "</span>");
            $("#attendClassTime").html(//上课时间
                timetodate( datetotime(base.classinfo.coursebegintime) )
                +"~"+timetodate( datetotime(base.classinfo.courseendtime) ,2)
            );
            
            $('#attendance').html(parseInt(base.classinfo.totalstudentcount) - parseInt(base.classinfo.absentcount));//出勤人
            $('#absenteeism').html(parseInt(base.classinfo.absentcount));//缺勤人

            if ( base.classinfo.absentstuents.length > 0 ){
                var absentstuents = '';
                for ( var i = 0; i < base.classinfo.absentstuents.length; i++ ){
                    absentstuents += base.classinfo.absentstuents[i]+' ';
                }
                $('#absent_student').html(absentstuents);//缺勤学生

            }
            
        }

    })();

    (function(){//学生评分evaluationitem
        if( base.myevaluation.length == 0 ){
            $('.main5').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
        }else{
            var arr1 = [];//存放每个维度的名称和最大值
            var arr2 = [];//存放每个维度的值
            for ( var i = 0; i < base.myevaluation.length; i++ ){
                var myevaluation = base.myevaluation[i];
                arr1.push({
                    text:myevaluation.evaluationitem,
                    max:parseInt(myevaluation.fullscore)
                });
                arr2.push(parseFloat(myevaluation.score).toFixed(1));
            }
            console.log({arr1:arr1,arr2:arr2});
            //画雷达图
            writeradar({
                obj:document.getElementsByClassName('main5')[0],
                name:arr1,
                value:arr2,
                show:true,
                bg:'rgba(0,0,0,00)',
                nameColor:'#000',
                line:'#0496ca',
                type:'solid',
                color:'rgba(4,150,202,0.2)',
                animation:true
            });                                    
        }

    })();

    (function(){//成绩统计

        var xAxis_arr = [];//存放训练项名称
        var data_arr = [];//存放数据
        for ( var i = 0; i < base.classscore.length; i++ ){
            var classscore = base.classscore[i];
            var traintypename = '-在线训练';
            switch (classscore.traintype){
                case '1':
                  traintypename = '-模型人训练';
                  break;
                case '2':
                  traintypename = '-智能训练';
                  break;
            }
            xAxis_arr.push(classscore.trainitemname+traintypename);
            data_arr.push( parseInt(classscore.averagescore) );

        }
        if( xAxis_arr.length == 0 ){
            $('#main').html(
                '<p class="no-data" style="height:166px">暂无相关数据</p>'
            );
        }else{
            var gradeStatistics = echarts.init(document.getElementById('main'));

            var option = {
                title :{
                    text:'',
                    x: 'center',
                    y: '18px',
                    textStyle: {
                        fontSize: 16,
                        color: '#494949',
                        fontWeight: 'normal'
                    }
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{b}<br/>{c}分"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data :xAxis_arr,
                        axisLabel : {
                            interval : 0,
                            formatter : function(params){
                                var newParamsName = "";
                                var paramsNameNumber = params.length;
                                var provideNumber = 2;
                                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                if (paramsNameNumber > provideNumber) {
                                    for (var p = 0; p < rowNumber; p++) {
                                        var tempStr = "";
                                        var start = p * provideNumber;
                                        var end = start + provideNumber;
                                        if (p == rowNumber - 1) {
                                            tempStr = params.substring(start, paramsNameNumber);
                                        } else {
                                            tempStr = params.substring(start, end) + "\n";
                                        }
                                        newParamsName += tempStr;
                                    }

                                } else {
                                    newParamsName = params;
                                }
                                return newParamsName
                            }

                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        name : '分数',
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: '32%',
                        itemStyle: {
                            normal: {
                                label: {
                                    textStyle: {
                                        color: '#000'
                                    },
                                    show: true,
                                    position: 'top'
                                }
                            }
                        },
                        data:data_arr
                    }
                ]
            };

            gradeStatistics.setOption(option);
        }

    })();

    //注册训练项点击事件--切换不同的训练项
    //traintype 0-在线训练 1-模型训练 2-智能训练
    (function(){
        var str = '';

        //生成训练项选项卡
        for( var i = 0; i < base.classinfo.trainitems.length; i++ ){

            var trainiteminfo = base.classinfo.trainitems[i];
            str += '<li traintype="'+trainiteminfo.traintype+'" trainitemname="'+trainiteminfo.trainitemname+'">'+
                trainiteminfo.trainitemname;
            if ( trainiteminfo.traintype == 0 ){
                str += '(在线)';
            }else if( trainiteminfo.traintype == 1 ){
                str += '(模型)';
            }else{
                str += '(智能)';
            }
            str += '</li>';
        }
        $('#menu').html(str);

        $('#menu li').click(function() {
            if( $(this).hasClass('li-active') ){
                return false;
            }
            $('#menu li').removeClass('li-active');
            $(this).addClass('li-active');
            //模型训练删除'教学成果对比'、'致命错误'、'严重错误'三项内容
            $('.teachingresult').css('display', 'block');
            $('.typicalerror').css('display', 'block');
            if ( $(this).attr('traintype') == 1 ){
                $('.teachingresult').css('display', 'none');
                $('.typicalerror').css('display', 'none');
            }

            show_err_details();//操作错误详情
            show_error_rate();//显示错误率
            show_worong();//典型错误
            show_classscore();//班级成绩统计
            show_undone_student();//展示未完成训练的学生名单
            show_ranklist();//展示排行榜
            show_teachresult();//教学成果对比
        });
        $('#menu li').eq(0).click();

        function show_err_details(){//操作错误详情
            $('#errInfo').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
            if ( base.errordetails.length == 0 ){
                $('#errInfo').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
            }else{
                var str = '';
                for ( var i = 0; i < base.errordetails.length; i++ ){
                    var errordetail = base.errordetails[i];
                    if ( errordetail.traintype == $('.li-active').attr('traintype') && errordetail.trainitemname == $('.li-active').attr('trainitemname') ){
                        str += '<tr><td>'+errordetail.opstepcontent+'</td><td>'+errordetail.errordetail+'</td><td>'+errordetail.errorcount+'</td></tr>';
                    }
                }
                $('#infoTd').html(str);
            }
            

        }

        function show_error_rate(){//显示错误率
            document.getElementById('main4').innerHTML = '';

            var data_arr  = [];
            var xAxis_arr = [];
            for ( var i = 0; i < base.errorratio.length; i++ ){
                var errorratio = base.errorratio[i];
                if ( errorratio.traintype == $('.li-active').attr('traintype') && errorratio.trainitemname == $('.li-active').attr('trainitemname') ){
                    data_arr.push({value:parseInt(errorratio.errorratio*100) ,num:parseInt(errorratio.errorcount)});
                    xAxis_arr.push(errorratio.opstep);
                }
            }
            console.log(data_arr);
            data_arr = data_arr.slice(0,10);
            xAxis_arr = xAxis_arr.slice(0,10);
            if ( data_arr.length == 0 ){
                document.getElementById('main4').innerHTML = '<p class="no-data" style="height:166px">暂无相关数据</p>';
            }else{
                var  errorTerm = echarts.init(document.getElementById('main4'));
                var option = {
                    title :{
                        text: 'top 10 错误率',
                        show:false,
                        x: 'center',
                        y: '18px',
                        textStyle: {
                            fontSize: 18,
                            color: '#494949',
                            fontWeight: 'normal'
                        }
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        show:false,
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : xAxis_arr,
                            axisLabel : {
                                interval : 0,
                                formatter : function(params){
                                    var newParamsName = "";
                                    var paramsNameNumber = params.length;
                                    var provideNumber = 2;
                                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                    if (paramsNameNumber > provideNumber) {
                                        for (var p = 0; p < rowNumber; p++) {
                                            var tempStr = "";
                                            var start = p * provideNumber;
                                            var end = start + provideNumber;
                                            if (p == rowNumber - 1) {
                                                tempStr = params.substring(start, paramsNameNumber);
                                            } else {
                                                tempStr = params.substring(start, end) + "\n";
                                            }
                                            newParamsName += tempStr;
                                        }

                                    } else {
                                        newParamsName = params;
                                    }
                                    return newParamsName
                                }

                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '错误率%\n ',
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'错误率',
                            type:'bar',
                            barWidth: '32%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            color: '#000'
                                        },
                                        formatter:function(a){
                                            return a.data.value+'% \n'+ a.data.num+'人'
                                        },
                                        show: true,
                                        position: 'top',
                                    }
                                }
                            },
                            data:data_arr
                        }
                    ]
                };
                errorTerm.setOption(option);                              
            }

        }

        function show_worong(){//典型错误
            var typicalerror_arr = [];
            for ( var i = 0; i < base.typicalerror.length; i++ ){
                var typicalerror = base.typicalerror[i];
                if ( typicalerror.traintype == $('.li-active').attr('traintype') && typicalerror.trainitemname == $('.li-active').attr('trainitemname') ){
                    typicalerror_arr.push(typicalerror);
                }
            }
            show_wrong_chart('致命错误',$('#main2')[0],typicalerror_arr);
            show_wrong_chart('严重错误',$('#main3')[0],typicalerror_arr);
        }
        function show_wrong_chart(errortype,element,typicalerror_arr){//

            //errortype 一般错误 严重错误 致命错误  element为获取到的元素

            element.innerHTML = '';

            var xAxis_arr = [];
            var data_arr = [];
            for ( var i = 0; i < typicalerror_arr.length; i++ ){
                if ( typicalerror_arr[i].errortype == errortype ){
                    xAxis_arr.push(typicalerror_arr[i].errordetail);
                    data_arr.push(typicalerror_arr[i].errorcount);
                }
            }

            xAxis_arr = xAxis_arr.slice(0,8);
            data_arr = data_arr.slice(0,8);

            if ( data_arr.length == 0 ){
                element.innerHTML = '<p class="no-data" style="height:166px">无'+errortype+'</p>';
            }else{
                var severityErr = echarts.init(element);
                var option = {
                    title :{
                        text:errortype,
                        x: 'center',
                        y: '18px',
                        textStyle: {
                            fontSize: 16,
                            color: '#494949',
                            fontWeight: 'normal'
                        }
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: "{a} <br/>{b} : {c}人"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data :xAxis_arr,
                            axisLabel : {
                                interval : 0,
                                formatter : function(params){
                                    var newParamsName = "";
                                    var paramsNameNumber = params.length;
                                    var provideNumber = 2;
                                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                    if (paramsNameNumber > provideNumber) {
                                        for (var p = 0; p < rowNumber; p++) {
                                            var tempStr = "";
                                            var start = p * provideNumber;
                                            var end = start + provideNumber;
                                            if (p == rowNumber - 1) {
                                                tempStr = params.substring(start, paramsNameNumber);
                                            } else {
                                                tempStr = params.substring(start, end) + "\n";
                                            }
                                            newParamsName += tempStr;
                                        }

                                    } else {
                                        newParamsName = params;
                                    }
                                    return newParamsName
                                }

                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '人',
                            type : 'value',
                            minInterval: 1
                        }
                    ],
                    series : [
                        {
                            name:errortype,
                            type:'bar',
                            barWidth: '32%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            color: '#000'
                                        },
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            },
                            data:data_arr
                        }
                    ]
                };
                severityErr.setOption(option);
            }

        }

        function show_classscore(){//班级成绩统计
            $('#average').html('');
            $('#the_tallest').html('');
            $('#minimum').html('');

            $('#main9').html('');
            var beyond80 = 0; var below60 = 0; var between6080 = 0;
            for ( var i = 0; i < base.classscore.length; i++ ){
                var classscore = base.classscore[i];
                if ( classscore.traintype == $('.li-active').attr('traintype') && classscore.trainitemname == $('.li-active').attr('trainitemname') ){
                    $('#average').html( parseFloat(classscore.averagescore).toFixed(2) );
                    $('#the_tallest').html( parseFloat(classscore.highestscore).toFixed(2) );
                    $('#minimum').html( parseFloat(classscore.lowestscore).toFixed(2) );
                    beyond80 = parseInt(classscore.beyond80);
                    below60 = parseInt(classscore.below60);
                    between6080 = parseInt(classscore.between6080);
                }
            }
            if(beyond80==0&&below60==0&&between6080==0){
                $('#main9').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
            }else{
                var classGradeStatistical = echarts.init($('#main9')[0]);
                var option = {
                    title: {
                        text: '共' + (beyond80+below60+between6080) + '人',
                        x: 'center',
                        y: 'center',
                        textStyle : {
                            fontSize : '20',
                            fontWeight: '300'
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}人"
                    },
                    color:['rgb(254,195,0)','rgb(4,150,202)','rgb(128,213,211)'],
                    calculable : false,
                    series : [
                        {
                            name:$('.li-active').attr('trainitemname'),
                            type:'pie',
                            radius : ['50%', '70%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : true
                                    },
                                    labelLine : {
                                        show : true
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : false,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '22',
                                            fontWeight : 'lighter'
                                        }
                                    }
                                }
                            },
                            data:[
                             {value:between6080, name:'60-80分'},
                             {value:beyond80, name:'80分以上'},
                             {value:below60, name:'60分以下'}
                             ]
                        }
                    ]
                };
                classGradeStatistical.setOption(option);
            }


        }

        function show_undone_student(){//展示未完成训练的学生名单
            $('#undone_student').html('暂无相关数据');
            var str = '';
            for ( var i = 0; i < base.nottrainstudent.length; i++ ){
                var nottrainstudent = base.nottrainstudent[i];
                if ( nottrainstudent.traintype == $('.li-active').attr('traintype') && nottrainstudent.trainitemname == $('.li-active').attr('trainitemname') ){
                    str += nottrainstudent.name+'&nbsp;&nbsp;&nbsp;';
                }
            }
            if ( str != '' ){
                $('#undone_student').html(str);
            }
            
        }

        function show_ranklist(){//展示排行榜 studentrank
            document.getElementById('main11').innerHTML = '';

            var data_arr  = [];//存放x轴的数据
            var xAxis_arr = [];//存放x轴的名称

            var studentrank_arr = [];
            for ( var i = 0; i < base.studentrank.length; i++ ){
                var studentrank = base.studentrank[i];
                if ( studentrank.traintype == $('.li-active').attr('traintype') && studentrank.trainitemname == $('.li-active').attr('trainitemname') ){
                    studentrank_arr.push(studentrank);
                }
            }
            studentrank_arr.sort(function (a,b) {
                return b.score-a.score; 
            });

            //给studentrank_arr中每一个对象添加一个排名属性
            for ( var i = 0; i < studentrank_arr.length; i++ ){
                if ( i == 0 ){
                    studentrank_arr[i].myrank = 1;
                }else{
                    if ( studentrank_arr[i].score == studentrank_arr[i-1].score ){
                        studentrank_arr[i].myrank = studentrank_arr[i-1].myrank;
                    }else{
                        studentrank_arr[i].myrank = studentrank_arr[i-1].myrank+1
                    }
                }
            }

            for ( var i = 0; i < studentrank_arr.length; i++ ){
                data_arr.push({value:parseInt(studentrank_arr[i].score) ,num:studentrank_arr[i].myrank,name:studentrank_arr[i].name});
                xAxis_arr.push(studentrank_arr[i].name);
                
            }
            
            data_arr = data_arr.slice(0,10);
            xAxis_arr = xAxis_arr.slice(0,10);
            if ( data_arr.length == 0 ){
                document.getElementById('main11').innerHTML = '<p class="no-data" style="height:166px">暂无相关数据</p>';
            }else{
                var  errorTerm = echarts.init(document.getElementById('main11'));

                var option = {
                    title :{
                        text:'',
                        x: 'center',
                        y: '18px',
                        textStyle: {
                            fontSize: 16,
                            color: '#494949',
                            fontWeight: 'normal'
                        }
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: "{b}<br/>{c}分"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data :xAxis_arr,
                            axisLabel : {
                                interval : 0,
                                formatter : function(params){
                                    var newParamsName = "";
                                    var paramsNameNumber = params.length;
                                    var provideNumber = 2;
                                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                    if (paramsNameNumber > provideNumber) {
                                        for (var p = 0; p < rowNumber; p++) {
                                            var tempStr = "";
                                            var start = p * provideNumber;
                                            var end = start + provideNumber;
                                            if (p == rowNumber - 1) {
                                                tempStr = params.substring(start, paramsNameNumber);
                                            } else {
                                                tempStr = params.substring(start, end) + "\n";
                                            }
                                            newParamsName += tempStr;
                                        }

                                    } else {
                                        newParamsName = params;
                                    }
                                    return newParamsName
                                }

                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '分数',
                            type : 'value',
                            minInterval: 1
                        }
                    ],
                    series : [
                        {
                            name:'',
                            type:'bar',
                            barWidth: '32%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            color: '#000'
                                        },
                                        show: true,
                                        position: 'top',
                                        formatter:function(a){
                                             //某某人 第几名 多少分
                                            return '第'+a.data.num+'名\n'+a.data.value+'分'
                                        }
                                    }
                                }
                            },
                            data:data_arr
                        }
                    ]
                };

                errorTerm.setOption(option);                              
            }

        }

        function show_teachresult(){//教学成果对比
            $('#main10').css('height','360px');
            $('#main10').html('');

            var yAxis_arr = [];
            var data_arr1 = [];//课前正确率[30,20,50]
            var data_arr2 = [];//课后正确率[30,20,50]
            var ratesum = 0; var ratenum = 0;
            for ( var i = 0; i < base.teachingresult.length; i++ ){
                var teachingresult = base.teachingresult[i];
                if ( teachingresult.traintype == $('.li-active').attr('traintype') && teachingresult.trainitemname == $('.li-active').attr('trainitemname') ){
                    yAxis_arr.push( teachingresult.opstep );
                    data_arr1.push( (parseFloat(1-teachingresult.preerrorratio)*100).toFixed(2)  );
                    data_arr2.push( (parseFloat(1-teachingresult.posterrorratio)*100).toFixed(2) );

                    ratenum++;
                    ratesum += (parseFloat(teachingresult.preerrorratio-teachingresult.posterrorratio).toFixed(2))*100;
                }

            }
            //如果教学成果对比的操作项大于6项，多出一项，容器高度加60px
            if ( yAxis_arr.length > 6 ){
                var content_height = 360 + 45*(yAxis_arr.length-6);
                content_height = content_height + 'px';
                $('#main10').css('height',content_height);
            }

            if ( yAxis_arr.length == 0 ){
                $('#main10').html('<p class="no-data" style="height:166px">无训练记录</p>');
            }else{
                var achievement = echarts.init($('#main10')[0]);
                var option = {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['上课前', '上课后'],
                        x:'80%'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'value',
                            boundaryGap : [0, 0.01]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
                            data : yAxis_arr,
                            axisLabel : {
                                interval : 0,
                                formatter : function(params){
                                    var newParamsName = "";
                                    var paramsNameNumber = params.length;
                                    var provideNumber = 2;
                                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                    if (paramsNameNumber > provideNumber) {
                                        for (var p = 0; p < rowNumber; p++) {
                                            var tempStr = "";
                                            var start = p * provideNumber;
                                            var end = start + provideNumber;
                                            if (p == rowNumber - 1) {
                                                tempStr = params.substring(start, paramsNameNumber);
                                            } else {
                                                tempStr = params.substring(start, end) + "\n";
                                            }
                                            newParamsName += tempStr;
                                        }

                                    } else {
                                        newParamsName = params;
                                    }
                                    return newParamsName
                                }

                            }
                        }
                    ],
                    series : [
                        {
                            name:'上课后',
                            type:'bar',
                            data:data_arr2,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:true, position:'right',
                                        formatter:'{c}%'
                                    }
                                }
                            }

                        },
                        {
                            name:'上课前',
                            type:'bar',
                            data:data_arr1,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:true, position:'right',
                                        formatter:'{c}%'
                                    }
                                }
                            }
                        }
                    ],
                    color: ['rgb(128,213,211)','rgb(4,134,202)']
                };
                achievement.setOption(option);
            }
            

        }

    })();
}