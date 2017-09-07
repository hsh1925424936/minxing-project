$("#cha,#ok").click(function(){
	$("#shadow").attr("class","hide");
	window.location.reload();
});
function dot2(num){//保留2位小数函数
	if(isNaN(num)){//非数字
		return "-"
	}
	else if(num.toString().indexOf(".")==-1){//整数
		return num+".00"
	}
	else if(num.toString().split(".")[1].length==1){//一位小数
		return num+"0"
	}
	else if(num.toString().split(".")[1].length==2){//二位小数
		return num
	}
	else{//多位小数,没有做4舍5入
		var float=num.toString().split(".")[1].slice(0,2);
		return num.toString().split(".")[0].toString()+"."+float;
	}
};
Vue.filter('nan', function(value) {
	if (isNaN(value)) {
		return '-'
	}
	else{
		return dot2(value)
	}
});
var vm = new Vue({
	el:"#vuetest",
	data:{
		username:"",//管理员名
		isShow:[true,false,false],//关于左侧导航栏页面切换
		loading:[false,false,false],//关于3个loading.gif的显示和影藏
		grayClass:["grayBack","normal","normal"],//关于左侧导航栏点击后背景色的变换
		checkId1:"",//初赛查询成绩接口获取的checkid
		checkId2:"",//复赛查询成绩接口获取的checkid
		checkId3:"",//决赛查询成绩接口获取的checkid
		recvData1_1:"",//初赛查询成绩获取的数据
		recvData1_2:"",//初赛预览接口获取的数据
		recvData2_1:"",//复赛查询成绩获取的数据
		recvData2_2:"",//复赛预览接口获取的数据
		recvData3_1:"",//决赛查询成绩获取的数据
		recvData3_2:"",//决赛预览接口获取的数据
		isSubmit1Disable:true,
		isSubmit2Disable:true,
		isSubmit3Disable:true
	},
	mounted: function () {
		var url=decodeURI(window.location.href);
		this.username=url.split("=")[1];//获取用户名，显示到右上角
		this.getData1_1();//页面加载时，直接调初赛查询成绩接口
	},
	methods: {
		showContent1:function(){
			this.isShow=[true,false,false];
			this.grayClass=["grayBack","normal","normal"];
		},
		showContent2:function(){
			this.isShow=[false,true,false];
			this.grayClass=["normal","grayBack","normal"];
			this.getData2_1();//点导航栏“复赛”，异步获取复赛初始成绩
		},
		showContent3:function(){
			this.isShow=[false,false,true];
			this.grayClass=["normal","normal","grayBack"];
			this.getData3_1();//点导航栏“决赛”，异步获取复赛初始成绩
		},
		postJson:function(url,json,callback){//ajax方法函数
			var sendJson={
				"1":json,
			};
			sendJson=JSON.stringify(sendJson);
			$.ajax({
				type:"POST",
				url:url,
				data:sendJson,
				dataType:"json",
				contentType: "application/json; charset=utf-8",
				success:function(msg){
					if(typeof(msg)=="string"){
						msg= $.parseJSON(msg);
					};
					$.each(msg,function(x,y){
						if(x=="1"){
							if(y.errcode==0){
								callback(y);
							}
							else{
								alert("错误描述为："+ y.errdesc);
							}
						};
					});
				},
				error:function(){
					alert("连接服务失败");
				},
			})
		},
		//初赛的页面运算
		add1:function(index){//初赛给动态生成的span+，添加点击加法
			if(isNaN(this.recvData1_1.checkresult[index].roundscore)){
				alert("暂时没有该项成绩")
			}
			else{
				this.recvData1_1.checkresult[index].roundscore=(parseFloat(this.recvData1_1.checkresult[index].roundscore)+1).toFixed(2);
			}
		},
		min1:function(index){//初赛给动态生成的i-，添加点击减法
			if(isNaN(this.recvData1_1.checkresult[index].roundscore)){
				alert("暂时没有该项成绩")
			}
			else if(this.recvData1_1.checkresult[index].roundscore<1){
				return false;
			}
			else{
				this.recvData1_1.checkresult[index].roundscore=(parseFloat(this.recvData1_1.checkresult[index].roundscore)-1).toFixed(2);
			}
		},
		inputChange1:function(index){//初赛输入改变分值时，计算新总分
			this.recvData1_1.checkresult[index].roundscore=$("#checkTable1 input:eq("+index+")").val();
		},
		//复赛的页面运算
		add2:function(index){//复赛给动态生成的span+，添加点击加法
			if(isNaN(this.recvData2_1.checkresult[index].roundscore)){
				alert("暂时没有该项成绩")
			}
			else{
				this.recvData2_1.checkresult[index].roundscore=(parseFloat(this.recvData2_1.checkresult[index].roundscore)+1).toFixed(2);
			}
		},
		min2:function(index){//复赛给动态生成的i-，添加点击减法
			if(isNaN(this.recvData2_1.checkresult[index].roundscore)){
				alert("暂时没有该项成绩")
			}
			else if(this.recvData2_1.checkresult[index].roundscore<1){
				return false;
			}
			else{
				this.recvData2_1.checkresult[index].roundscore=(parseFloat(this.recvData2_1.checkresult[index].roundscore)-1).toFixed(2);
			}
		},
		inputChange2:function(index){//复赛输入改变分值时，计算新总分
			this.recvData2_1.checkresult[index].roundscore=$("#checkTable2 input:eq("+index+")").val();
		},
		//决赛的页面运算
		add3:function(index){//决赛给动态生成的span+，添加点击加法
			if(isNaN(this.recvData3_1.checkresult[index].totalscore)){
				alert("该项还没有成绩");
			}
			else{
				this.recvData3_1.checkresult[index].totalscore=(parseFloat(this.recvData3_1.checkresult[index].totalscore)+1).toFixed(2);
			}
		},
		min3:function(index){//决赛给动态生成的i-，添加点击减法
			if(isNaN(this.recvData3_1.checkresult[index].totalscore)){
				alert("该项还没有成绩")
			}
			else if(this.recvData3_1.checkresult[index].totalscore<1){
				return false
			}
			else{
				this.recvData3_1.checkresult[index].totalscore=(parseFloat(this.recvData3_1.checkresult[index].totalscore)-1).toFixed(2);
			}
		},
		inputChange3:function(index){//决赛输入改变分值时，计算新总分
			this.recvData3_1.checkresult[index].totalscore=$("#checkTable3 input:eq("+index+")").val();
		},
		//下面是初赛部分！！！！！！！！！！！
		getData1_1: function () {//查询初赛成绩/osce/report/querycheckscore
			//输入参数checkid，checkround	稽核第几轮成绩
			//checkresult	[稽核项数组]
					//examineeid	小队编号	必填
					//examinename	小队名称	可选
					//totalscore	当前总分	必填
					//ranklist	当前排名	必填
					//subscoreitem1	评委1分数	必填
					//subscoreitem2	评委2分数	必填
					//objscoreitem	客观题分数	必填
					//roundscore	本轮分数	必填
					//finishstationcnt	考完站数	必填
			var self=this;
			var json={
					command: "osce/report/querycheckscore",
					examid: 1
			};
			function callback(result){
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					checkround:result.checkround,
					errdesc:result.errdesc,
					checkid:result.checkid,
					checkresult:result.checkresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})//收到返回数据后，先排序
				}
				self.checkId1=resultNew.checkid;
				self.recvData1_1=resultNew;
				console.log("初赛成绩查询："+JSON.stringify(self.recvData1_1));
				var show1=setTimeout(function(){
					for(var i=0;i<self.recvData1_1.checkresult.length;i++){//取到后台返回数据后，给td.thisScore赋值
						$("#checkTable1 td.thisScore:eq("+i+")").html(self.recvData1_1.checkresult[i].roundscore)
					}
				},1000)
			};
			self.postJson("/osce/report/querycheckscore",json,callback);
		},
		check1reload:function(){//查询初赛成绩“刷新”按钮
			var self=this;
			self.loading=[true,false,false];//点刷新，出现转圈圈，拿到后台数据后，取消转圈
			var a=setTimeout(function(){
				self.loading=[false,false,false];//点刷新，出现转圈圈，拿到后台数据后，取消转圈
			},1500);
			this.getData1_1();
		},
		check1ToPreview:function(){//"/osce/report/querypreviewscore"初赛预览接口
			//输入参数：command	，examid:1，checkid
			//checkscorearray	[稽核分数组]
					//examineeid	小队编号
					//checkscore	稽核分
			//输出参数//command/errcode/errdesc
			//perviewresult	预览项数组	必填
					//examineeid	小队编号	必填
					//totalscore	小队总分	必填
					//ranklist	小队排名	必填
					//scoredetail	分数明细，以“@”作为分隔符，“-”表此站暂无分	必填
					//finishstationcnt	考完站数	必填
			var self=this;
			var arr=[];//初赛预览接口，输入参数数组
			for(var i=0;i<$("#checkTable1 tbody tr").length;i++){//搭建初赛预览接口需要提供的数据
				arr.push({
					examineeid:$("#checkTable1 tbody tr:eq("+i+") input").data("id"),
					checkscore:$("#checkTable1 tbody tr:eq("+i+") input").val()
				})
			};
			var json={
					command: "osce/report/querypreviewscore",
					examid: 1,
					checkid:self.checkId1,
					checkscorearray:arr
			};
			function callback(result){
				self.isSubmit1Disable=false;//初赛预览收到返回数据后，初赛核准发布才能点击
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					errdesc:result.errdesc,
					perviewresult:result.perviewresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})//收到返回数据后，先排序
				}
				self.recvData1_2=resultNew;
				console.log("初赛预览接口返回："+JSON.stringify(self.recvData1_2));
			};
			self.postJson("/osce/report/querypreviewscore",json,callback);
		},
		ok1_2:function(){//初赛确认核准成绩"/osce/report/submitcheckscore"接口
			//输入参数command，examid，checkid
			var self=this;
			var json={
					command: "osce/report/submitcheckscore",
					examid: 1,
					checkid:self.checkId1
			};
			function callback(result){
				$("#shadow").attr("class","show");
				$("#successMsg").html("初赛成绩发布成功！");
			};
			self.postJson("/osce/report/submitcheckscore",json,callback);
		},
		//下面是复赛部分！！！！！！！！！！！
		getData2_1: function () {//查询复赛成绩/osce/report/querycheckscore
			//输出参数checkid，checkround稽核第几轮成绩
			//checkresult	[稽核项数组]
					//examineeid	小队编号	必填
					//examinename	小队名称	可选
					//totalscore	当前总分	必填
					//ranklist	当前排名	必填
					//subscoreitem1	评委1分数	必填
					//subscoreitem2	评委2分数	必填
					//objscoreitem	客观题分数	必填
					//roundscore	本轮分数	必填
					//finishstationcnt	考完站数	必填
			var self=this;
			var json={
					command: "osce/report/querycheckscore",
					examid: 2
			};
			function callback(result){
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					checkround:result.checkround,
					errdesc:result.errdesc,
					checkid:result.checkid,
					checkresult:result.checkresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})//收到返回数据后，先排序
				}
				self.checkId2=resultNew.checkid;
				self.recvData2_1=resultNew;
				console.log("复赛查询接口返回："+JSON.stringify(self.recvData2_1));
				var show2=setTimeout(function(){
					for(var i=0;i<self.recvData2_1.checkresult.length;i++){//取到后台返回数据后，给td.thisScore赋值
						$("#checkTable2 td.thisScore:eq("+i+")").html(self.recvData2_1.checkresult[i].roundscore)
					}
				},500);
			};
			self.postJson("/osce/report/querycheckscore",json,callback);
		},
		check2reload:function(){//查询复赛成绩“刷新”按钮
			var self=this;
			self.loading=[false,true,false];
			var a=setTimeout(function(){
				self.loading=[false,false,false];//点刷新，出现转圈圈，拿到后台数据后，取消转圈
			},1500);
			this.getData2_1();
		},
		check2ToPreview:function(){//"/osce/report/querypreviewscore"复赛预览接口
			//输入参数：command，examid:2，checkid
			//checkscorearray	[稽核分数组]
					//examineeid	小队编号
					//checkscore	稽核分
			//输出参数//command/errcode/errdesc
			//perviewresult	预览项数组	必填
					//examineeid	小队编号	必填
					//totalscore	小队总分	必填
					//ranklist	小队排名	必填
					//scoredetail	分数明细，以“@”作为分隔符，“-”表此站暂无分	必填
					//finishstationcnt	考完站数	必填
			var self=this;
			var arr=[];//复赛预览接口，输入参数数组
			for(var i=0;i<$("#checkTable2 tbody tr").length;i++){//搭建复赛预览接口需要提供的数据
				arr.push({
					examineeid:$("#checkTable2 tbody tr:eq("+i+") input").data("id"),
					checkscore:$("#checkTable2 tbody tr:eq("+i+") input").val()
				})
			};
			var json={
					command: "osce/report/querypreviewscore",
					examid: 2,
					checkid:self.checkId2,
					checkscorearray:arr
			};
			function callback(result){
				self.isSubmit2Disable=false;//初赛预览收到返回数据后，初赛核准发布才能点击
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					errdesc:result.errdesc,
					perviewresult:result.perviewresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})//收到返回数据后，先排序
				}
				self.recvData2_2=resultNew;
				console.log("复赛预览接口返回："+JSON.stringify(self.recvData2_2));
			};
			self.postJson("/osce/report/querypreviewscore",json,callback);
		},
		ok2_2:function(){//复赛确认核准成绩"/osce/report/submitcheckscore"接口
			//输入参数command，examid，checkid
			var self=this;
			var json={
					command: "osce/report/submitcheckscore",
					examid: 2,
					checkid:self.checkId2
			};
			function callback(result){
				$("#shadow").attr("class","show");
				$("#successMsg").html("复赛成绩发布成功！");
			};
			self.postJson("/osce/report/submitcheckscore",json,callback);
		},
		//下面是决赛部分！！！！！！！！！！！
		getData3_1: function () {//查询决赛成绩/osce/report/querycheckjsscore
			//输入参数:command/examid:3
			//输出参数command，errcode，errdesc，checkid
			//checkresult[决赛稽核项数组]
					//examineeid	小队编号	必填
					//examinename	小队名称	可选
					//totalscore	当前总分	必填
					//ranklist	当前排名	必填
					//scoredetail	各操作分数明细，以”@”为分隔符
			var self=this;
			var json={
					command: "osce/report/querycheckjsscore",
					examid: 3
			};
			function callback(result){
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					errdesc:result.errdesc,
					checkid:result.checkid,
					checkresult:result.checkresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})
				};
				self.checkId3=resultNew.checkid;
				self.recvData3_1=resultNew;
				console.log("决赛成绩查询："+JSON.stringify(self.recvData3_1));
				var show3=setTimeout(function(){
					for(var i=0;i<self.recvData3_1.checkresult.length;i++){//取到后台返回数据后，给td.lastExamTotal赋值
						$("#checkTable3 td.lastExamTotal:eq("+i+")").html(self.recvData3_1.checkresult[i].totalscore)
					}
				},500);
			};
			self.postJson("/osce/report/querycheckjsscore",json,callback);
		},
		check3reload:function(){//查询复赛成绩“刷新”按钮
			var self=this;
			self.loading=[false,false,true];
			var c=setTimeout(function(){
				self.loading=[false,false,false];//点刷新，出现转圈圈，拿到后台数据后，取消转圈
			},1500);
			this.getData3_1();
		},
		check3ToPreview:function(){//"/osce/report/querypreviewjsscore"决赛预览接口
			//输入参数：command、examid：3、checkid
			//checkscorearray[稽核分数组]
					//examineeid	小队编号
					//checkscore	稽核分
			//输出参数//command/errcode/errdesc
			//perviewresult	[预览项数组]
					//examineeid	小队编号
					//totalscore	小队总分
					//ranklist	小队排名
					//scoredetail	分数明细，以“@”作为分隔符，“-”表此站暂无分
			var self=this;
			var arr=[];//决赛预览接口，输入参数数组
			for(var i=0;i<self.recvData3_1.checkresult.length;i++){
				arr.push({
					examineeid:$("#checkTable3 tbody tr:eq("+i+") input").data("id"),
					checkscore:$("#checkTable3 tbody tr:eq("+i+") input").val()
				})
			};
			var json={
					command: "osce/report/querypreviewjsscore",
					examid: 3,
					checkid:self.checkId3,
					checkscorearray:arr
			};
			function callback(result){
				self.isSubmit3Disable=false;//初赛预览收到返回数据后，初赛核准发布才能点击
				var resultNew={
					command:result.command,
					errcode:result.errcode,
					errdesc:result.errdesc,
					perviewresult:result.perviewresult.sort(function(a,b){
						return a.ranklist-b.ranklist
					})//收到返回数据后，先排序
				}
				self.recvData3_2=resultNew;
				console.log("决赛预览接口返回："+JSON.stringify(self.recvData3_2));
			};
			self.postJson("/osce/report/querypreviewjsscore",json,callback);
		},
		ok3_2:function(){//决赛确认核准成绩"/osce/report/submitcheckjsscore"接口
			//输入参数command，examid，checkid
			var self=this;
			var json={
					command: "osce/report/submitcheckjsscore",
					examid: 3,
					checkid:self.checkId3
			};
			function callback(result){
				$("#shadow").attr("class","show");
				$("#successMsg").html("决赛成绩发布成功！");
			};
			self.postJson("/osce/report/submitcheckjsscore",json,callback);
		}
	}
});

