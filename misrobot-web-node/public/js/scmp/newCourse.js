var action=window.location.href.split("=")[1];
var sid=getCookie('sid');//sessionid
var lgid=getCookie('uid');//loginid
var pTop=(window.screen.availHeight-620)/2;//屏幕上方留白距离
var isTrueSave=-1;//-1表示用户选择的内容不合法，不能保存创建的课程
var now=new Date();
var year=now.getFullYear();
var month=now.getMonth()+1;
var day=now.getDate();
if(month>=1 && month<=9){
    month="0"+month
};
if(day>=0 && day<=9){
    day="0"+day
};
var currentStr=year+"/"+month+"/"+day;
var courseDate=year+"-"+month+"-"+day;//新建课程的时间,默认是今天
var preExeDate=year+"-"+month+"-"+day;//课前训练最迟完成时间,默认是今天
function errorfn(response){//通用的错误描述函数
    if(response.errcode==9904){
        layer.msg("登录信息失效，请重新登录！")
        setTimeout(function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            window.location.href="login.html"
        },3000)
    }else{
        layer.msg(response.errdesc)
    }
};
function errorConnect(){//通用的连接失败函数
    layer.msg("连接服务失败")
};
var calendarCourseTime=Vue.extend({//把jqueryui日历封装到vue组件
    template:"<div id='calendarCourseTime'></div>"
});
Vue.component('coursetime',calendarCourseTime);
var calendarPreExe=Vue.extend({//把jqueryui日历封装到vue组件
    template:"<div id='calendarPreExe'></div>"
});
Vue.component('preexetime',calendarPreExe);
setCalendar("#calendarCourseTime","courseDate");
setCalendar("#calendarPreExe","preExeDate");
Vue.filter('learntype',function(value){//过滤训练项类型
    if(value=="0"){
        return "在线训练"
    }else if(value=="1"){
        return "模型"
    }else{
        return "智能设备"
    }
});
Vue.filter('type',function(value){//过滤训练项类型
    if(value=="0"){
        return "必选"
    } else{
        return "推荐"
    }
});
var v=new Vue({
    el:"#vm",
    data:{
        //新建课程接口/course/addcousreinfo
        //输入sessionid,loginid
        headTitle:"",
        placeid:"",
        courseid:"",
        teachers:[],//[老师数组{uid:"",role:""}]
        startdt:"",
        starttime:"",
        endtime:"",
        type:"",//(0表示固定课程，1表示临时预约)
        learnids:[],//[训练项数组{learnid:""}]
        students:[],//[学生数组{uid:""}]
        //输出 scheduleid
        scheduleid:"",
        showShadow:false,//shadow层是否显示
        showPlace:false,//授课地点列表是否显示
        showCourseName:false,//课程名列表是否显示
        showGrade:false,//年级列表是否显示
        showClass:false,//班级列表是否显示
        showTimeDrop:[false,false,false,false],//4个选择时间列表是否显示
        choosedPlace:"",//input框里显示用户已选的授课地点
        choosedCourseName:"",//input框里显示用户已选的课程名称
        coursePlace:"",//授课地点后台返回数据
        teacherList:"",//授课老师后台返回数据
        choosedTeacherList:[],//用户增加的老师
        choosedTeacher2List:[],//用户增加的教辅老师
        choosedExerciseList:[],//用户增加的训练项
        courseNameList:"",//课程名称后台返回数据
        teacher2List:"",//辅导老师后台返回数据
        exerciseList:"",//训练项后台返回数据
        gradeList:[],//年级列表后台返回数据
        gradeIndex:0,//变量用于选择年级后选班级
        stuList:"",//根据班级id查询学生列表，后台返回数据
        startH:["07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22"],
        endH:["07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
        startMin:["00","05","10","15","20","25","30","35","40","45","50","55"],
        endMin:["00","05","10","15","20","25","30","35","40","45","50","55"],
        time:["08","00","12","00"],
        tn:true,
        ty:false,
        finishTime:"",//课前任务最迟完成时间
        preExeSetted:[],//用户设置的课前任务对象
        timeList:'',
        checkList:[],
        allTimeList:[],
        choosedsclassname:'选择班级',
        choosedsclassid:'',
        choosedsclasslist1:[],//左右选择时的已选班级数组
        choosedsclasslist2:[],//展示到上一级页面的班级数组
        removelist:[],//从右往左删除已选班级和学生
        choosedtimelist:[],//"timelist":[{"starttime":"2017-07-14 08:00:00","endtime":"2017-07-14 08:45:00"},{"starttime":"2017-07-14 08:55:00","endtime":"2017-07-14 09:40:00"}],
},
    mounted:function(){
        var self=this;
        $.ajax({
            type: "post",
            url: "/examapply/queryexamtimeslist",
            async: true,
            data: JSON.stringify({
                '1': {
                    command: "examapply/queryexamtimeslist",
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid')
                }
            }),
            success: function(data) {
                self.timeList=JSON.parse(data['1'].timeslist);
            }
        });
    },
    filters: {
        filterFun: function (value) {
            return value.substring(0,5)
        }
    },
    watch:{
        'removelist':function(val){
            if(val.length!=0){
                $("#removeStu").addClass("able")
            }else{
                $("#removeStu").removeClass("able")
            }
        },
        'choosedCourseName':function(val){
            this.choosedsclassname='选择班级'
            this.gradeList=[]
            this.gradeIndex=0
            this.stuList=[]
        }
    },
    methods:{
        savePreExeTime:function(){//保存最迟完成时间
            this.finishTime=preExeDate+" "+$("#preExeH").val()+":"+$("#preExeMin").val()+":"+"00";
            this.showShadow=false;
            $("#preExePick").attr("class","hide");
        },
        preExeSave:function(){
            var flag=-1;//训练项没有重复
            $("#preExe tbody tr").each(function(){
                if($(this).children().eq(0).html()==$("#choosedPreExe").html()){
                    flag=0;//0表示有重复
                }
            });
            if(flag==0){
                layer.msg("训练项不能重复添加",{icon:0});
                return
            };
            if($("#choosedPreExe").html()=="选择训练项"){
                layer.msg("请选择训练项",{icon:0});
                return
            };
            if($("#lasttime").html().length==0){
                layer.msg("请选择最迟完成时间",{icon:0});
                return
            };
            if($("#mincount").val()==0){
                layer.msg("请指定最少完成次数",{icon:0});
                return
            };
            if(isNaN($("#mincount").val())){
                layer.msg("最少完成次数必须为数字",{icon:0});
                return
            };
            if($("#mintime").val()=="输入分钟数"){
                layer.msg("请指定最少完成分钟数",{icon:0});
                return
            };
            if(isNaN($("#mintime").val())){
                layer.msg("最少完成分钟必须为数字",{icon:0});
                return
            };
            if($("#type input:checked").val()=="必选"){
                var type=0;//0为必选
            }else{
                var type=1//1为推荐
            };
            this.preExeSetted.push({
                name:$("#choosedPreExe").data("name"),
                learnid:$("#choosedPreExe").data("learnid"),
                learntype:$("#choosedPreExe").data("type"),//0,1,2
                mincount:$("#mincount").val(),//最少完成次数
                mintime:$("#mintime").val(),//最少完成分钟数
                lasttime:$("#lasttime").html()+":00",//最迟完成时间
                type:type//可选or必选
            })
        },
        deletePreExe:function(index){//删除一条课前训练记录
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.preExeSetted.length;i++){
                if(i!=index){
                    tempArr.push(self.preExeSetted[i])
                }
            };
            self.preExeSetted=tempArr;
        },
        getPlaceList:function() {//获取授课地点的函数
            this.showCourseName=false
            this.showPlace=!this.showPlace
            var self=this
            var json={
                command: "site/sitelist",
                loginid: lgid,
                sessionid:sid
            };
            function callback(response){
                self.coursePlace=response;
            };
            post("/site/sitelist",json,callback,errorfn,errorConnect)
        },
        getPlaceList_focus:function() {//获取授课地点的函数
            this.showCourseName=false
            this.showPlace=true
            var self=this
            var json={
                command: "site/sitelist",
                loginid: lgid,
                sessionid:sid
            };
            function callback(response){
                self.coursePlace=response;
            };
            post("/site/sitelist",json,callback,errorfn,errorConnect)
        },
        choosePlace:function(index){//点击授课地点列表里的选项，把选择结果显示到页面
            this.showPlace=false;
            this.choosedPlace=this.coursePlace.sitelist[index].sitename;
            this.placeid=this.coursePlace.sitelist[index].siteid;//保存用户选择的地点id
        },
        getTeacherList:function(){//在主页中“选择授课老师”点击选择按钮后弹出shadow层，打开setTeacher
            this.choosedTeacherList=[];//每次点击“选择老师”按钮，都要先清空已选老师数组
            this.showShadow=true;
            $("#setTeacher").attr("class","show");
            var self=this;
            var json={
                command: "cls/teacherlist",
                loginid: lgid,
                sessionid: sid,
                roleid:3,
            };
            function callback(response){
                self.teacherList=response;
            };
            post("/cls/teacherlist",json,callback,errorfn,errorConnect)
        },
        toggleAddTeacher:function(index){//点击选择老师时打个“勾”
            $("#teacherList li:eq("+index+") i").toggleClass("isChoosed");
            $("#teacherList li:eq("+index+")").toggleClass("gray");
            if($("#teacherList li i.isChoosed").length!=0){
                $("#addTeacher").addClass("able")
            }
            else{
                $("#addTeacher").removeClass("able")
            }
        },
        addTeacher:function(){//点击增加老师
            $("#teacherList li").each(function(index,dom){
                if($(dom).hasClass("hide")){
                    $(dom).removeClass("hide");
                }
            });
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.teacherList.teacherlist.length;i++){
                if($("#teacherList li:eq("+i+")").hasClass("gray")){
                    self.choosedTeacherList.push({
                        teacherid:self.teacherList.teacherlist[i].teacherid,
                        teacherame:self.teacherList.teacherlist[i].teacherame
                    })
                }
                else{
                    tempArr.push({
                        teacherid:self.teacherList.teacherlist[i].teacherid,
                        teacherame:self.teacherList.teacherlist[i].teacherame
                    })
                }
            };
            $("#teacherList li").each(function(){
                $(this).removeClass("gray");
                $(this).children("i").removeClass("isChoosed");
            });
            self.teacherList.teacherlist=tempArr;
        },
        toggleGrayRight:function(index){//点击已选老师列表项
            $("#choosedTeacher li:eq("+index+")").toggleClass("gray");
            if($("#choosedTeacher li.gray").length!=0){
                $("#removeTeacher").addClass("able")
            }
            else{
                $("#removeTeacher").removeClass("able")
            }
        },
        removeTeacher:function(){//点击删除老师
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.choosedTeacherList.length;i++){
                if($("#choosedTeacher li:eq("+i+")").hasClass("gray")){
                    self.teacherList.teacherlist.push({
                        teacherid:self.choosedTeacherList[i].teacherid,
                        teacherame:self.choosedTeacherList[i].teacherame
                    })
                }
                else{
                    tempArr.push({
                        teacherid:self.choosedTeacherList[i].teacherid,
                        teacherame:self.choosedTeacherList[i].teacherame
                    })
                }
            };
            $("#choosedTeacherList li").each(function(){
                $(this).removeClass("gray");
            });
            self.choosedTeacherList=tempArr;
        },
        saveTeacher:function(){//选择老师模块点击保存
            $("div.choosedTeacher").removeClass("hide");
            this.showShadow=false;
            $("#setTeacher").attr("class","hide");
        },
        closeSetTeacherBox:function(){//关闭选择老师模块
            this.showShadow=false;
            $("#setTeacher").attr("class","hide");
        },
        getCourseNameList:function(){//获取课程名称接口
            var self=this;
            self.showPlace=false;
            self.showCourseName=!self.showCourseName;
            var json={
                command: "course/querycoursenamelist",
                loginid: lgid,
                sessionid: sid
            };
            function callback(response){
                self.courseNameList=response;
            };
            post("/course/querycoursenamelist",json,callback,errorfn,errorConnect)
        },
        getCourseNameList_focus:function(){//获取课程名称接口
            var self=this;
            self.showPlace=false;
            self.showCourseName=true;
            var json={
                command: "course/querycoursenamelist",
                loginid: lgid,
                sessionid: sid
            };
            function callback(response){
                self.courseNameList=response;
            };
            post("/course/querycoursenamelist",json,callback,errorfn,errorConnect)
        },
        chooseCourseName:function(index){
            this.showCourseName=false;
            this.choosedCourseName=this.courseNameList.coursenames[index].coursename;
            this.courseid=this.courseNameList.coursenames[index].courseid;
        },
        newCourse:function(){
            this.showShadow=true;
            $("#newCourseBox").attr("class","show");
        },
        saveCourseName:function(){//新建课程名保存到后台，后台返回courseid
            this.showCourseName=false;
            var self=this;
            var json={
                command:"course/addcoursename",
                loginid:lgid,
                sessionid:sid,
                coursename:self.choosedCourseName
            };
            function callback(response){
                self.courseid=response.courseid
                console.log(self.courseid);
                self.showShadow=false;
                $("#newCourseBox").attr("class","hide");
            };
            post("/course/addcoursename",json,callback,errorfn,errorConnect)
        },
        closeNewCourseBox:function(){
            this.showShadow=false;
            $("#newCourseBox").attr("class","hide");
        },
        setTime:function(){
            this.showShadow=true;
            $("#newCourseTime").attr("class","show");
        },
        showTime0:function(){//控制时间列表的显示和隐藏
            this.showTimeDrop=[true,false,false,false];
        },
        showTime1:function(){
            this.showTimeDrop=[false,true,false,false];
        },
        showTime2:function(){
            this.showTimeDrop=[false,false,true,false];
        },
        showTime3:function(){
            this.showTimeDrop=[false,false,false,true];
        },
        setStartH:function(index){//设置开始和结束时间
            this.showTimeDrop=[false,false,false,false];
            this.time[0]=this.startH[index];
        },
        setStartMin:function(index){
            this.showTimeDrop=[false,false,false,false];
            this.time[1]=this.startMin[index];
        },
        setEndH:function(index){
            this.showTimeDrop=[false,false,false,false];
            this.time[2]=this.endH[index];
        },
        setEndMin:function(index){
            this.showTimeDrop=[false,false,false,false];
            this.time[3]=this.endMin[index];
        },
        closeTimeBox:function(){
            this.showShadow=false;
            $("#newCourseTime").attr("class","hide");
        },
        saveTime:function(){//保存已选时间
            var choosedStr=courseDate.replace(/-/g,'/');
            if(Date.parse(choosedStr)<Date.parse(currentStr)){
                layer.msg("您选择的日期已过期");
                return
            }
            if(this.checkList.length==0){
            	layer.msg('请选择上课时间')
            	return
            }
//          if(Date.parse(choosedStr)==Date.parse(currentStr)){
//              if(parseInt(this.time[2])< now.getHours()){
//                  layer.msg("您选择的时间已过期");
//                  return
//              }
//          }
            var self=this;

            console.log(self.checkList);
            if (self.checkList.length==1) {
            	if(Date.parse(choosedStr)==Date.parse(currentStr)){
            			var newCurrentStr1=year+"-"+month+"-"+day;
            			var newTime1=newCurrentStr1+" "+self.checkList['0'].starttime;
	                    if(Date.parse(newTime1)< now.getTime()){
	                        layer.msg("您选择的时间已过期");
	                        return
	                    }
                    }
                var newCourseTime={//声明已选时间对象
                    date:function(){//上课日期，格式：“2016-01-01 00:00:00”
                        return courseDate+" 00:00:00";
                    },
                    startTime:function(){//上课开始时间
                        return courseDate+" "+self.checkList['0'].starttime;
                    },
                    endTime:function(){//上课结束时间
                        return courseDate+" "+self.checkList['0'].endtime;
                    }
                };
                self.starttime=newCourseTime.startTime();
                self.endtime=newCourseTime.endTime();
                $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+"  "+self.checkList['0'].starttime.substring(0,5)+"~"+self.checkList['0'].endtime.substring(0,5));

                $("div.choosedTimeRange").removeClass("hide");
                self.showShadow=false;
                $("#newCourseTime").attr("class","hide");
                self.allTimeList=[]
                self.choosedtimelist=[{
                    starttime:newCourseTime.startTime(),
                    endtime:newCourseTime.endTime()
                }]
                console.log(JSON.stringify(self.choosedtimelist))
            }else{
                var self=this;
                self.allTimeList=[];
                for (var i=0;i<self.checkList.length;i++) {
                    self.allTimeList.push({starttime:courseDate+" "+self.checkList[i].starttime,endtime:courseDate+" "+self.checkList[i].endtime})
                }
                if(Date.parse(choosedStr)==Date.parse(currentStr)){
            			var newCurrentStr2=year+"-"+month+"-"+day;
            			var newTime2=newCurrentStr2+" "+self.checkList[self.checkList.length-2].starttime;
	                    if(Date.parse(newTime2)< now.getTime()){
	                        layer.msg("您选择的时间已过期");
	                        return
	                    }
                }
                $.ajax({
                    type: "post",
                    url: "/learn/isschedulemerge",
                    async: true,
                    data: JSON.stringify({
                        '1': {
                            command: "learn/isschedulemerge",
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            timelist:self.allTimeList
                        }
                    }),
                    success: function(data) {
                        if (data['1'].errcode==0) {
                            console.log(self.checkList);
                            self.choosedtimelist=self.allTimeList
                            var allTime="";
                            var newStartTime=[];
                            var newEndTime=[];
                            for (var i=0;i<self.checkList.length;i++) {
                                newStartTime.push(self.checkList[i].starttime);
                                newEndTime.push(self.checkList[i].endtime);
                            }
                            var newCourseTime={//声明已选时间对象
                                date:function(){//上课日期，格式：“2016-01-01 00:00:00”
                                    return courseDate+" 00:00:00";
                                },
                                startTime:function(){//上课开始时间
                                    return courseDate+" "+newStartTime.sort()[0];
                                },
                                endTime:function(){//上课结束时间
                                    return courseDate+" "+newEndTime.sort()[newEndTime.length-1];
                                }
                            };
                            self.starttime=newCourseTime.startTime();
                            self.endtime=newCourseTime.endTime();
                            allTime=newStartTime.sort()[0].substring(0,5)+"~"+newEndTime.sort()[newEndTime.length-1].substring(0,5);
                            $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+"  "+allTime);

                            $("div.choosedTimeRange").removeClass("hide");
                            self.showShadow=false;
                            $("#newCourseTime").attr("class","hide");
                        } else{
                            self.choosedtimelist=[]
                            layer.msg(data['1'].errdesc);
                            return
                        }
                    }
                });
            }
