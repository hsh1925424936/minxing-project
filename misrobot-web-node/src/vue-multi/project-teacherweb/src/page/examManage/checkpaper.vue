<template>
	<div class="checktheory">
		<p class="nav"><span class="blue" @click="gobackexam">考试&试卷</span> > <span class="blue" @click="cancel">查看考试</span> > 查看试卷</p>
		<div class="content">
			<h2 class="center margintop">{{papername}}</h2>
			<p class="center">满分：{{score}}分
				<span class="stutotalscore">得分：{{stuscore}}分</span>
			</p>
			<p class="paddingborder">班级:<span>{{classname}}</span> 姓名:<span>{{name}}</span>  学号:<span>{{username}}</span></p>
			<div class="questionlist" v-for="(item,index) in testpaper">
				<div class="mainquestiontitle">
					{{index+1 | maintitlenum}}、{{item.nickname}}
					<span>(共{{item.totalnum}}小题,总分: {{item.totalscore}}分)</span>
				</div>
				<!--单选多选问答判断-->
				<div class="mainquestion" v-for="(mainitem,mainindex) in item.content" v-if="item.cateid!=6">
					<div class="littletitle">
						{{mainindex+1}}、{{mainitem.questionbasename}}
						<span>({{mainitem.score}}分)</span>
					</div>
					<br v-if="item.cateid!=4&&item.cateid!=5" />
					<div class="choiceanswer" v-if="item.cateid!=4&&item.cateid!=5">
						<div class="choiceanswercell" v-for="(choiceitem,choiceindex) in mainitem.questionitem">
							<span>{{choiceitem.itemname}}</span>{{choiceitem.content}} 
						</div>
					</div>
					<p class="correctchoice" v-if="item.cateid!=4">考生答案：{{mainitem.stuanswer}}</p>
					<p class="correctchoice" v-if="item.cateid==4">考生答案：{{mainitem.stuanswer | answertransform}}</p>
					<p class="correctchoice" v-if="item.cateid!=4">正确答案：{{mainitem.answer}}</p>
					<p class="correctchoice" v-if="item.cateid==4">正确答案：{{mainitem.answer | answertransform}}</p>
					<i class="el-icon-check judgeicon" v-if="mainitem.answer===mainitem.stuanswer"></i>
					<i class="el-icon-close judgeicon" v-if="mainitem.answer!==mainitem.stuanswer" style="color: red;"></i>
					<div class="scorebox">
						<span>{{mainitem.score}}分</span>
					</div>
				</div>
			</div> 
			<p class="line">
				<el-button @click="cancel">返回</el-button>
			</p>
		</div>
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'	
export default {
	
data() {
  	return {
  		stuid:this.$route.query.stuid,
  		examid:this.$route.query.examid,
  		paperid:this.$route.query.paperid,
  		name:this.$route.query.name,
  		username:this.$route.query.username,
  		classname:'',
  		testpaper:[],
  		categorylist:[],
		papername:'',
		score:0,
		stuscore:0,
		gradeinfo:[]//试卷试题成绩信息
  	}
},
filters: {
    maintitlenum: function (value) {
      	var num=value;
		switch (value){
			case 1: num="一";
				break;
			case 2: num="二";
				break;
			case 3: num="三";
				break;
			case 4: num="四";
				break;
			case 5: num="五";
				break;
			case 6: num="六";
				break;
			case 7: num="七";
				break;
			case 8: num="八";
				break;
			case 9: num="九";
				break;
			default:
				break;
		}
		return num;
    },
    groupsecondindextransform: function (value) {
     	var num=value;
		switch (value){
			case 1: num="(一)";
				break;
			case 2: num="(二)";
				break;
			case 3: num="(三)";
				break;
			case 4: num="(四)";
				break;
			case 5: num="(五)";
				break;
			case 6: num="(六)";
				break;
			case 7: num="(七)";
				break;
			case 8: num="(八)";
				break;
			case 9: num="(九)";
				break;
			default:
				break;
		}
		return num;
    },
    answertransform: function (value) {
     	if(value==0){
			return "正确";
		}if(value==1){
			return "错误";
		}else{
			return ' '
		}
    }
},
mounted(){
	this.querystuexaminfo();
	this.querypaperinfo();
	this.queryclass();
},
methods:{
	queryclass(){
		var self=this;
		post('/studentapply/queryclass',{
            command:"studentapply/queryclass",
            sessionid:getCookie('sid'),
            loginid:getCookie('uid'),
			stuid:self.stuid,
        }).done((res)=>{
            if(res.errcode==0){
            	self.classname=res.sclassList[0].name
            }
        })
	},
	querystuexaminfo(){//查询成绩信息
		var self=this;
		post('/unifyexam/querystuexaminfo',{
            command:"unifyexam/querystuexaminfo",
            sessionid:getCookie('sid'),
            loginid:getCookie('uid'),
			paperid:self.paperid,
			uid:self.stuid,
			examid:self.examid
        }).done((res)=>{
            if(res.errcode==0){
            	self.gradeinfo=res.gradeinfo;
				self.querypapercategorylist();
				self.stuscore=0;
				for (var i=0;i<self.gradeinfo.length;i++) {
					self.stuscore+=parseFloat(self.gradeinfo[i].score)
				}
            }
        })
	},
	querypaperinfo(){//查询试卷信息
		var self=this;
		post('/exampaper/viewpaper',{
            command:"exampaper/viewpaper",
            sessionid:getCookie('sid'),
            loginid:getCookie('uid'),
			paperid:self.paperid,
        }).done((res)=>{
            if(res.errcode==0){
            	self.papername=res.paperinfo.name;
				self.score=res.paperinfo.score;
            }
        })
	},
	querypapercategorylist(){//查询题类
		var self=this;
		post('/exampaper/querypapercategorylist',{
            command:"exampaper/querypapercategorylist",
			sessionid:getCookie("sid"),
			loginid:getCookie("uid"),
			paperid:self.paperid,
        }).done((res)=>{
            if(res.errcode==0){
            	self.categorylist=res.categoryList;
            }
        })
	},
	querypaperquestion(mainid,cateid,totalnum,nickname,scoresettype,score,totalscore,priority){//查询试题详情并拼接试卷对象
		var self=this;
    	post('/exampaper/querypaperquestion',{
            command:"exampaper/querypaperquestion",
			sessionid:getCookie("sid"),
			loginid:getCookie("uid"),
			paperid:self.paperid,
			mainid:mainid,
			cateid:cateid
        }).done((res)=>{
            if(res.errcode==0){
            	if(cateid==6){//如果cateid是组合题
					var questionlist=[];
					for (var i=0;i<res.questionlist.length;i++) {
						var grouplist=res.questionlist[i].grouplist;
						if (grouplist!=null) {
							for (var a=0;a<grouplist.length;a++) {//三级题目排序
								for (var b=a+1;b<grouplist.length;b++) {
									if (grouplist[a].priority>grouplist[b].priority) {
										var obj=grouplistsort[a];
										grouplist[a]=grouplist[b];
										grouplist[b]=obj;
									}
								}
							}
							for (var a=0;a<grouplist.length;a++) {//三级题目排序
								grouplist[a].priority=a;
							}
						}
						
						questionlist.push({
							id:res.questionlist[i].id,
							questionbaseid:res.questionlist[i].questionbaseid,
							score:res.questionlist[i].score,
							priority:res.questionlist[i].priority,
							mainid:res.questionlist[i].mainid,
							paperid:res.questionlist[i].paperid,
							questionbasename:res.questionlist[i].questionbasename,
							questionitem:res.questionlist[i].questioinitem,
							answer:res.questionlist[i].answer,
							grouplist:grouplist
						})
					}
					for (var i=0;i<questionlist.length;i++) {//二级题目排序
						for (var j=i+1;j<questionlist.length;j++) {
							if (questionlist[i].priority>questionlist[j].priority) {
								var obj=questionlist[i];
								questionlist[i]=questionlist[j];
								questionlist[j]=obj;
							}
						}
					}
					for (var i=0;i<questionlist.length;i++) {//二级题目排序
						questionlist[i].priority=i;
					}
					if (cateid==5||cateid==6) {
						scoresettype=0;
					}
					self.testpaper.push({
						id:mainid,
						cateid:cateid,//题类
						totalnum:totalnum,//试题总数
						nickname:nickname,//分类名称
						scoresettype:scoresettype,//是否统一设置
						score:score,//试题分值
						totalscore:totalscore,//试题总分值
						priority:priority,//排序
						content:questionlist//题类下属小题数组
					});
					self.sorttestpaper();//一级题目排序
				}else{
					for (var i=0;i<res.questionlist.length;i++) {//二级题目排序
						for (var j=i+1;j<res.questionlist.length;j++) {
							if (res.questionlist[i].priority>res.questionlist[j].priority) {
								var obj=res.questionlist[i];
								res.questionlist[i]=res.questionlist[j];
								res.questionlist[j]=obj;
							}
						}
					}
					for (var i=0;i<res.questionlist.length;i++) {//二级题目排序&&添加题目成绩
						res.questionlist[i].priority=i;
						var stuanswer='';
						var score=0;
						for(var j=0;j<self.gradeinfo.length;j++){
							if(self.gradeinfo[j].questionbaseid===res.questionlist[i].questionbaseid){
								stuanswer=self.gradeinfo[j].answer1;
								score=self.gradeinfo[j].score;
							}
						}
						res.questionlist[i].stuanswer=stuanswer;
						res.questionlist[i].score=score;
					}
					if (cateid==5||cateid==6) {
						scoresettype=0;
					}
					self.testpaper.push({
						id:mainid,
						cateid:cateid,//题类
						totalnum:totalnum,//试题总数
						nickname:nickname,//分类名称
						scoresettype:scoresettype,//是否统一设置
						score:score,//试题分值
						totalscore:totalscore,//试题总分值
						priority:priority,//排序
						content:res.questionlist//题类下属小题数组
					});
					self.sorttestpaper();//一级题目排序
				}
            }
        })
	},
	sorttestpaper(){//排序
		for (var i=0;i<this.testpaper.length;i++) {
			for (var j=i+1;j<this.testpaper.length;j++) {
				if (this.testpaper[i].priority>this.testpaper[j].priority) {
					var obj=this.testpaper[i];
					this.testpaper[i]=this.testpaper[j];
					this.testpaper[j]=obj;
				}
			}
		}
	},
	cancel(){
		history.go(-1)
	},
	gobackexam(){
		this.$router.push({
		    name:'exam_test',
		    query:{
		    	
		    }
	    })
	}
},
watch:{
	categorylist:function(newcategorylist){//监听mainid
		for(var i=0;i<this.categorylist.length;i++){
			this.querypaperquestion(this.categorylist[i].id,this.categorylist[i].cateid,this.categorylist[i].totalnum,this.categorylist[i].nickname,this.categorylist[i].scoresettype,this.categorylist[i].score,this.categorylist[i].totalscore,this.categorylist[i].priority);
		}
	}
},

}
</script>

