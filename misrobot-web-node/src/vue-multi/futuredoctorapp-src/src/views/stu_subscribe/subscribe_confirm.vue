<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            预约信息确认
        </c-header>

        <div class="g-main">
            <div class="info_box clearfix">
                <div class="info_name">
                    实验室名称:
                </div>
                <div class="info_value">
                    {{roomname}}
                </div>
            </div>
            <div class="info_box clearfix">
                <div class="info_name">
                    实验室地址:
                </div>
                <div class="info_value">
                    {{displayname}}
                </div>
            </div>
            <div class="info_box clearfix">
                <div class="info_name">
                    管理员:
                </div>
                <div class="info_value">
                    {{uname}},{{mobile}}
                </div>
            </div>
            <div class="info_box clearfix">
                <div class="info_name">
                    训练项名称:
                </div>
                <div class="info_value">
                    {{learnname}}
                </div>
            </div>
            <div class="info_box clearfix">
                <div class="info_name">
                    预约时段:
                </div>
                <div class="info_value">
                    {{time}}
                </div>
            </div>
            <div class="info_box clearfix info_box2" style="margin-top:0.1rem;">
                <div class="info_name">
                    座位位置:
                </div>
                <div class="info_value clearfix">
                    <span>{{checked_station_code}}</span><button class="btn-blue" @click="change_station()">修改</button>
                </div>
            </div>
            <div class="info_box clearfix info_box2" v-if="type==1">
                <div class="info_name">
                    训练项同伴:
                </div>
                <div class="info_value clearfix">
                   <span>{{selected_partner}}</span><button class="btn-blue" @click="choose_partner()">选择</button>
                </div>
            </div>
            <div class="info_box clearfix">
                <div class="info_name">
                    实验室备注:
                </div>
                <div class="info_value" id="comment">
                    <textarea v-model="comment" @focusin="textfocousin()" @focusout="textfocousout()" ></textarea>
                </div>
            </div>

        

			<div class="padding">
	            <a class="btn btn-blue btn-lg btn-block" @click="submitbookinglearn()" v-if="!tocheck">确认预约</a>
	            <a class="btn btn-blue btn-lg btn-block" @click="update()" v-else>确认修改</a>
	        </div>
        </div>
        

        <c-modal :config="station" id="stationes">
            <div class="station_con clearfix">
                <!-- <p workstationid="111" displayname="102会客厅" placeid="3" roomnum="102" openid="487" id="106">
                    <input type="radio" name="seat" id="3111"><label for="3111">111</label>
                    <img src="../../assets/images/cheak1_on.png">
                    <img src="../../assets/images/cheak1.png">
                </p> -->
                <p v-for="workstation in workstations" :_id="workstation.id" @click="click_station()">
                    <img src="../../assets/images/cheak1_on.png" v-if="workstation.id == checked_station_id">
                    <img src="../../assets/images/cheak1.png" v-else>
                    <input type="radio" :value="workstation.id" name="workstation" v-model="checked_station_id"><label>{{workstation.workstationcode}}</label>

                </p>
            </div>

        </c-modal>

        <c-modal :config="partner" id="partneres" >
            <div style="height:4rem;overflow-y:scroll" v-infinite-scroll="loadMoreStu">
                <div class="search_btn_con clearfix">
                    <input type="" placeholder="请输入训练同伴姓名" v-model.trim="search_info">
                    <button>搜索</button>
                </div>

                <div class="learninfo_con" >
                    <!-- <div class="learninfo_box" @click="select_stu()">
                        <span>林志炫</span>
                        <img src="../../assets/images/cheak1_on.png">
                        <img src="../../assets/images/cheak1.png">
                        <input type="radio">
                    </div> -->
                    <div  v-for="student in students" class="learninfo_box" @click="select_stu()">
                        <span>{{student.name+"-"+(student.mobile||'无手机号')}}</span>
                        <img src="../../assets/images/cheak1_on.png" v-if="student.id == checked_stu_id">
                        <img src="../../assets/images/cheak1.png" v-else>
                        <input type="radio" :value="student.id" v-model="checked_stu_id" name="student">
                    </div>

                </div>
            </div>
        </c-modal>
		<div class="attention" v-show="attentionshow">
			<div class="attentioncontent">
				<p class="attentiontitle">{{attentiontitle}} <span class="close" @click="closeattention">+</span></p>
				<p class="attentiontext">{{attentioncontent}}</p>
			</div>
		</div>
    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
            	attentionshow:false,
            	attentiontitle:'',
            	attentioncontent:'',
                comment:this.$route.query.comment,//评论
                subscribeid:this.$route.query.subscribeid,
                placeid:this.$route.query.placeid,
                roomname:this.$route.query.roomname,
                displayname:this.$route.query.displayname,
                uname:this.$route.query.uname,
                mobile:this.$route.query.mobile,
