function set_default_report(){//页面加载显示报告的默认值
    $('#course_name').html('无');//课程名称
    $('#classnameID').html('无');//班级
    $("#attendClassTime").html('无');//上课时间
}

function show_report(base){//显示报告的所有内容
    (function(){//填写头部的基本信息
        if( base.classinfo.coursename ){
            $('#course_name').html(base.classinfo.coursename);
            $('#classnameID').html("<span>" + base.classinfo.classname + "</span>");
            $("#attendClassTime").html(//上课时间
                timetodate( datetotime(base.classinfo.coursebegintime) )
                +"~"+timetodate( datetotime(base.classinfo.courseendtime) ,2)
            );
        }
        

    })();

    //注册训练项点击事件--切换不同的训练项
    //traintype 0-在线训练 1-模型训练 2-智能训练
    (function(){
        var str = '';

        //生成训练项选项卡
        for( var i = 0; i < base.classinfo.trainiteminfo.length; i++ ){

            var trainiteminfo = base.classinfo.trainiteminfo[i];
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

            show_err_details();//操作错误详情
            show_worong();//典型错误
            show_error_rate();//显示错误率
            show_undone_student();
            show_finish_pie();//完成情况统计饼图
            show_classscore();//班级成绩统计
        });
        $('#menu li').eq(0).click();
        function show_err_details(){//操作错误详情
            $('#infoTd').html('');
            if ( base.errordetails.length == 0 ){
                $('#infoTd').html('');
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

        function show_worong(){//典型错误
            var typicalerror_arr = [];
            for ( var i = 0; i < base.typicalerror.length; i++ ){
                var typicalerror = base.typicalerror[i];
                if ( typicalerror.traintype == $('.li-active').attr('traintype') && typicalerror.trainitemname == $('.li-active').attr('trainitemname') ){
                    typicalerror_arr.push(typicalerror);
                }
            }
            show_wrong_chart('致命错误',document.getElementById('main2'),typicalerror_arr);
            show_wrong_chart('严重错误',document.getElementById('main3'),typicalerror_arr);
        }
        function show_wrong_chart(errortype,element,typicalerror_arr){

            //errortype 一般错误 严重错误 致命错误  element为获取到的元素
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
                var modelErr = echarts.init(element);
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
                modelErr.setOption(option);
            }

        }

        function show_error_rate(){//显示错误率
            var data_arr  = [];
            var xAxis_arr = [];
            for ( var i = 0; i < base.errorratio.length; i++ ){
                var errorratio = base.errorratio[i];
                if ( errorratio.traintype == $('.li-active').attr('traintype') && errorratio.trainitemname == $('.li-active').attr('trainitemname') ){
                    data_arr.push({value:parseInt(errorratio.errorratio*100) ,num:errorratio.errorcount});
                    xAxis_arr.push(errorratio.opstep);
                }
            }
            data_arr = data_arr.slice(0,10);
            xAxis_arr = xAxis_arr.slice(0,10);
            if ( data_arr.length == 0 ){
                document.getElementById('main4').innerHTML = '<p class="no-data" style="height:166px">暂无相关数据</p>';
            }else{
                var Erroperate = echarts.init(document.getElementById('main4'));
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
                Erroperate.setOption(option);                                
            }

        }

        function show_undone_student(){//展示未完成训练的学生名单
            $('#undone_student').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
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

        function show_finish_pie(){//完成情况统计饼图
            var nottrainstudent_num = 0;
            for ( var i = 0; i < base.nottrainstudent.length; i++ ){
                var nottrainstudent = base.nottrainstudent[i];
                if ( nottrainstudent.traintype == $('.li-active').attr('traintype') && nottrainstudent.trainitemname == $('.li-active').attr('trainitemname') ){
                    nottrainstudent_num++;
                }
            }
            var completeStatistical = echarts.init(document.getElementById('main7'));
            var option = {
                title: {
                    text: '共'+base.classinfo.studentcount+'人',
                    x: 'center',
                    y: 'center',
                    textStyle : {
                        fontSize : '20',
                        fontWeight: '300'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                color:['rgb(254,195,0)','rgb(4,150,202)'],
                calculable : false,
                series : [
                    {
                        name:'访问来源',
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
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '22',
                                        fontWeight : 'lighter'
                                    }
                                }
                            }
                        },
                        data:[
                         {value:base.classinfo.studentcount-nottrainstudent_num, name:'已完成'},
                         {value:nottrainstudent_num, name:'未完成'}
                         ]
                    }
                ]
            };
            completeStatistical.setOption(option);
        }

        function show_classscore(){//班级成绩统计
            $('#average').html('');
            $('#the_tallest').html('');
            $('#minimum').html('');

            $('#main6').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
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
                $('#main6').html('<p class="no-data" style="height:166px">暂无相关数据</p>');
            }else{
                var classGradeStatistical = echarts.init(document.getElementById('main6'));
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
                                        show : true,
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

    })();
}