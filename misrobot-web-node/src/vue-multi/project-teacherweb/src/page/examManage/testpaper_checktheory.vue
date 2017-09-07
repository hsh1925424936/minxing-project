<template>
	<div class="checktheory">
		<p class="nav"><span class="blue" @click="cancel">考试&试卷</span> > 查看试卷</p>
		<div class="content">
			<h2 class="center margintop">{{papername}}</h2>
			<p class="center">满分：{{score}}分</p>
			<p class="center">班级________  姓名________  学号________</p>
			<div class="questionlist" v-for="(item,index) in testpaper">
				<div class="mainquestiontitle edit">
					{{index+1 | maintitlenum}}、{{item.nickname}}
					<span>(共{{item.totalnum}}小题,总分: {{item.totalscore}}分)</span>
				</div>
				<!--单选多选问答判断-->
				<div class="mainquestion choicebottom" v-for="(mainitem,mainindex) in item.content" v-if="item.cateid!=6">
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
							<span>{{choiceitem.itemname}}</span>{{choiceitem.content}} 
						</div>
					</div>
				</div>
				<!--组合题-->
				<!--<div class="mainquestion choicebottom" v-for="(mainitem,mainindex) in item.content" v-if="item.cateid==6">
					<div class="mainquestiontitle edit">
						{{mainindex+1 | groupsecondindextransform}}、{{mainitem.questionbasename}}(共{{mainitem.score}}分)
					</div>
					<div v-for="(groupitem,groupindex) in mainitem.grouplist">
						<div class="mainquestion choicebottom">
							<div class="littletitle">
								{{groupindex+1}}、{{groupitem.questionbasename}}({{groupitem.score}}分)
							</div><br />
							<div class="choiceanswer" v-if="groupitem.questionitem.length!=0">
								<div class="choiceanswercell" v-for="(grochoitem,grochoindex) in groupitem.questionitem">
									<span>{{grochoitem.itemname}}</span>{{grochoitem.content}} 
								</div>
							</div>
						</div>
					</div>
				</div>-->
				
			</div> 
			<p class="line">
				<!--<el-button type="primary">下载</el-button>-->
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
  		paperid:this.$route.query.paperid,
  		testpaper:[],
  		categorylist:[],
		papername:'',
		score:'',
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
},
mounted(){
	this.querypapercategorylist();
	this.querypaperinfo()
},
methods:{
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
					self.sorttestpaper();//一级题目排序
				}
            }
        })
	},
	sorttestpaper(){//排序
//			console.log('------------------------1111sort----------------------------'+JSON.stringify(this.testpaper))
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
//			console.log('-----categorylist----'+JSON.stringify(this.categorylist))
		for(var i=0;i<this.categorylist.length;i++){console.log('--------'+i)
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
}
.line{
	text-align: center;
	margin: 50px auto;
}
.questionlist{font-size: 15px;text-align: left;width: 80%;margin: auto;}
.title{font-size: 30px;text-align: center;position: relative;}
.score{font-size: 17px; text-align: center;position: relative; padding: 10px 0;}
.info{font-size: 17px;text-align: center;margin-bottom: 40px;}
.mainquestiontitle{padding: 10px 0;position: relative;}
/*.mainquestion{padding: 10px 0 30px 0;position: relative;}*/
.paperpic{height: 200px;margin-right: 40px;}
.choiceanswercell{display: inline-block; margin: 10px 20px;}
.next{text-align: center;padding-bottom: 100px;}
.btn{width: 100px;margin: 20px 50px;}
/**/
.questionlist .mainquestiontitle{
	position: relative;min-height: 40px;line-height: 40px;
}
.questionlist .mainquestion{
	position: relative;
	margin-left: 20px;
}
.questionlist .choicebottom{
	margin-bottom: 20px;
}
.questionlist .choicebottom .correctchoice{
    position: absolute;
    display: none;
    width: 100%;
    bottom: -40px;
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

</style>