//              paramvalue:this.$route.query.originquery.paramvalue,
				paramvalue:'',
                originquery:this.$route.query.originquery,
                starttime:'',
                endtime:'',
                time:'',
                day:'',
                learnname:this.$route.query.learnname,
                learnid:this.$route.query.learnid,
                type:this.$route.query.type,//训练项类型

                checked_station_id:'',//记录选中的座位id
                checked_stu_id:'',//记录选中的学生id
                search_info:'',//绑定搜索框输入的训练项名称

                tocheck:this.$route.query.tocheck,

                station: {
                    show: false,
                    title: '选择座位位置',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                partner: {
                    show: false,
                    title: '选择训练项同伴',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                workstations:[
                    // {id: 1, workstationcode: "101", placeid: 4, displayname: "103房间", room_num: "101", openid: 499}
                ],//训练位
                students:[
                    // {stdid:1,name:'章一星'}
                ],//存放查询到的同伴
                students_bak:[
                    // {stdid:1,name:'章一星'}
                ],
                loadPage:1,
                hasMore:true,
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            var queryobj=this.$route.query
            console.log('----------route.query-----------'+JSON.stringify(queryobj))
            if(queryobj.from=='update'){
                this.day=queryobj.time.slice(0,11)+'00:00:00'
                this.starttime=queryobj.time.slice(11,16)+':00'
                this.endtime=queryobj.time.slice(17)+':00'
            }else{
                this.day= queryobj.time.day
                this.starttime=queryobj.time.starttime
                this.endtime=queryobj.time.endtime
            }
            console.log('this.day------'+this.day)
            console.log('this.startime------'+this.starttime)
            console.log('this.endtime------'+this.endtime)
            this.time=this.day.slice(0,11)+' '+this.starttime.slice(0,5)+'~'+this.endtime.slice(0,5)
            console.log('this.time------'+this.time)
            this.setTitle('预约信息确认')
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
//          this.init();
			this.queryparamvalue();
			this.queryattentionvalue();
            $("#slideid").focusin(function(){
            	$(this).addClass('slide')
            })
        },
        watch: {
            '$router': function (val, oldVal) {
                this.init();
            },
            search_info:function(){
                this.loadPage=1;

                this.search_stu_info(1);
            }
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            loadMoreStu(){
                //console.log('aaa')
                if(this.hasMore){
                    this.loadPage++;
                    this.search_stu_info(this.loadPage)
                }else{
                    //this.toast('没有更多了')
                }
                
            },
            textfocousin(){
            	$(".g-main").addClass("moveup")
            },
            textfocousout(){
            	$(".g-main").removeClass("moveup")
            },
            queryparamvalue(){
            	let self = this;
                this.post('/commparaconf/querycommparaconflist', {
                    command: "commparaconf/querycommparaconflist",
                    paramcode:'person_booking'
                }).done(function (data) {
                    self.paramvalue=data.commparaconflist[0].paramvalue;
           			self.init(self.paramvalue);
                });
            },
            queryattentionvalue(){
            	
            },
            init(paramvalue) {
                let self = this;
                // 训练项
                var startarr=[self.day.slice(0,11),self.starttime];
            	var startstr=startarr.join(' ');
            	var endarr=[self.day.slice(0,11),self.endtime];
            	var endstr=endarr.join(' ');
                if (paramvalue==0) {
	                this.post('/learn/querystationbytimeandplace', {
	                    command: "learn/querystationbytimeandplace",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                  	learnid:this.learnid,
//						learnid:31,
	//                  openstartdt:self.day.slice(0,11)+self.starttime,
	//                  openenddt:self.day.slice(0,11)+self.endtime,
	                    openstartdt:startstr,
	                    openenddt:endstr,
	                    planid:self.placeid
	                }).done(function (data) {
	                    if( self.$route.query.tocheck ){//如果是从修改按钮跳过来的
	                        self.workstations.push({
	                            id:self.$route.query.workstationid,workstationcode:self.$route.query.workstation
	                        });
	                        self.checked_station_id = self.$route.query.workstationid;
	                    }
	                    for ( var i in data.workstations ){
	                        if ( data.workstations[i].planid == self.placeid ){
	                            self.workstations.push( data.workstations[i] );
	                        }
	                    }
	                    if( !self.$route.query.tocheck ){
	                        self.checked_station_id = self.workstations[0].id;//默认推荐第一个训练位
	                    }
	                });	
                } else{
	                this.post('/learn/querystationbytimeandplacev2', {
	                    command: "learn/querystationbytimeandplacev2",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                  learnid:this.learnid,
//						learnid:31,
	//                  openstartdt:self.day.slice(0,11)+self.starttime,
	//                  openenddt:self.day.slice(0,11)+self.endtime,
	                    openstartdt:startstr,
	                    openenddt:endstr,
	                    planid:self.placeid
	                }).done(function (data) {
	                    if( self.$route.query.tocheck ){//如果是从修改按钮跳过来的
	                        self.workstations.push({
	                            id:self.$route.query.workstationid,workstationcode:self.$route.query.workstation
	                        });
	                        self.checked_station_id = self.$route.query.workstationid;
	                    }
	                    for ( var i in data.workstations ){
	                        if ( data.workstations[i].planid == self.placeid ){
	                            self.workstations.push( data.workstations[i] );
	                        }
	                    }
	                    if( !self.$route.query.tocheck ){
	                        self.checked_station_id = self.workstations[0].id;//默认推荐第一个训练位
	                    }
	                });	
                }
                
                this.post('/commparaconf/querycommparaconflist', {
                    command: "commparaconf/querycommparaconflist",
                    paramcode:'param_set'
                }).done(function (data) {
                	if(data.commparaconflist[1].param1==1){
                		self.attentionshow=false;
                	}else{
                		self.attentionshow=true;
                	}
                });
                
                this.post('/attention/queryattention', {
                    command: "attention/queryattention",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:self.placeid
                }).done(function (data) {
                    self.attentiontitle=data.attentionname;
                    self.attentioncontent=data.content;
                });

                if( this.type == 1 ){
                    /*this.post('/learn/querysatisfystudents', {
                        command: "learn/querysatisfystudents",
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        learnid:this.learnid,
//                      starttime:self.day.slice(0,11)+self.starttime,
//                      endtime:self.day.slice(0,11)+self.endtime
                        starttime:startstr,
                        endtime:endstr
                    }).done(function (data) {
                        if( self.$route.query.tocheck ){//如果是从修改按钮跳过来的
                            // data.students.push({
                            //     name:self.$route.query.partner,stdid:self.$route.query.partnerid
                            // });
                            self.checked_stu_id = self.$route.query.partnerid;
                        }

                        self.students = data.students.concat();
                        self.students_bak = data.students.concat();
                    });*/
                }
            },
            closeattention(){
            	this.attentionshow=false
            },
            back(){
                if( this.tocheck ){//如果是从修改按钮跳过来的
                    this.$router.push({
                        name: 'fdpersonal'
                    })
                }else{
                    this.$router.push({
                        name: 'fdselect_room',
                        query:this.originquery
                    })
                }

            },
            select_stu() {
                if( $(event.target).find('input').length == 0 ){
                    $(event.target).siblings('input').click();
                }else{
                    $(event.target).find('input').click();
                }
            },
            change_station(){//修改座位
                this.station.show = true;
            },
            choose_partner(){//选择同伴
                this.partner.show = true;
            },
            click_station(){//点击训练位
                if( $(event.target).find('input').length == 0 ){
                    $(event.target).siblings('input').click();
                }else{
                    $(event.target).find('input').click();
                }

            },
            search_stu_info(page){
                let self = this;
                // 训练项
                var startarr=[self.day.slice(0,11),self.starttime];
                var startstr=startarr.join(' ');
                var endarr=[self.day.slice(0,11),self.endtime];
                var endstr=endarr.join(' ');
                if( this.search_info == '' ){
                    this.students = [];
                }else{
                    this.post('/learn/querytrainparnter',{
                        "command": "learn/querytrainparnter",
                        sessionid:$.cookie('sid'),
                        "loginid": $.cookie('uid'),
                        "uid": $.cookie('uid'),
                        "starttime": startstr,
                        "endtime":endstr,
                        "pagesize": 20,
                        "pagenum":page,
                        "name":this.search_info
                    
                    }).done(data=>{
                        if(data&&data.errcode==0){
                            if(page==1){
                                this.students=data.list; 
                            }else{
                                this.students = this.students.concat(data.list);
                                if(this.students.length==data.count){
                                    this.hasMore = false;
                                }
                            }
                            
                        }
                    })
                }

            },
            submitbookinglearn(){//提交预约
                if( !this.checked_station_id ){
                    this.showAlert('请选择训练座位!');
                    return false;
                }
                if( this.type == 1 && !this.checked_stu_id ){
                    this.showAlert('请选择同伴!');
                    return false;
                }
                var self = this;
                var applystartdt = this.time.split(" ")[0]+' '+this.time.split(" ")[1].split("~")[0]+':00';
                var applyenddt = this.time.split(" ")[0]+' '+this.time.split(" ")[1].split("~")[1]+':00';

				var startarr=[self.day.slice(0,11),self.starttime];
            	var startstr=startarr.join(' ');
            	var endarr=[self.day.slice(0,11),self.endtime];
            	var endstr=endarr.join(' ');

                
                var json = {
                    command: "learn/submitbookinglearn",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    learnid:this.learnid,
//					learnid:31,
                    type:this.type,
                    placeid:this.placeid,
                    uid:$.cookie('uid'),
                    openid:this.checked_open_id,
                    workstationid:this.checked_station_id,
//		                applystartdt:self.day.slice(0,11)+''+self.starttime,
//		                applyenddt:self.day.slice(0,11)+''+self.endtime,
                    applystartdt:applystartdt,
                    applyenddt:applyenddt,
                    comment:this.comment
                };
                if( this.type == 1 ){
                    json.uid2 = this.checked_stu_id;
                }

                this.post('/learn/submitbookinglearn', json).done(function (data) {
                    if ( $.trim(data) == '' ){
                        self.showAlert('提交预约失败!');
                        return false;
                    }
                    self.showAlert({msg:'提交预约成功!',ok:function(){
                        self.$router.push({
                            name:'fdpersonal',
                            query:{}
                        });
                    }});

                });
            },
            update(){//点击修改预约
                if( !this.checked_station_id ){
                    this.showAlert('请选择训练座位!');
                    return false;
                }
                if( this.type == 1 && !this.checked_stu_id ){
                    this.showAlert('请选择同伴!');
                    return false;
                }
                var self = this;

                var json = {
                    command: "learn/updatestudentapply",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:this.subscribeid,
                    workstationid:this.checked_station_id,
                    comment:this.comment,
                };
                if( this.type == 1 ){
                    json.uid2 = this.checked_stu_id;
                };
                this.post('/learn/updatestudentapply', json).done(function (data) {
                    if ( $.trim(data) == '' ){
                        self.showAlert('修改预约失败!');
                        return false;
                    }

                    self.showAlert({msg:'修改预约成功!',ok:function(){
                        self.$router.push({
                            name:'fdpersonal',
                            query:{}
                        });
                    }});
                });
            }

        },
        computed:{
            selected_partner: function(){//根据当前的同伴id返回当前的同伴姓名
                var stu_name = '';
                if(this.$route.query.tocheck){//如果是修改页面过来的
                    stu_name=this.$route.query.partner
                }
                for( var i in this.students ){
                    if( this.students[i].id == this.checked_stu_id ){
                        stu_name = this.students[i].name;
                        break;
                    }
                }
                return stu_name
            },
            checked_station_code: function(){//根据当前选择的座位id返回当前座位编号
                var workstationcode = '';
                for( var i in this.workstations ){
                    if( this.workstations[i].id == this.checked_station_id ){
                        workstationcode = this.workstations[i].workstationcode;
                        break;
                    }
                }
                return workstationcode;
            },
            checked_open_id: function() {//根据当前选择的座位id返回当前openid
                var openid = '';
                for (var i in this.workstations) {
                    if (this.workstations[i].id == this.checked_station_id) {
                        openid = this.workstations[i].openid;
                        break;
                    }
                }
                return openid;
            }
        }
    }

