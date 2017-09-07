<template>
	<div class="checktheory">
		<h2 class="center margintop edit">
			{{papername}}
			<button type="button" class="editbtn btnhover"  @click="changepapernamepop()">更名</button>
		</h2>
		<p class="center edit">
			满分：{{paperscore}}分
			<button type="button" class="editbtn btnhover" style="top: 2px;"  @click="setpaperscorepop()">设置总分</button>
		</p>
		<p class="center">班级________  姓名________  学号________</p>
		<div class="questionlist" v-for="(item,index) in testpaper">
			<div class="mainquestiontitle edit">
				{{index+1 | maintitlenum}}、{{item.nickname}}
				<span>(共{{item.totalnum}}小题,总分: {{item.totalscore}}分)</span>
				<div class="editbtnbox">
					<button type="button" class="editbtn"  @click="changequestionname(item.nickname,index)">更名</button>
					<button type="button" class="editbtn" @click="questionscorepop(item.score,item.scoresettype,index)" v-if="item.cateid==1||item.cateid==2||item.cateid==4">设置分值</button>
					<button type="button" class="editbtn" @click="upquestion(index)" v-if="index+1!=1">上移</button>
					<button type="button" class="editbtn" @click="downquestion(index)" v-if="index+1!=testpaper.length">下移</button>
				</div>
			</div>
			<!--单选多选问答判断-->
			<div class="mainquestion edit choicebottom" v-for="(mainitem,mainindex) in item.content" v-if="item.cateid!=6">
				<div class="littletitle">
					{{mainindex+1}}、{{mainitem.questionbasename}}
					<span>({{mainitem.score}}分)</span>
				</div>
				<br v-if="item.cateid!=4&&item.cateid!=5" />
				<div v-if="mainitem.adjtype=='picture'">
					<img v-for="picitem in mainitem.picturelist" :src="picitem.filepath" class="paperpic"/>
				</div>
				<div v-if="mainitem.adjtype=='video'">
					<video width="320" height="240" controls>
					  <source :src="mainitem.picturelist[0].filepath" type="video/mp4">
					</video>
				</div>
				<div v-if="mainitem.adjtype=='audio'">
					<audio controls>
					    <source :src="mainitem.picturelist[0].filepath">
					</audio>
				</div>
				<div class="choiceanswer" v-if="item.cateid!=4&&item.cateid!=5">
					<div class="choiceanswercell" v-for="(choiceitem,choiceindex) in mainitem.questionitem">
						<span>{{choiceitem.itemname}}、</span>{{choiceitem.content}} 
					</div>
				</div>
				<div class="editbtnbox">
					<button type="button" class="editbtn" v-if="item.scoresettype==0" @click="littlequestionscorepop(mainitem.score,index,mainindex)">设置分值</button>
					<button type="button" class="editbtn" @click="choicebtn">答案</button>
					<button type="button" class="editbtn" @click="deletebtn(index,mainindex)">删除</button>
					<button type="button" class="editbtn" @click="uplittlequestion(index,mainindex)" v-if="mainindex+1!=1">上移</button>
					<button type="button" class="editbtn" @click="downlittlequestion(index,mainindex)" v-if="mainindex+1!=item.content.length">下移</button>
				</div>
				<p class="correctchoice" v-if="item.cateid!=4">正确答案：{{mainitem.answer}}</p>
				<p class="correctchoice" v-if="item.cateid==4">正确答案：{{mainitem.answer | answertransform}}</p>
			</div>
			<!--组合题-->
			<!--<div class="choicebottom" v-for="(mainitem,mainindex) in item.content" v-if="item.cateid==6">
				<div class="mainquestiontitle edit">
					{{mainindex+1 | groupsecondindextransform}}、{{mainitem.questionbasename}}(共{{mainitem.score}}分)
					<div class="editbtnbox">
						<button type="button" class="editbtn" @click="deletebtn(index,mainindex)">删除</button>
						<button type="button" class="editbtn" @click="uplittlequestion(index,mainindex)" v-if="mainindex+1!=1">上移</button>
						<button type="button" class="editbtn" @click="downlittlequestion(index,mainindex)" v-if="mainindex+1!=item.content.length">下移</button>
					</div>
				</div>
				<div v-for="(groupitem,groupindex) in mainitem.grouplist">
					<div class="mainquestion edit choicebottom">
						<div class="littletitle">
							{{groupindex+1}}、{{groupitem.questionbasename}}({{groupitem.score}}分)
						</div><br />
						<div class="choiceanswer" v-if="groupitem.questionitem.length!=0">
							<div class="choiceanswercell" v-for="(grochoitem,grochoindex) in groupitem.questionitem">
								<span>{{grochoitem.itemname}}</span>{{grochoitem.content}} 
							</div>
						</div>
						<div class="editbtnbox">
							<button type="button" class="editbtn" onclick="setlittlequestionscore(this)">设置分值</button>
							<button type="button" class="editbtn" @click="choicebtn">答案</button>
							<button type="button" class="editbtn" @click="upminiquestion(index,mainindex,groupindex)" v-if="groupindex+1!=1">上移</button>
							<button type="button" class="editbtn" @click="downminiquestion(index,mainindex,groupindex)" v-if="groupindex+1!=mainitem.grouplist.length">下移</button>
						</div>
						<p class="correctchoice">正确答案：{{groupitem.answer}}</p>
					</div>
				</div>
			</div>-->
			
		</div> 
		<p class="center">
			<el-button @click="topstep">上一步</el-button>
			<el-button type="primary" @click="savetestpaper">保存</el-button>
			<el-button @click="cancel">返回</el-button>
		</p>
		
		<!-----------------------------------弹出窗口-------------------------------------------------->
		
		<!--修改试卷名称-->
		<div class="popbox changequestionname" v-show="papernameshow">
			<p class="poptitle">修改名称 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">名称：<el-input v-model="changepapername" placeholder="输入名称"></el-input></p>
			<p class="popbtn">
				<button type="button" class="editbtn" @click="surechangepapername">确定</button>
			</p>
		</div>
		<!--设置试卷分值-->
		<div class="popbox changequestionname" v-show="paperscoreshow">
			<p class="poptitle">设置分值 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">分值设置：
				<el-radio-group v-model="paperscorenolimit">
				    <el-radio :label="0">满分限制</el-radio>
				    <el-radio :label="1">无满分限制</el-radio>
				</el-radio-group>
			</p>
			<p class="popcontent" v-if="paperscorenolimit==0">
				总分：
				<input onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" class="inputscore" v-model="changepaperscore" @input="watchpaperscore">
			</p>
			<p class="popbtn">
				<button type="button" class="editbtn" @click="suresetpaperscore">确定</button>
			</p>
		</div>
		<!--修改题目名称-->
		<div class="popbox changequestionname" v-show="questionnameshow">
			<p class="poptitle">修改名称 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">名称：<el-input v-model="question.name" placeholder="输入名称"></el-input></p>
			<p class="popbtn">
				<button type="button" class="editbtn" @click="surequestionname">确定</button>
			</p>
		</div>
		<!--设置分值-->
		<div class="popbox changequestionname" v-show="questionscoreshow">
			<p class="poptitle">设置分值 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">分值设置：
				<el-radio-group v-model="quescore.scoresettype">
				    <el-radio :label="1">统一设置</el-radio>
				    <el-radio :label="0">分别设置</el-radio>
				</el-radio-group>
			</p>
			<p class="popcontent" v-if="quescore.scoresettype==1">每道题：
				<input onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" class="inputscore" v-model="quescore.score" @input="watchpaperscore">
			<p class="popbtn">
				<button type="button" class="editbtn" @click="surequestionscore">确定</button>
			</p>
		</div>
		<!--设置小题分值-->
		<div class="popbox changequestionname" v-show="littlequestionscoreshow">
			<p class="poptitle">设置分值 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">
				<input onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" class="inputscore" v-model="littlescore.score" @input="watchpaperscore">
			</p>
			<p class="popbtn">
				<button type="button" class="editbtn" @click="surelittlequestionscore">确定</button>
			</p>
		</div>
		
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'	
export default {
props:{
    paperid:'',
    type:''
},
data() {
  	return {
  		papernameshow:false,
  		paperscoreshow:false,
  		questionnameshow:false,
  		questionscoreshow:false,
  		littlequestionscoreshow:false,
  		question:{
  			name:'',
  			index:Number
  		},//题目名信息
  		quescore:{
  			score:'',
  			scoresettype:'',
  			index:Number
  		},
  		littlescore:{
  			score:'',
  			index:Number,
  			mainindex:Number
  		},
  		categorylist:[],//题类列表
		testpaper:[],//试卷对象
		papername:'',//试卷名称
		paperscore:'',//试卷分数
		papermajorid:'',//试卷学科
		paperscorenolimit:0,//满分限制
		changepapername:'',//修改试卷名
		changepaperscore:'',//修改试卷总分
		re:/^[0-9]+$/,//判断正整数
		reg:/^\d+(?=\.{0,1}\d+$|$)/,//判断正数
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
	this.querypapercategorylist();
	this.querypaperdet()
},
methods:{
	querypaperdet(){//查询试卷信息
        var self=this;
		post('/exampaper/viewpaper',{
            command:"exampaper/viewpaper",
			sessionid:getCookie("sid"),
			loginid:getCookie("uid"),
			paperid:self.paperid,
        }).done((res)=>{
            if(res.errcode==0){
            	self.papername=res.paperinfo.name;
            	self.paperscore=res.paperinfo.score;
            	self.papermajorid=res.paperinfo.majoridd;
            }
        })
	},
	querypapercategorylist(){//查询题类
		var self=this;
		self.testpaper=[];
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
					for (var i=0;i<res.questionlist.length;i++) {//二级题目排序
						res.questionlist[i].priority=i;
					}
					for (var i=0;i<res.questionlist.length;i++) {//附件增加类型字段
						if(res.questionlist[i].picturelist!=null){
							if(res.questionlist[i].picturelist.length==1){
								var format=res.questionlist[i].picturelist[0].filepath;
								if (self.ispicture(format)) {
									res.questionlist[i].adjtype='picture';
								}else if(self.isvideo(format)) {
									res.questionlist[i].adjtype='video';
								}else if(self.isaudio(format)) {
									res.questionlist[i].adjtype='audio';
								}
							}else{
								res.questionlist[i].adjtype='picture';
							}
						}
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
					for (var i=0;i<self.testpaper.length;i++) {
						self.testpaper[i].priority=i;
					}
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
			console.log('------------------------sort----------------------------'+JSON.stringify(this.testpaper))
	},
	ispicture(name){//判断是否图片
	    var arr = name.split(".");
	    var format =arr[arr.length-1].toLowerCase();
	    if(format=='png'|| format=='bmp' || format=='gif' || format=='jpg' || format=='jpeg' ){
	      return true;
	    }else{
	      return false;
	    }
	},
	isvideo(name){//判断是否视频
	    var arr = name.split(".");
	    var format =arr[arr.length-1].toLowerCase();
	    if(format=='mp4'){
	      return true;
	    }else{
	      return false;
	    }
	},
	isaudio(name){//判断是否音频
	    var arr = name.split(".");
	    var format =arr[arr.length-1].toLowerCase();
	    if(format=='mp3' ){
	      return true;
	    }else{
	      return false;
	    }
	},
				/**********************	试卷编辑***********************/
	choicebtn(event){
		$(event.target).parent().siblings(".correctchoice").toggle()
	},
	changequestionname(name,index){//更改题目
		this.question.name=name;
		this.question.index=index;
		this.questionnameshow=true;
	},
	closepop(){//关闭弹窗
		this.papernameshow=false;
		this.questionnameshow=false;
		this.questionscoreshow=false;
		this.littlequestionscoreshow=false;
		this.paperscoreshow=false;
	},
	surequestionname(){//确认更改题目
		this.testpaper[this.question.index].nickname=this.question.name;
		this.questionnameshow=false;
	},
	questionscorepop(score,scoresettype,index){//题目分值设置
		this.quescore.score=score;
		this.quescore.scoresettype=scoresettype;
		this.quescore.index=index;
		this.questionscoreshow=true;
	},
	watchtotalscore(){
		if(!(this.reg.test(this.quescore.score))){
            this.quescore.score=''
        }
	},
	surequestionscore(){//确认题目分值设置
		var newscore=Math.round(this.quescore.score*10)/10;
		this.testpaper[this.quescore.index].scoresettype=this.quescore.scoresettype;
		this.testpaper[this.quescore.index].score=newscore;
		var newtotalscore=0;
		for (var i=0;i<this.testpaper[this.quescore.index].content.length;i++) {
			this.testpaper[this.quescore.index].content[i].score=newscore;
			newtotalscore+=newscore;
		}
		this.testpaper[this.quescore.index].totalscore=Math.ceil(newtotalscore*10)/10;
		if(this.paperscorenolimit==1){
			this.paperscore=0;
			for(var i=0;i<this.testpaper.length;i++){
				if(this.testpaper[i].totalscore==null){
					this.testpaper[i].totalscore=0
				}
				this.paperscore+=parseFloat(this.testpaper[i].totalscore)
			}
		}
		this.questionscoreshow=false;
	},
	littlequestionscorepop(score,index,mainindex){//题目小题分值设置
		this.littlequestionscoreshow=true;
		this.littlescore.score=score;
		this.littlescore.index=index;
		this.littlescore.mainindex=mainindex;
	},
	watchlittlescore(){
		if(!(this.reg.test(this.littlescore.score))){
            this.littlescore.score=''
        }
	},
	surelittlequestionscore(){//确认题目小题分值设置
		var newscore=Math.round(this.littlescore.score*10)/10;
		this.testpaper[this.littlescore.index].totalscore=0;
		this.testpaper[this.littlescore.index].content[this.littlescore.mainindex].score=newscore;
		var newtotalscore=0;
		for (var i=0;i<this.testpaper[this.littlescore.index].content.length;i++) {
			if(this.testpaper[this.littlescore.index].content[i].score){
				newtotalscore+=parseFloat(this.testpaper[this.littlescore.index].content[i].score)
			}
		}
		this.testpaper[this.littlescore.index].totalscore=Math.ceil(newtotalscore*10)/10;
		if(this.paperscorenolimit==1){
			this.paperscore=0;
			for(var i=0;i<this.testpaper.length;i++){
				if(this.testpaper[i].totalscore==null){
					this.testpaper[i].totalscore=0
				}
				this.paperscore+=parseFloat(this.testpaper[i].totalscore)
			}
		}
		this.littlequestionscoreshow=false;
	},
	
	deletebtn(index,mainindex){//删除题目 
		var self=this;
		var questionid=this.testpaper[index].content[mainindex].questionbaseid;
		post('/exampaper/cancelpaperquestion',{
            command:"exampaper/cancelpaperquestion",
			sessionid:getCookie("sid"),
			loginid:getCookie("uid"),
			paperid:self.paperid,
			questionid:questionid
        }).done((res)=>{
            if(res.errcode==0){
            	self.querypapercategorylist()
            }
        })
	},
	changepapernamepop(){//更名pop
		this.changepapername=this.papername;
		this.papernameshow=true;
	},
	surechangepapername(){//确定更名
		this.papername=this.changepapername;
		this.papernameshow=false;
	},
	setpaperscorepop(){//设置试卷总分
		this.changepaperscore=this.paperscore;
		this.paperscoreshow=true;
	},
	watchpaperscore(){
		if(!(this.re.test(this.changepaperscore))){
            this.changepaperscore=''
        }
	},
	suresetpaperscore(){//确认设置试卷总分
		if(this.paperscorenolimit==0){//满分限制
			this.paperscore=this.changepaperscore;
			var allscore=0;
			for(var i=0;i<this.testpaper.length;i++){
				if (this.testpaper[i].totalscore!=null) {
					allscore+=parseFloat(this.testpaper[i].totalscore)
				}
			}
			if (this.paperscore!=allscore) {
//				layer.msg("各题分值总和不等于满分!")
				this.$message({
		          showClose: true,
		          message: '各题分值总和不等于满分!',
		          type: 'error'
		        });
			}
			if (this.paperscore<0) {
				var num=this.paperscore;
				this.paperscore=0-num;
//				layer.msg("设置分值不可小于0!");
				this.$message({
		          showClose: true,
		          message: '设置分值不可小于0!',
		          type: 'error'
		        });
			}
		}else{//无满分限制
			this.paperscore=0;
			for(var i=0;i<this.testpaper.length;i++){
				if (this.testpaper[i].totalscore!=null) {
					this.paperscore+=parseFloat(this.testpaper[i].totalscore)
				}
			}
		}
		this.paperscoreshow=false;
	},
	
	upquestion(index){//大题向上移
		var arr=this.testpaper;
		var obj=arr[index];
		obj.priority=index-1;
		arr[index-1].priority=index;
		arr[index]=arr[index-1];
		arr[index-1]=obj;
		this.testpaper=[];
		this.testpaper=this.testpaper.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
	},
	downquestion(index){//大题向下移
		var arr=this.testpaper;
		var obj=arr[index];
		obj.priority=index+1;
		arr[index+1].priority=index;
		arr[index]=arr[index+1];
		arr[index+1]=obj;
		this.testpaper=[];
		this.testpaper=this.testpaper.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
	},
	uplittlequestion(index,mainindex){//二级题向上移
		var arr=this.testpaper[index].content;
		var obj=arr[mainindex];
		obj.priority=mainindex-1;
		arr[mainindex-1].priority=mainindex;
		arr[mainindex]=arr[mainindex-1];
		arr[mainindex-1]=obj;
		this.testpaper[index].content=[];
		this.testpaper[index].content=this.testpaper[index].content.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
	},
	downlittlequestion(index,mainindex){//二级题向下移
		var arr=this.testpaper[index].content;
		var obj=arr[mainindex];
		obj.priority=mainindex+1;
		arr[mainindex+1].priority=mainindex;
		arr[mainindex]=arr[mainindex+1];
		arr[mainindex+1]=obj;
		this.testpaper[index].content=[];
		this.testpaper[index].content=this.testpaper[index].content.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
	},
	upminiquestion(index,mainindex,groupindex){//三级题向上移
		console.log('-----三级上移'+index,mainindex,groupindex)
		var arr=this.testpaper[index].content[mainindex].grouplist;
		var obj=arr[groupindex];
		obj.priority=groupindex-1;
		arr[groupindex-1].priority=groupindex;
		arr[groupindex]=arr[groupindex-1];
		arr[groupindex-1]=obj;
		this.testpaper[index].content[mainindex].grouplist=[];
		this.testpaper[index].content[mainindex].grouplist=this.testpaper[index].content[mainindex].grouplist.concat(arr);
	},
	downminiquestion(index,mainindex,groupindex){//三级题向下移
		console.log('-----三级下移'+index,mainindex,groupindex)
		var arr=this.testpaper[index].content[mainindex].grouplist;
		var obj=arr[groupindex];
		obj.priority=groupindex+1;
		arr[groupindex+1].priority=groupindex;
		arr[groupindex]=arr[groupindex+1];
		arr[groupindex+1]=obj;
		this.testpaper[index].content[mainindex].grouplist=[];
		this.testpaper[index].content[mainindex].grouplist=this.testpaper[index].content[mainindex].grouplist.concat(arr);
	},
	savetestpaper(){//保存试卷
		console.log('-----------保存试卷-----------------'+JSON.stringify(this.testpaper))
		var self=this;
		var papermainlist=[];
		var allscore=0;
		for(var i=0;i<this.testpaper.length;i++){
			var mainobj=this.testpaper[i];
			var questionlist=[];
			if (mainobj.cateid==6) {//组合题
				for (var j=0;j<mainobj.content.length;j++) {
					var obj=mainobj.content[j];
					var questionitemlist=[];
					if (obj.grouplist!=null) {
						for (var k=0;k<obj.grouplist.length;k++) {
							var littleobj=obj.grouplist[k];
							if (littleobj.score==null) {
								this.$message({
						          showClose: true,
						          message: '请设置题目分数!',
						          type: 'error'
						        });
								return false;
							}
							questionitemlist.push({
								id:littleobj.id,
								questionitemid:littleobj.questionbaseid,
								score:littleobj.score,
								priority:littleobj.priority
							})
						}
					}
					questionlist.push({
						id:obj.id,
						questionbaseid:obj.questionbaseid,
						score:obj.score,
						priority:obj.priority,
						questionItemList:questionitemlist
					})
				}
			}else{//其它
				for (var j=0;j<this.testpaper[i].content.length;j++) {
					var obj=this.testpaper[i].content[j];
					if (obj.score==null) {
						this.$message({
				          showClose: true,
				          message: '请设置'+(i+1)+'大题'+(j+1)+'小题分数!',
				          type: 'error'
				        });
						return false;
					}
					questionlist.push({
						id:obj.id,
						questionbaseid:obj.questionbaseid,
						score:obj.score,
						priority:obj.priority
					})
				}
			}
			if (mainobj.totalscore==null) {
				this.$message({
		          showClose: true,
		          message: '请设置'+(i+1)+'大题分数!',
		          type: 'error'
		        });
				return false;
			}
			allscore+=parseFloat(mainobj.totalscore);
			if (mainobj.scoresettype==1) {
				papermainlist.push({
					id:mainobj.id,
					nickname:mainobj.nickname,
					cateid:mainobj.cateid,
					scoresettype:mainobj.scoresettype,
					score:mainobj.score,
					priority:mainobj.priority,
					questionlist:questionlist
				})
			}else{
				papermainlist.push({
					id:mainobj.id,
					nickname:mainobj.nickname,
					cateid:mainobj.cateid,
					scoresettype:mainobj.scoresettype,
					priority:mainobj.priority,
					questionlist:questionlist
				})
			}
			
		}
		if (this.paperscorenolimit==0) {//满分限制
			if (this.paperscore==null) {
				this.$message({
		          showClose: true,
		          message: '请设置试卷分数!',
		          type: 'error'
		        });
				return false;
			}else{
				if (this.paperscore!=allscore) {
					this.$message({
			          showClose: true,
			          message: '各小题分值和不等于总分!',
			          type: 'error'
			        });
					return false;
				}
			}
		}else{
			if (this.paperscore!=allscore) {
				this.$message({
		          showClose: true,
		          message: '各小题分值和不等于总分!',
		          type: 'error'
		        });
				return false;
			}
		}
		post('/exampaper/updatepaper',{
            command:"exampaper/updatepaper",
			sessionid:getCookie("sid"),
			loginid:getCookie("uid"),
			paperid:self.paperid,
			name:self.papername,
			score:self.paperscore,
			type:self.type,
			majorid:self.papermajorid,
			scorenolimit:self.paperscorenolimit,
			papermainlist:papermainlist
        }).done((res)=>{
            if(res.errcode==0){
            	self.cancel()
            }
        })
	},
	topstep(){//上一步
		this.$emit('topstep')
	},
	cancel(){//返回到exam_test
		this.$router.push({
	      name:'exam_test',
	      query:{
	      	value:'2'
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
}
//computed:{
//	paperscore:function(){
//		if(this.paperscorenolimit==1){
//			for(var i=0;i<this.testpaper.length;i++){
//				this.paperscore+=parseFloat(this.testpaper[i].totalscore)
//			}
//		}
//	}
//}

}
</script>

<style scoped>
.center{text-align: center;width: 80%;margin: 0 auto 10px;padding: 10px 0;position: relative;}
.center .btnhover{display: none;font-size: 15px;margin-right: 20px;position: absolute;right: 20px;top: 10px;}
.margintop{margin-top: 30px;}
.questionlist{font-size: 15px;text-align: left;width: 80%;margin: auto;}
.mainquestiontitle{padding: 10px 20px 10px 0;position: relative;min-height: 40px;line-height: 40px;}
.mainquestion{padding: 10px 20px;position: relative;}
.littletitle{padding-bottom: 10px;}
.paperpic{height: 200px;margin-right: 40px;}
.choiceanswercell{display: inline-block; margin: 10px 20px;}
.next{text-align: center;padding-bottom: 100px;}
.btn{width: 100px;margin: 20px 50px;}
/**/
.popbox{
    position: fixed;	
	background-color: #fff;
    z-index: 1;
    border: 1px solid #bfcbd9;
    width: 500px;
    left: 30%;
    top: 200px;
    padding: 10px;
}
.poptitle{
	border-bottom: 1px solid #bfcbd9;
	position: relative;
	padding: 10px 0;
}
.poptitle i{
	position: absolute;
    right: 0;
}
.popcontent{
	margin: 30px 0;
	text-align: center;
	width: 100%;
}
.popcontent .el-input{
width: 70%;}
.popbtn{
	text-align: center;
	margin-bottom: 30px;
}
.inputscore{
	width: 100px;
	padding: 5px 10px;
	border: 1px solid #bfcbd9;
}

.title{
	font-size: 30px;text-align: center;position: relative;
}
.score{
	font-size: 17px;text-align: center;position: relative;padding: 10px 0;
}
.info{
	font-size: 17px;text-align: center;margin-bottom: 40px;
}
.questionlist span{
	font-size: 15px;margin-left: 5px;
}
.questionlist .choicebottom{
	margin-bottom: 45px;
}
.questionlist .choicebottom .correctchoice{
    position: absolute;
    display: none;
    width: 95%;
    padding-left: 5%;
    bottom: -40px;
    left: 0;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid;
    overflow: hidden;
}
.questionlist .mainquestion .littletitle{
	padding: 10px 0;
	display: inline-block;
}
.choiceanswer{
	display: inline-block;
	text-align: left;
}
.choiceanswer .choiceanswercell{
	display: inline-block;
	margin: 10px 20px;
}

.next .btnBg{
	background-color: #fff;
	color: #286090;
}
.next .btn{
	margin: 0 10px;
	width: 80px;
}
.center .form-inline .form-group span{
	margin-right: 50px;
}

/*悬浮*/
.edit{
	cursor: pointer;
}
.edittitlebtn{
	position: absolute;
	right: 4px;
	top: 4px;
	width: 100px;
	display: none;
}
.editbtn{
	background-color: #20a0ff;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    margin-left: 10px;
}
.editbtnbox{
	display: none;
	position: absolute;
    right: 20px;
    bottom: 10px;
}
.marginbottom{
	position: relative;
	bottom: 10px;
}
.edit:hover{
	border: 1px solid #20a0ff;
}
.edit:hover .btnhover,.edit:hover .editbtnbox{
	display:block;
}
.delete_sure .btn-primary{left: 200px;}
</style>