<style scoped>
.nav{
	font-size: 13px;
	margin: 5px 0;
}
.blue{
	color:#20a0ff;
	cursor: pointer;
}
.content{
	border: 1px solid #bfcbd9;
	padding: 40px 0;
}
.center{
	text-align: center;
	margin-bottom: 30px;
	position: relative;
}
.stutotalscore{
	position: absolute;
	right: 40px;
	top: -20px;
    color: blue;
    font-size: 40px;
}
.paddingborder{
	padding-bottom: 30px;
	border-bottom: 1px solid #bfcbd9;
	text-align: center;
}
.paddingborder span{
	text-decoration-line: underline;
}
.line{
	text-align: center;
	margin: 50px auto;
}
.questionlist{font-size: 15px;text-align: left;width: 100%;}
.mainquestiontitle{padding: 10px 2.5%;position: relative;min-height: 40px;line-height: 40px;width: 95%;border-bottom: 1px solid #bfcbd9;}
.mainquestion{padding: 10px 0 10px 5%;position: relative;width: 95%;border-bottom: 1px solid #bfcbd9;}
.scorebox{width: 12%;height: 100%;position: absolute;right: 0;top: 0;text-align: center;display: table-cell;border-left: 1px solid #bfcbd9;vertical-align: middle;}
.scorebox span{display: flex;justify-content: center;align-items: center;height: 100%;}
.littletitle{padding: 10px 0;display: inline-block;}    
.choiceanswer{display: inline-block;text-align: left;width: 86%;}
.choiceanswercell{display: inline-block; margin: 10px 20px;}
.judgeicon{position: absolute; bottom: 20px; left: 50%; font-size: 40px;}
</style>