</script>
<style type="text/css" scoped>

	.attention{
		background-color: rgba(0,0,0,0.5);
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.attentioncontent{
		background-color: #fff;
		position: absolute;
		bottom: 0;
		height: 85%;
		width: 100%;
	}
	.attentiontitle{
		text-align: center;
		padding: .4rem 0 .5rem 0;
		font-size: .4rem;
	}
	.attentiontext{
		padding: 0 .2rem;
		text-align: justify;
	}
	.close{
		transform: rotate(45deg);
		position: absolute;
		font-size: 1rem;
		right: .3rem;
		top: 0.05rem;
	}
	.g-wrapper{
		position: relative;
	}
	.slide{
		position: absolute;
		width: 100%;
		top: -300px;
	}
    .info_box{
        width:100%; padding:0.24rem; margin-bottom:0.02rem;
        background-color:#FFF; border-bottom:rgb(195, 195, 195);
    }
    .info_name{
        width:39%; float:left; padding-right:0.2rem;
    }
    .info_value{
        width:60%; float:left;
    }

    .info_box2{
        height:1rem;
    }
    .info_box2>div{
        height:100%; line-height:1.9;
    }
    .info_box2 button{
        height:100%; margin-left:0.2rem; display:block;
        float:right; width:1rem; height:100%; border-radius:0.05rem;
    }
    .info_box2 span{
        height:100%; float:left; line-height:1.9;
    }

    .station_con{
        padding:0.1rem;
    }
    .station_con p{
        float: left; width: 1.7rem; padding-left: 50px;
        margin-top: 3px; margin-bottom: 3px;
    }
    .station_con p input{
        display:block; float:left; width:0.3rem; height:0.3rem;
    }
    .station_con p label{
        display:block; float:left; margin-left:0.1rem;
    }
    .station_con p img{
        display:block; width:0.3rem; height:0.3rem;
        position:absolute;
    }

    /*选择同伴*/
    .search_btn_con{
        width:4.17rem; height:0.5rem; margin:0.2rem auto 0;
        background-color:#F2F2F2; border-radius:0.05rem; padding:0.1rem;
    }
    .search_btn_con input{
        width:77%; height:100%; background-color:transparent; border-right:1px solid;
    }
    .search_btn_con button{
        width:20%; height:100%;
    }
    .learninfo_con{
        width:100%; overflow-y:auto;
    }
    .learninfo_box{
        width:100%; height:0.58rem; line-height:0.58rem;
        border-bottom:1px solid #CCCCCC; background-color:#fff;
        padding-left:0.5rem; padding-right:0.5rem; position:relative;
    }
    .learninfo_box input{
        display:block; width:0.3rem; height:0.3rem;
        top:50%; position:absolute; margin-top:-0.15rem; opacity:0; right:0.5rem;
    }
    .learninfo_box img{
        display:block; width:0.3rem; height:0.3rem;
        top:50%; position:absolute; margin-top:-0.15rem; right:0.5rem;
    }

    #comment textarea{
        width:100%; padding:0; height:1.5rem;
    }
    .moveup{
    	position: fixed;
	    width: 100%;
	    top: -200px;
    }
</style>
