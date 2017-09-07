var action=window.location.href.split("=")[1];
var content;
var updateCourse="";//是新建课程no，还是修改课程yes？
var sid="";//sessionid从c++获取
var lgid="";//loginid从c++获取
var pTop=(window.screen.availHeight-620)/2;//屏幕上方留白距离
var isTrueSave=-1;//-1表示用户选择的内容不合法，不能保存创建的课程
function errorfn(response){//通用的错误描述函数
    if(response.errcode==9904){
        layer.msg("登录信息失效，请重新登录！")
        setTimeout(function(){
            content.clickCancel()
        },3000)
    }else{
        layer.msg(response.errdesc)
    }
};
function errorConnect(){//通用的连接失败函数
    layer.msg("连接服务失败")
};
//window.onload = function() {
    new QWebChannel(qt.webChannelTransport, function(channel) {
        content = channel.objects.content;
        document.getElementById("closeAll").onclick = function() {//点击保存，给后台传数据，成功后调用c++方法关闭浏览器，回到主界面
            if(updateCourse=='yes'){
                content.clickBtn2();
            }else{
                content.clickCancel();
            }
        };
        $("#closeBox").click(function(){//点击右上角关闭，调用c++方法关闭浏览器，回到主界面
            content.clickCancel();
        });
        content.sendText.connect(function(message) {
            var newstr=message.replace(/\&quot;/g,'"');//将c++传过来的用户登陆信息先转换成json对象。
            var json=JSON.parse(newstr);
            sid=json.sessionid;
            lgid=json.uid;
            if(action=="modify"){
                updateCourse="yes";
                $("#headTitle").text("修改课程");
                $("#closeAll").text('取消');
                var data={
                    command: "course/querycoursedetailinfo",
                    loginid: lgid,
                    sessionid:sid,
                    scheduleid:json.scheduleid
                };
                function callback(response){
                    v.placeid=response.placeid;
                    v.learnids=response.learnids;
                    v.students=response.students;
                    v.choosedExerciseList=response.learnids;
                    if(v.choosedExerciseList.length!=0){//说明这节课有训练项
                        $("#exercise").removeClass("hide");
                    }
                    if(v.students.length!=0){//说明这节课选择了学生
                        var clsnameArr=[]//班级name数组
                        for(index in v.students){//取出班级name数组
                            clsnameArr.push(v.students[index].clsname)
                        }
                        var noRepeat=notRepeat(clsnameArr)
                        for(var i=0;i<noRepeat.length;i++){
                            var tempobj={
                                classname:noRepeat[i],
                                sclassid:'',
                                stdlist:[]
                            }
                            for(var j=0;j< v.students.length;j++){
                                if(v.students[j].clsname==noRepeat[i]){//如果这个学生在的班级，等于去重后数组的班级
                                    tempobj.stdlist.push({
                                        id:v.students[j].uid,
                                        name:v.students[j].name
                                    })
                                    tempobj.sclassid=v.students[j].clsid
                                }
                            }
                            v.choosedsclasslist2.push(tempobj)
                            tempobj={}
                        }
                        console.log(JSON.stringify(v.choosedsclasslist2))
                    }
                };
                postJson("/course/querycoursedetailinfo",data,callback,errorfn,errorConnect)
                v.headTitle="修改课程";
                v.scheduleid=json.scheduleid;
                v.choosedPlace=json.roomnum;
                v.courseid=json.courseid;
                v.starttime=json.starttime;
                v.endtime=json.endtime;
                v.choosedCourseName=json.coursename;
                for(index in json.teachers){
                    if(json.teachers[index].role==3){//3表示授课老师
                        v.choosedTeacherList.push({
                            teacherid:json.teachers[index].uid,
                            teacherame:json.teachers[index].name
                        })
                    }else{//教辅老师
                        v.choosedTeacher2List.push({
                            teacherid:json.teachers[index].uid,
                            teacherame:json.teachers[index].name
                        })
                    }
                }
                $("div.choosedTeacher").removeClass("hide");
                $("div.choosedTimeRange").removeClass("hide");//用jquery展示原有课程时间
                $("div.choosedTimeRange").html(json.starttime.slice(0,16)+"~"+json.endtime.slice(11,16));
                if(v.choosedTeacher2List.length!=0){//说明这节课有辅导老师
                    $("div.choosedTeacher2").removeClass("hide")
                }
            }else{
                updateCourse='no';
                $("#headTitle").text("创建新课程");
                $("#closeAll").text('关闭');
            }
        });
        var timern=setTimeout(function(){
            content.SendLoginMsg();
        },500);
    });
    var myCalendar=Vue.extend({//把jqueryui日历封装到vue组件
        template:"<div id='datepicker' class='calendar'></div>"
    });
    Vue.component('calendar',myCalendar);
    var timer=setTimeout(function(){
        $("#datepicker").datepicker({ firstDay: 1});//初始化jqueryui日历
    },1000);
    Vue.filter('type',function(value){//过滤训练项类型
        if(value=="0"){
            return "在线训练"
        }
        else if(value=="1"){
            return "模型"
        }
        else{
            return "智能设备"
        }
    });
    var v=new Vue({
        el:"#vm",
        data:{
            //新建课程接口/course/addcousreinfo
            //输入sessionid,loginid
            headTitle:"",
            checkList:[],
            allTimeList:'',
            timeList:'',
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
            choosedGrade:"请选择年级",//用户选择的年级，显示到页面
            choosedClass:"请选择班级",//用户选择的班级，显示到页面
            choosedClassId:"",//用户选择的班级id
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
            startH:["06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22"],
            endH:["06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
            startMin:["00","05","10","15","20","25","30","35","40","45","50","55"],
            endMin:["00","05","10","15","20","25","30","35","40","45","50","55"],
            time:["08","00","12","00"],
            tn:true,
            ty:false,
            choosedsclassname:'选择班级',
            choosedsclassid:'',
            choosedsclasslist1:[],//左右选择时的已选班级数组
            choosedsclasslist2:[],//展示到上一级页面的班级数组
            removelist:[],//从右往左删除已选班级和学生
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
            getPlaceList:function() {//获取授课地点的函数
                var self=this;
                var json={
                    command: "site/sitelist",
                    loginid: lgid,
                    sessionid:sid
                };
                function callback(response){
                    self.coursePlace=response;
                    self.showPlace=true;//从后台获取到授课地点后，把列表显示出来
                };
                postJson("/site/sitelist",json,callback,errorfn,errorConnect)
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
                postJson("/cls/teacherlist",json,callback,errorfn,errorConnect)
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
                //判断已选老师是否包含老师自己
                //lgid登录用户的老师id
                var isSelfContained=-1;//-1表示已选老师不包含自己
                var self=this;
                for(var i=0;i<self.choosedTeacherList.length;i++){
                    if(self.choosedTeacherList[i].teacherid==lgid){
                        isSelfContained=0;//0表示包含登录者
                    }
                };
                if(isSelfContained==-1){
                    layer.msg("已选老师必须包含登录者！")
                }
                else{
                    $("div.choosedTeacher").removeClass("hide");
                    this.showShadow=false;
                    $("#setTeacher").attr("class","hide");
                }
            },
            closeSetTeacherBox:function(){//关闭选择老师模块
                this.showShadow=false;
                $("#setTeacher").attr("class","hide");
            },
            getCourseNameList:function(){//获取课程名称接口
                var self=this;
                self.showCourseName=true;
                var json={
                    command: "course/querycoursenamelist",
                    loginid: lgid,
                    sessionid: sid
                };
                function callback(response){
                    self.courseNameList=response;
                };
                postJson("/course/querycoursenamelist",json,callback,errorfn,errorConnect)
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
                postJson("/course/addcoursename",json,callback,errorfn,errorConnect)
            },
            closeNewCourseBox:function(){
                this.showShadow=false;
                $("#newCourseBox").attr("class","hide");
            },
            setTime:function(){
                this.showShadow=true;
                $("#newCourseTime").attr("class","show");
                var self=this;
		        $.ajax({
		            type: "post",
		            url: "/examapply/queryexamtimeslist",
		            async: true,
		            data: JSON.stringify({
		                '1': {
		                    command: "examapply/queryexamtimeslist",
		                    sessionid: sid,
		                    loginid: lgid
		
		                }
		            }),
		            success: function(data) {
		                self.timeList=JSON.parse(data['1'].timeslist);
		
		            }
		        });
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
                var now=new Date();
                if($("span.ui-datepicker-year").html().slice(0,4) < now.getFullYear()){//先判断年
                    layer.msg("您选择的年份已过期");
                    return
                };
                if(parseInt($("span.ui-datepicker-year").html().slice(0,4)) == now.getFullYear() && parseInt($("span.ui-datepicker-month").html()) < (now.getMonth()+1)){
                    layer.msg("您选择的月份已过期");
                    return
                }
                if(parseInt($("span.ui-datepicker-year").html().slice(0,4)) == now.getFullYear() && parseInt($("span.ui-datepicker-month").html()) == (now.getMonth()+1) && parseInt($("a.ui-state-active").html()) < now.getDate()){
                    layer.msg("您选择的日期已过期");
                    return
                }
                
                if(this.checkList.length==0){
	            	layer.msg('请选择上课时间')
	            	return
	            }
                var self=this;
            if (self.checkList.length==1) {
            	
                var newCourseTime={//声明已选时间对象
                    year:$("span.ui-datepicker-year").html().slice(0,4),
                    month:function(){
                        if($("span.ui-datepicker-month").html().length==3){
                            return $("span.ui-datepicker-month").html().slice(0,2)
                        }
                        else{
                            return ("0"+$("span.ui-datepicker-month").html()).slice(0,2)
                        }
                    },
                    day:function(){
                        if($("a.ui-state-active").html().length==2){
                            return $("a.ui-state-active").html()
                        }
                        else{
                            return "0"+$("a.ui-state-active").html()
                        }
                    },
                    date:function(){//上课日期，格式：“2016-01-01 00:00:00”
                        return this.year+"-"+this.month()+"-"+this.day()+" 00:00:00";
                    },
                    startTime:function(){//上课开始时间
                        return this.year+"-"+this.month()+"-"+this.day()+" "+self.checkList['0'].starttime;
                    },
                    endTime:function(){//上课结束时间
                        return this.year+"-"+this.month()+"-"+this.day()+" "+self.checkList['0'].starttime;
                    }
                };
                
                var newCurrentStr1=newCourseTime.year+"-"+newCourseTime.month()+"-"+newCourseTime.day();
            	var newTime1=newCurrentStr1+" "+self.checkList['0'].starttime;
            	if(parseInt($("span.ui-datepicker-year").html().slice(0,4)) == now.getFullYear() && parseInt($("span.ui-datepicker-month").html()) == (now.getMonth()+1) && $("a.ui-state-active").html() == now.getDate() && Date.parse(newTime1)< now.getTime()){
                  layer.msg("您选择的时间已过期");
                  return
             }
                
                self.starttime=newCourseTime.startTime();
                self.endtime=newCourseTime.endTime();
                $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+" "+self.checkList['0'].starttime.substring(0,5)+"~"+self.checkList['0'].endtime.substring(0,5));

                $("div.choosedTimeRange").removeClass("hide");
                self.showShadow=false;
                $("#newCourseTime").attr("class","hide");
                self.allTimeList=[];
            }else{
                var self=this;
                var newCourseTime={//声明已选时间对象
                    year:$("span.ui-datepicker-year").html().slice(0,4),
                    month:function(){
                        if($("span.ui-datepicker-month").html().length==3){
                            return $("span.ui-datepicker-month").html().slice(0,2)
                        }
                        else{
                            return ("0"+$("span.ui-datepicker-month").html()).slice(0,2)
                        }
                    },
                    day:function(){
                        if($("a.ui-state-active").html().length==2){
                            return $("a.ui-state-active").html()
                        }
                        else{
                            return "0"+$("a.ui-state-active").html()
                        }
                    },
                    date:function(){//上课日期，格式：“2016-01-01 00:00:00”
                        return this.year+"-"+this.month()+"-"+this.day()+" 00:00:00";
                    },
                    startTime:function(){//上课开始时间
                        return this.year+"-"+this.month()+"-"+this.day()+" "+self.checkList['0'].starttime;
                    },
                    endTime:function(){//上课结束时间
                        return this.year+"-"+this.month()+"-"+this.day()+" "+self.checkList['0'].starttime;
                    }
                };
                var newCurrentStr2=newCourseTime.year+"-"+newCourseTime.month()+"-"+newCourseTime.day();
                self.allTimeList=[];
                for (var i=0;i<self.checkList.length;i++) {
                    self.allTimeList.push({starttime:newCurrentStr2+" "+self.checkList[i].starttime,endtime:newCurrentStr2+" "+self.checkList[i].endtime})
                }
                var newCurrentStr11=newCourseTime.year+"-"+newCourseTime.month()+"-"+newCourseTime.day();
            	var newTime11=newCurrentStr11+" "+self.checkList[self.checkList.length-1].starttime;
            	if(parseInt($("span.ui-datepicker-year").html().slice(0,4)) == now.getFullYear() && parseInt($("span.ui-datepicker-month").html()) == (now.getMonth()+1) && $("a.ui-state-active").html() == now.getDate() && Date.parse(newTime11)< now.getTime()){
                  layer.msg("您选择的时间已过期");
                  return
             }
                $.ajax({
                    type: "post",
                    url: "/learn/isschedulemerge",
                    async: true,
                    data: JSON.stringify({
                        '1': {
                            command: "learn/isschedulemerge",
                            sessionid: sid,
                            loginid: lgid,
                            timelist:self.allTimeList
                        }
                    }),
                    success: function(data) {

                        if (data['1'].errcode==0) {
                            console.log(self.checkList);

                            var allTime="";
                            var newStartTime=[];
                            var newEndTime=[];
                            for (var i=0;i<self.checkList.length;i++) {
                                newStartTime.push(self.checkList[i].starttime);
                                newEndTime.push(self.checkList[i].endtime);
                            }
                            
                            self.starttime=newCourseTime.startTime();
                            self.endtime=newCourseTime.endTime();
                            allTime=newStartTime.sort()[0].substring(0,5)+"~"+newEndTime.sort()[newEndTime.length-1].substring(0,5);
                            $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+"  "+allTime);

                            $("div.choosedTimeRange").removeClass("hide");
                            self.showShadow=false;
                            $("#newCourseTime").attr("class","hide");
                        } else{
                            layer.msg(data['1'].errdesc);
                            return
                        }
                    }
                });
            }
                
                
                
                
                
                
                
                
                
                
//              if(parseInt($("span.ui-datepicker-year").html().slice(0,4)) == now.getFullYear() && parseInt($("span.ui-datepicker-month").html()) == (now.getMonth()+1) && $("a.ui-state-active").html() == now.getDate() && parseInt(this.time[2])< now.getHours()){
//                  layer.msg("您选择的时间已过期");
//                  return
//              }
//              if(parseInt(this.time[0])*60+parseInt(this.time[1]) >= parseInt(this.time[2])*60+parseInt(this.time[3])){//如果课程开始时间大于结束时间
//                  layer.msg("结束时间应晚于开始时间");
//                  return
//              }
//              var newCourseTime={//声明已选时间对象
//                  year:$("span.ui-datepicker-year").html().slice(0,4),
//                  month:function(){
//                      if($("span.ui-datepicker-month").html().length==3){
//                          return $("span.ui-datepicker-month").html().slice(0,2)
//                      }
//                      else{
//                          return ("0"+$("span.ui-datepicker-month").html()).slice(0,2)
//                      }
//                  },
//                  day:function(){
//                      if($("a.ui-state-active").html().length==2){
//                          return $("a.ui-state-active").html()
//                      }
//                      else{
//                          return "0"+$("a.ui-state-active").html()
//                      }
//                  },
//                  startHour:$("#beginH").html(),
//                  startMin:$("#beginM").html(),
//                  endHour:$("#endH").html(),
//                  endMin:$("#endM").html(),
//                  date:function(){//上课日期，格式：“2016-01-01 00:00:00”
//                      return this.year+"-"+this.month()+"-"+this.day()+" 00:00:00";
//                  },
//                  startTime:function(){//上课开始时间
//                      return this.year+"-"+this.month()+"-"+this.day()+" "+this.startHour+":"+this.startMin+":00";
//                  },
//                  endTime:function(){//上课结束时间
//                      return this.year+"-"+this.month()+"-"+this.day()+" "+this.endHour+":"+this.endMin+":00";
//                  }
//              };
//              this.starttime=newCourseTime.startTime();
//              this.endtime=newCourseTime.endTime();
//              //把已选时间显示到主界面
//              $("div.choosedTimeRange").html(newCourseTime.date().slice(0,10)+" / "+newCourseTime.startTime().slice(11,16)+"~"+newCourseTime.endTime().slice(11,16));
//              $("div.choosedTimeRange").show();
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
                postJson("/cls/teacherlist",json,callback,errorfn,errorConnect)
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
                postJson("/learn/querylearninfo",json,callback,errorfn,errorConnect)
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
                    layer.msg("请先选择课程");
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
                    console.log(JSON.stringify(res))
                    if(res.sclassList.length==0){
                        self.choosedsclassname='该课程暂时没有班级可选'
                    }else{
                        self.gradeList=res.sclassList;
                    }
                }
                postJson("/cls/listsclassbygrade",json,callback,errorfn,errorConnect)
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
                }
                function callback(res){
                    self.showGrade=false
                    self.stuList=res
                    $("#studentList li i").each(function(){
                        $(this).removeClass("isChoosed")
                    })
                    $("#studentList li").each(function(){
                        $(this).removeClass("gray")
                    })
                }
                postJson("/cls/listsclassStd",json,callback,errorfn,errorConnect)
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
                var flag=-1;
                for(var i=0;i<self.choosedTeacherList.length;i++){//循环生成已选老师数组
                    self.teachers.push({//已选老师
                        uid:self.choosedTeacherList[i].teacherid,
                        role:3
                    })
                };
                for(var i=0;i<self.choosedTeacher2List.length;i++){//循环生成已选老师数组
                    self.teachers.push({//已选教辅老师
                        uid:self.choosedTeacher2List[i].teacherid,
                        role:4
                    })
                };
                for(var i=0;i<self.teachers.length;i++){
                    if(self.teachers[i].uid==lgid){//如果已选老师包含登录者
                        flag=0;
                    }
                };
                var sendstudents=[];
                for(var i=0;i<self.choosedsclasslist2.length;i++){
                    for(var j=0;j<self.choosedsclasslist2[i].stdlist.length;j++){
                        sendstudents.push({
                            uid:self.choosedsclasslist2[i].stdlist[j].id,
                            sclassid:self.choosedsclasslist2[i].sclassid
                        })
                    }
                }
                function callback(response){
                    //self.scheduleid=response.scheduleid;
                    var msg=updateCourse=="no"?"创建课程成功！":"修改课程成功！";
                    var L=layer.alert(msg, {title:"成功提示",icon:1,btn:['我知道了']}, function () {
                        layer.close(L);
                        content.clickOk();//返回c++界面
                    });
                };
                if(self.placeid.length==0||self.courseid.length==0||self.teachers.length==0||self.starttime.length==0||self.endtime.length==0){
                    var L=layer.alert("所有 * 号为必选项！", {title:"错误提示",icon:5,btn:['我知道了']}, function () {
                        layer.close(L);
                    });
                }
                else{
                    if(flag==0){
                        if(updateCourse=="no"){//新建课程接口
                            function errcode(res){
                                layer.msg(res.errdesc);
                                self.teachers=[];
                            };
                            var json={
                                command:"course/addcourseinfo",
                                sessionid:sid,
                                loginid:lgid,
                                placeid:self.placeid,
                                courseid:self.courseid,
                                teachers:self.teachers,//[老师数组{uid:"",role:""}]
                                startdt:self.starttime.slice(0,10)+" 00:00:00",
                                starttime:self.starttime,
                                endtime:self.endtime,
                                type:0,//(0表示固定课程，1表示临时预约)
                                learnids:self.learnids,//[训练项数组{learnid:""}]
                                students:sendstudents//[学生数组{uid:""}]
                            };
                            postJson("/course/addcourseinfo",json,callback,errcode,errorConnect)
                        }else{//修改课程接口
                            function errcode1(res){
                                layer.msg(res.errdesc);
                                self.teachers=[];
                            };
                            var newlearnids=[];//输入的learnids只取learnid字段
                            for(index in self.learnids){
                                newlearnids.push({
                                    learnid:self.learnids[index].learnid
                                })
                            };
                            var json={
                                command:"course/updatecourseinfo",
                                sessionid:sid,
                                loginid:lgid,
                                placeid:self.placeid,
                                courseid:self.courseid,
                                scheduleid:self.scheduleid,
                                teachers:self.teachers,//[老师数组{uid:"",role:""}]
                                startdt:self.starttime.slice(0,10)+" 00:00:00",
                                starttime:self.starttime,
                                endtime:self.endtime,
                                learnids:newlearnids,//[训练项数组{learnid:""}]
                                students:sendstudents//[学生数组{uid:""}]
                            };
                            postJson("/course/updatecourseinfo",json,callback,errcode1,errorConnect)
                        }
                    }
                    else{
                        var L=layer.alert("已选老师必须包含登录者！", {title:"错误提示",icon:5,btn:['我知道了']}, function () {
                            layer.close(L);
                        });
                    }
                }
            }
        }
    });
    $("#content").css({
        marginTop:pTop-10,
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
};
function ChoosedStuDown(obj){//点击右边已选学生list
    $(obj).toggleClass("gray");
    if($("li.choosedClassHead.gray").length!=0){
        $("#removeStu").addClass("able");
    }
    else{
        $("#removeStu").removeClass("able");
    };
    $(obj).children("ul").slideToggle();
};
function notRepeat(arr){//数组去重函数
    var noRepeat=[];
    noRepeat[0]=arr[0];
    for(var i=1;i<arr.length;i++){
        var repeat=false;
        for(var j=0;j<noRepeat.length;j++){
            if(arr[i]==noRepeat[j]){
                repeat=true;
                break
            }
        };
        if(!repeat){
            noRepeat.push(arr[i]);
        }
    };
    return noRepeat
}