//              var choosedStr=courseDate.replace(/-/g,'/');
//              if(Date.parse(choosedStr)<Date.parse(currentStr)){
//                  layer.msg("您选择的日期已过期");
//                  return
//              }
//              if(Date.parse(choosedStr)==Date.parse(currentStr)){
//                  if(parseInt(this.time[2])< now.getHours()){
//                      layer.msg("您选择的时间已过期");
//                      return
//                  }
//              }
//              if(parseInt(this.time[0])*60+parseInt(this.time[1]) >= parseInt(this.time[2])*60+parseInt(this.time[3])){//如果课程开始时间大于结束时间
//                  layer.msg("结束时间应晚于开始时间");
//                  return
//              }
//              var newCourseTime={//声明已选时间对象
//                  startHour:$("#beginH").html(),
//                  startMin:$("#beginM").html(),
//                  endHour:$("#endH").html(),
//                  endMin:$("#endM").html(),
//                  date:function(){//上课日期，格式：“2016-01-01 00:00:00”
//                      return courseDate+" 00:00:00";
//                  },
//                  startTime:function(){//上课开始时间
//                      return courseDate+" "+this.startHour+":"+this.startMin+":00";
//                  },
//                  endTime:function(){//上课结束时间
//                      return courseDate+" "+this.endHour+":"+this.endMin+":00";
//                  }
//              };
//              this.starttime=newCourseTime.startTime();
//              this.endtime=newCourseTime.endTime();
//              //把已选时间显示到主界面
//              $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+" / "+newCourseTime.startTime().slice(11,16)+"~"+newCourseTime.endTime().slice(11,16));
//              $("div.choosedTimeRange").removeClass("hide");
//              this.showShadow=false;
//              $("#newCourseTime").attr("class","hide");
        },
        teacher2:function(){//选择教辅老师，获取教辅老师列表
            this.choosedTeacher2List=[];//每次点击“选择教辅老师”按钮，都要先清空已选教辅老师数组
            this.showShadow=true;
            $("#setTeacher2").attr("class","show");
            var self=this;
            var json={
                command: "cls/teacherlist",
                loginid:lgid,
                sessionid:sid,
                roleid: 4
            };
            function callback(response){
                self.teacher2List=response;
                console.log(JSON.stringify(self.teacher2List))
            };
            post("/cls/teacherlist",json,callback,errorfn,errorConnect)
        },
        toggleTeacher2:function(index){//点击教辅老师列表，选择后打个“勾”
            $("#teacher2List li:eq("+index+") i").toggleClass("isChoosed");
            $("#teacher2List li:eq("+index+")").toggleClass("gray");
            if($("#teacher2List li i.isChoosed").length!=0){
                $("#addTeacher2").addClass("able")
            }
            else{
                $("#addTeacher2").removeClass("able")
            }
        },
        addTeacher2:function(){//增加教辅老师按钮
            $("#teacher2List li").each(function(index,dom){
                if($(dom).hasClass("hide")){
                    $(dom).removeClass("hide");
                }
            });
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.teacher2List.teacherlist.length;i++){
                if($("#teacher2List li:eq("+i+")").hasClass("gray")){
                    self.choosedTeacher2List.push({
                        teacherid:self.teacher2List.teacherlist[i].teacherid,
                        teacherame:self.teacher2List.teacherlist[i].teacherame
                    })
                }
                else{
                    tempArr.push({
                        teacherid:self.teacher2List.teacherlist[i].teacherid,
                        teacherame:self.teacher2List.teacherlist[i].teacherame
                    })
                }
            };
            $("#teacher2List li").each(function(){
                $(this).removeClass("gray");
                $(this).children("i").removeClass("isChoosed");
            });
            self.teacher2List.teacherlist=tempArr;
        },
        toggleGrayRight2:function(index){//点击已选教辅老师列表项
            $("#choosedTeacher2 li:eq("+index+")").toggleClass("gray");
            if($("#choosedTeacher2 li.gray").length!=0){
                $("#removeTeacher2").addClass("able")
            }
            else{
                $("#removeTeacher2").removeClass("able")
            }
        },
        removeTeacher2:function(){//点击删除教辅老师
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.choosedTeacher2List.length;i++){
                if($("#choosedTeacher2 li:eq("+i+")").hasClass("gray")){
                    self.teacher2List.teacherlist.push({
                        teacherid:self.choosedTeacher2List[i].teacherid,
                        teacherame:self.choosedTeacher2List[i].teacherame
                    })
                }
                else{
                    tempArr.push({
                        teacherid:self.choosedTeacher2List[i].teacherid,
                        teacherame:self.choosedTeacher2List[i].teacherame
                    })
                }
            };
            $("#choosedTeacher2List li").each(function(){
                $(this).removeClass("gray");
            });
            self.choosedTeacher2List=tempArr;
        },
        setTeacher2Save:function(){//保存已选的教辅老师
            $("div.choosedTeacher2").removeClass("hide");
            this.showShadow=false;
            $("#setTeacher2").attr("class","hide");
        },
        closeTeacher2:function(){//点击关闭教辅老师模块
            this.showShadow=false;
            $("#setTeacher2").attr("class","hide");
        },
        setExercise:function(){//从后台获取训练项列表
            this.choosedExerciseList=[];//每次点击选择训练项，先把已选的清空
            this.showShadow=true;
            $("#setExercise").attr("class","show");
            var self=this;
            var json={
                command: "learn/querylearninfo",
                loginid:lgid,
                sessionid:sid
            };
            function callback(response){
                self.exerciseList=response;
            };
            post("/learn/querylearninfo",json,callback,errorfn,errorConnect)
        },
        toggleExercise:function(index){//选择训练项，点击后打个勾
            $("#exerciseList li:eq("+index+") i").toggleClass("isChoosed");
            $("#exerciseList li:eq("+index+")").toggleClass("gray");
            if($("#exerciseList li i.isChoosed").length!=0){
                $("#addExercise").addClass("able")
            }
            else{
                $("#addExercise").removeClass("able")
            }
        },
        addExercise:function(){//增加训练项按钮
            $("#exerciseList li").each(function(index,dom){
                if($(dom).hasClass("hide")){
                    $(dom).removeClass("hide");
                }
            });
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.exerciseList.learnids.length;i++){
                if($("#exerciseList li:eq("+i+")").hasClass("gray")){
                    self.choosedExerciseList.push({
                        learnid:self.exerciseList.learnids[i].learnid,
                        name:self.exerciseList.learnids[i].name,
                        type:self.exerciseList.learnids[i].type
                    })
                }
                else{
                    tempArr.push({
                        learnid:self.exerciseList.learnids[i].learnid,
                        name:self.exerciseList.learnids[i].name,
                        type:self.exerciseList.learnids[i].type
                    })
                }
            };
            $("#exerciseList li").each(function(){
                $(this).removeClass("gray");
                $(this).children("i").removeClass("isChoosed");
            });
            self.exerciseList.learnids=tempArr;
        },
        toggleChoosedExercise:function(index){//已选训练项点击切换选中状态
            $("#choosedExercise li:eq("+index+")").toggleClass("gray");
            if($("#choosedExercise li.gray").length!=0){
                $("#removeExercise").addClass("able")
            }
            else{
                $("#removeExercise").removeClass("able")
            }
        },
        removeExercise:function(){//删除已选训练项按钮
            var self=this;
            var tempArr=[];
            for(var i=0;i<self.choosedExerciseList.length;i++){
                if($("#choosedExercise li:eq("+i+")").hasClass("gray")){
                    self.exerciseList.learnids.push({
                        learnid:self.choosedExerciseList[i].learnid,
                        name:self.choosedExerciseList[i].name,
                        type:self.choosedExerciseList[i].type
                    })
                }
                else{
                    tempArr.push({
                        learnid:self.choosedExerciseList[i].learnid,
                        name:self.choosedExerciseList[i].name,
                        type:self.choosedExerciseList[i].type
                    })
                }
            };
            $("#choosedExercise li").each(function(){
                $(this).removeClass("gray");
            });
            self.choosedExerciseList=tempArr;
        },
        saveExercise:function(){//保存选择的训练项，将用户选择的显示到页面
            var self=this;
            self.learnids=[];
            for(var i=0;i<self.choosedExerciseList.length;i++){//循环生成已选训练项数组
                self.learnids.push({//保存到提交接口需要的learnids[]参数
                    learnid:self.choosedExerciseList[i].learnid,
                })
            };
            $("#exercise").removeClass("hide");
            self.showShadow=false;
            $("#setExercise").attr("class","hide");
        },
        closeExercise:function(){//点击关闭训练项模块
            this.showShadow=false;
            $("#setExercise").attr("class","hide");
        },
        stu:function(){//点击选择学生部分“增加+”
            if(!this.courseid){
                layer.msg('请先选择课程')
                return
            }
            $(".choosedStuList").empty();
            this.showShadow=true;
            $("#setStu").attr("class","show");
            $("#studentList li i").each(function(){
                $(this).removeClass("isChoosed")
            });
            $("#studentList li").each(function(){
                $(this).removeClass("gray")
            });
        },
        showGradeList:function(){//点击选择年级下拉，获取年级列表
            this.showGrade=!this.showGrade
            this.gradeList=[]
            this.stuList=[]
            var self=this;
            var json={
                command: "cls/listsclassbygrade",
                loginid:lgid,
                sessionid:sid,
                pagenum:1,
                perpagenum:1000,
                courseid:self.courseid
            }
            function callback(res){
                console.log(JSON.stringify(res));
                if(res.sclassList.length==0){
                    self.choosedsclassname='该课程暂时没有班级可选'
                }else{
                    self.gradeList=res.sclassList;
                }
            }
            post("/cls/listsclassbygrade",json,callback,errorfn,errorConnect)
        },
        chooseGrade:function(index){//点击选择年级列表项
            this.showGrade=false;
            this.choosedGrade=this.gradeList.gradelist[index].gradename;
            this.gradeIndex=index;
        },
        showClassList:function(){//点击班级下拉
            if($("#chooseGrade").html()=="请选择年级"){
                layer.msg("请先选择年级");
                return
            }
            this.showClass=true;
        },
        chooseClass:function(value){//点击选择班级列表项，从后台获取该班级中的学生列表
            var self=this;
            self.choosedsclassname=value.classname;
            self.choosedsclassid=value.id;
            var json={
                command: "cls/listsclassStd",
                loginid:lgid,
                sessionid:sid,
                id:value.id,
                pagenum:1,
                perpagenum:1000
            };
            function callback(res){
                self.showGrade=false;
                self.stuList=res;
                $("#studentList li i").each(function(){
                    $(this).removeClass("isChoosed")
                });
                $("#studentList li").each(function(){
                    $(this).removeClass("gray")
                });
            };
            post("/cls/listsclassStd",json,callback,errorfn,errorConnect);
        },
        toggleAll:function(){//学生列表全选
            $("#studentList li:eq(0) i").toggleClass("isChoosed");
            $("#studentList li").not(".grayone").each(function(){
                if($("#studentList li:eq(0) i").hasClass("isChoosed")){
                    $(this).attr("class","gray");
                    $(this).children("i").attr("class","isChoosed")
                } else{
                    $(this).removeClass("gray");
                    $(this).children("i").attr("class","notChoosed")
                }
            })
            if($("#studentList li.gray").length>=1){
                $("#addStu").addClass("able");
            }
            else{
                $("#addStu").removeClass("able");
            };
        },
        toggleStu:function(index){//选择个别学生
            index++;
            $("#studentList li:eq("+index+") i").toggleClass("isChoosed");
            $("#studentList li:eq("+index+")").toggleClass("gray");
            if($("#studentList li i.isChoosed").length!=0){
                $("#addStu").addClass("able")
            }
            else{
                $("#addStu").removeClass("able")
            }
        },
        addStu:function(){//点击增加学生
            var self=this
            var tempobj={
                classname:self.choosedsclassname,
                sclassid:self.choosedsclassid,
                stdlist:[]
            }
            var repeat=0//0表示不重复
            if($("#studentList li.gray").length==0){
                layer.msg('请选择学生')
            }else if(self.choosedsclassname=='选择班级'){
                layer.msg('请选择班级')
            }else{
                for(var i=0;i<$("#studentList li.gray").length;i++){
                    tempobj.stdlist.push({
                        id:$("#studentList li.gray:eq("+i+")").data('id'),
                        name:$("#studentList li.gray:eq("+i+")").data('name'),
                        code:$("#studentList li.gray:eq("+i+")").data('code'),
                        sclassid:$("#studentList li.gray:eq("+i+")").data('sclassid'),
                    })
                }
                for(var i=0;i<self.choosedsclasslist1.length;i++){//班级去重校验
                    if(self.choosedsclasslist1[i].sclassid==tempobj.sclassid){
                        repeat=1//1表示重复
                    }
                }
                if(repeat==0){
                    self.choosedsclasslist1.push(tempobj)
                }else{
                    layer.msg("请不要重复添加班级")
                }
            }
        },
        removeStu:function(){//点击删除已选学生
            var self=this
            for(var i=0;i<self.removelist.length;i++){
                self.choosedsclasslist1=deleteItem(self.choosedsclasslist1,self.removelist[i])
            }
            $("#removeStu").removeClass("able")
            self.removelist=[]
        },
        setStuSave:function(){//保存已选学生，并显示到页面
            var self=this;
            if($("#studentList li.gray").length==0){
                layer.msg('请选择学生')
            }else if(self.choosedsclassname=='选择班级'){
                layer.msg('请选择班级')
            }else{
                self.showShadow=false;
                $("#setStu").attr("class","hide");
                for(var i=0;i<self.choosedsclasslist1.length;i++){
                    self.choosedsclasslist2.push(self.choosedsclasslist1[i])
                }
                self.choosedsclasslist1=[]
                self.choosedsclassname='选择班级'
                self.choosedsclassid=''
                self.stuList=[]
            }
        },
        deletestuitem:function(index){
            var self=this
            self.choosedsclasslist2=deleteItem(self.choosedsclasslist2,index)
        },
        closeStuBox:function(){//关闭选择学生模块
            $(".choosedStuList").empty();//清空本次已选择的班级学生
            this.showShadow=false;
            $("#setStu").attr("class","hide");
        },
        saveAll:function(){//信息填完后点击保存按钮，新生成一节课
            var self=this;
            self.teachers=[];
            var hasteacher3=false
            for(var i=0;i<self.choosedTeacherList.length;i++){//循环生成已选老师数组
                self.teachers.push({//已选老师
                    uid:self.choosedTeacherList[i].teacherid,
                    role:3
                })
                hasteacher3=true
            };
            for(var i=0;i<self.choosedTeacher2List.length;i++){//循环生成已选老师数组
                self.teachers.push({//已选教辅老师
                    uid:self.choosedTeacher2List[i].teacherid,
                    role:4
                })
            };
            function callback(response){
                var L=layer.alert("创建课程成功！", {title:"成功提示",icon:1,btn:['我知道了']}, function () {
                    layer.close(L);
                    window.parent.getCourseInfo(1,10)
                    closeAll();
                });
            };
            if(self.placeid.length==0||self.courseid.length==0||self.teachers.length==0||self.starttime.length==0||self.endtime.length==0){
                var L=layer.alert("所有 * 号为必选项！", {title:"错误提示",icon:5,btn:['我知道了']}, function () {
                    layer.close(L);
                });
            } else{//必选项都选了的情况下
                if(hasteacher3==false){
                    var L1=layer.alert("所有 * 号为必选项！", {title:"错误提示",icon:5,btn:['我知道了']}, function () {
                        layer.close(L1)
                    })
                    return
                }
                var sendstudents=[];
                for(var i=0;i<self.choosedsclasslist2.length;i++){
                    for(var j=0;j<self.choosedsclasslist2[i].stdlist.length;j++){
                        sendstudents.push({
                            uid:self.choosedsclasslist2[i].stdlist[j].id,
                            sclassid:self.choosedsclasslist2[i].sclassid
                        })
                    }
                }
                function errcode(res){
                    layer.msg(res.errdesc)
                    self.teachers=[]
                }
                var temp=[]//课前训练数组
                for(var i=0;i<self.preExeSetted.length;i++){
                    temp.push({
                        learnid:self.preExeSetted[i].learnid,
                        learntype:self.preExeSetted[i].learntype,
                        mincount:self.preExeSetted[i].mincount,
                        mintime:self.preExeSetted[i].mintime,
                        lasttime:self.preExeSetted[i].lasttime,
                        type:self.preExeSetted[i].type,
                    })
                }
                var json= {
                    command: "course/addcourseinfo",
                    sessionid: sid,
                    loginid: lgid,
                    placeid: self.placeid,
                    courseid: self.courseid,
                    teachers: self.teachers,//[老师数组{uid:"",role:""}]
                    startdt: self.starttime.slice(0, 10) + " 00:00:00",
                    starttime: self.starttime,
                    endtime: self.endtime,
                    type: 0,//(0表示固定课程，1表示临时预约)
                    learnids: self.learnids,//[训练项数组{learnid:""}]
                    students: sendstudents,//[学生数组{uid:""}]
                    tasks: temp,//课前训练数组learnid":9,"type":"0","mincount":10,"mintime":60,"lasttime":"2017-02-08 20:30:00","learntype":0
                    timelist:self.choosedtimelist
                }
                if(self.preExeSetted && self.preExeSetted.length == 0){
                    post("/course/addcourseinfo",json,callback,errcode,errorConnect)//新建课程接口
                }else{
                    if(sendstudents && sendstudents.length == 0){
                        layer.msg('请选择学生！')
                    }else{
                        post("/course/addcourseinfo",json,callback,errcode,errorConnect)//新建课程接口
                    }
                }
                
            }
        }
    }
});
function deleteTr(elem){//删除一条已选班级记录,把已选学生students数组中，在这个班里的学生都删除
    $(elem).parent("tr").remove();
    var newStuArr=[];
    for(index in v.students){
        if($(elem).parent().children().first().html()!= v.students[index].clsname){//如果不是要删除这个班级记录
            newStuArr.push({
                uid:v.students[index].uid,
                clsname:v.students[index].clsname
            })
        }
    };
    v.students=newStuArr;
}
vCenter("#newCourseBox","#setTeacher",".addOrDelete","#newCourseTime","#setStu","#setTeacher2","#setExercise");//设置页面元素垂直居中
//};
function vCenter(elem1,elem2,elem3,elem4,elem5,elem6,elem7){//css样式公用方法，设置已确定尺寸的块元素在其父元素里垂直方向居中
    for(var i= 0;i<arguments.length;i++){
        var parentH=$(arguments[i]).parent().height();
        var offsetTop=(parentH-$(arguments[i]).height())/2;
        $(arguments[i]).css({
            marginTop:offsetTop-10,
        });
    }
};
function searchPublic(elem){//选择老师，选择教辅老师，选择训练项共用的搜索功能
    var input=$(elem).prev("input").val();
    $(elem).parents("div").children("ul").children("li").attr("class","hide");
    var lis=$(elem).parents("div").children("ul").children("li").filter(function(index){
        return $(this).html().indexOf(input)!=-1
    }).attr("class","show");
    if($(elem).parents("div").children("ul").children("li.show").length==0){
        layer.msg("没有匹配的选项，请重新搜索");
        setTimeout(function(){
            $(elem).parents("div").children("ul").children("li").each(function(index,dom){
                if($(dom).hasClass("hide")){
                    $(dom).removeClass("hide");
                }
            });
        },3000)
    }
}
function search(elem){//选择上课地点，选择课程名共用的输入框搜索功能
    var value=$(elem).val();
    for(var i=0;i<$(elem).parent("div").children("ul").children("li").length;i++){
        if($(elem).parent("div").children("ul").children("li:eq("+i+")").html().indexOf(value)!=-1){//如果能匹配
            $(elem).parent("div").children("ul").children("li:eq("+i+")").attr("class","show")
        }
        else{
            $(elem).parent("div").children("ul").children("li:eq("+i+")").attr("class","hide")
        }
    }
}
//课前训练模块
function preExeSearch(elem,e){//点击课前任务，选择训练项，显示下拉列表，显示所有训练项
    e.stopPropagation()
    $(elem).next().toggleClass("show");
    var json={
        command: "learn/querylearninfo",
        loginid:lgid,
        sessionid:sid
    };
    function callback(response){
        v.exerciseList=response;
    };
    post("/learn/querylearninfo",json,callback,errcodefn,errfn)
};
function preExeMatch(elem){//搜索训练项
    // alert("aaaaaaaaaaaaaaaaaaa");
    var value=$(elem).val();
    $("#preExeBox>div>ul>li").each(function(){
            $(this).removeClass("hide");
    })
    $("#preExeBox>div>ul>li").each(function(){
        if($(this).html().indexOf(value)==-1){
            $(this).addClass("hide");
        }
    })
};
function choosePreExe(elem){
    $("#preExeBox>div").attr("class","hide");
    $("#choosedPreExe").html($(elem).children().text());
    $("#choosedPreExe").data("learnid",$(elem).data("learnid"));
    $("#choosedPreExe").data("type",$(elem).data("type"));
    $("#choosedPreExe").data("name",$(elem).data("name"));
};
function addExeTimes(elem){
    var value=$(elem).parent().prev().val();
    $(elem).parent().prev().val( parseInt(value)+1 );
};
function reduceExeTimes(elem){
    var value=$(elem).parent().prev().val();
    if(value<=0){
        return
    };
    $(elem).parent().prev().val(value-1);
};
function openCalendar(){
    v.showShadow=true;
    $("#preExePick").attr("class","show");
};
function closeCalendar(){
    v.showShadow=false;
    $("#preExePick").attr("class","hide");
}
$(document).bind('click',function(e){
    var elem= e.target
    if($(elem).attr('id')=='inputPlace' || $(elem).attr('id')=='inputClassName'){
        return
    }
    v.showPlace=false
    v.showCourseName=false
    $('#preExeBox>div').removeClass('show')
    $('.searchul li').each(function(){
        if($(this).hasClass('hide')){
            $(this).attr("class","show")
        }
    })
})