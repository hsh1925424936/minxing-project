<template>
    <div class="g-wrapper root">
        
        <div>
            <c-header>
                <div slot="headerLeft">
                    <a @click="back()" class="header-back-btn">
                        <img src="../../assets/images/icon_fanhui.png" />
                    </a>
                </div>
                选择学生
            </c-header>
            <div>
                <ul class="selectStuUl">
                    <li><span>课程名称：</span><span>{{course.coursename}}</span></li>
                    <li><span>技&nbsp;能&nbsp;项&ensp;：</span><span>{{course.learnname}}</span></li>
                    <li><span>上课时间：</span><span>{{course.starttime}}</span></li>
                    <li><span>上课教室：</span><span>{{course.placename}}</span></li>
                </ul>
            </div>
        </div>
        
        <div class="g-main">
        <div v-if='!noContent'>   
            <div>
            <ul class="stuUl">
                <li class="stuUlHeader"><span>姓名</span><span>得分</span></li>
                <li class="stuUlContent" v-for='item in students'>
                    <span>{{item.stuname}}</span>
                    <span v-if='item.score || item.score == 0'>{{item.score}}</span>
                    <span v-else><a @click='goGraded(item)'>评分</a></span>
                </li>
            </ul>
            </div>
            <div class="footer">
                <a @click='submitScore'>结束评分</a>
                <p>如有学生没来或不需要评分，请手工点击“结束评分”，谢谢。</p>
            </div>
        </div>
        <no-content v-if='noContent'></no-content>
        </div>
        <c-model :config='trainModel'>
            <p style="padding: 0 0.2rem;">所有学生都还没成绩，请确认是取消上课还是不需要评分或学生没来？</p>
            <ul class="modelUl">
                <li v-for='(item,index) in selects'>
                    <span>{{item.sel}}</span>
                    <input type="radio" :value='index' v-model='train' class="checkbox">
                </li>
            </ul>
            <template slot="buttons">
				<button type="button" class="btn btn-blue btn-sure" style="color:black;font-size: 0.3rem;" @click='ok'>确认</button>
				<button type="button" class="btn btn-blue btn-false" style="color:black;font-size: 0.3rem;" @click='close'>取消</button>
			</template>
        </c-model>
        <c-model :config='selectModel'>
            <ul class="modelUl">
                <li v-for='(item,index) in selectClass' style="border-top: solid 1px #c3c3c3;height:1rem;">
                    <span>{{item.class}}</span>
                    <input type="radio" :value='index' v-model='sel' class="checkbox">
                </li>
            </ul>
            <template slot="buttons">
				<button type="button" class="btn btn-blue btn-sure" style="color:black;font-size: 0.3rem;" @click='select'>确认</button>
			</template>
        </c-model>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../header'
    import methods from '../../methods'
    import { mapState, mapActions } from 'vuex';
    import cModel from '../../components/modal'
    import noContent from '../no_content'
    export default {
        name:'sk_grade_selectStu',
        components:{
            cHeader,
            cModel,
            noContent
        },
        data () {
            return {
                course:{},
                selects:[
                    {sel:'取消上课'},
                    {sel:'不需要上课'},
                    {sel:'学生没来'}
                ],
                selectClass:[
                  {class:'主演评分表'},
                  {class:'旁听评分表'}  
                ],
                students:[
                    // {stuname:'侯文浩'},
                    // {stuname:'梁浩磊'},
                    // {stuname:'丁路遥'},
                    // {stuname:'章一星',score:20},
                    // {stuname:'王威园',score:0},
                    // {stuname:'丁路遥',score:18},
                    // {stuname:'章一星',score:20},
                    // {stuname:'王威园',score:0}
                ],
                trainModel:{
                    show: false,
					title: '提醒',
					hideOnClickOut:true,
					theme: 'modal-confirm modal-white'
                },
                selectModel:{
                    show:false,
                    title:'选择评分表',
                    hideOnClickOut:true,
					theme: 'modal-confirm modal-white'
                },
                scoreid:0,
                sel:'',
                train:'',
                // stuscorecourse:[],
                sheetlist:[],
                stunum:0,
                stuscore:{},
                noContent:false
            }
        },
        mounted () {
            let self = this
            self.scoreid = self.$route.query.booking
            this.registerToNative('skToGrade', function (data) {
                    self.init()
                    if(self.students.length != 0){
                        var stunumber = []
                        for(let i=0;i<self.students.length;i++){
                            stunumber.push(self.students[i].score)
                        }
                        var stu = 0;
                        stunumber.map(function(item,index,arr){
                            if(item == undefined){
                                stu ++
                            }
                        })
                        if(stu == 1){
                            self.finish(2)
                        }
                    }
            });
            
            this.registerToNative('goBack', function (data) {
                  self.back();
            });
            self.init()
        },
        methods:{
            ...methods,
             ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            back:function(){
                 this.$router.push({
                    name: 'fdsk_grade',
                });
            },
            // 请求数据
            init:function(){
                 let self=this
                 self.post('/score/liststuscore', {
                     command: 'score/liststuscore',
                     sessionid: $.cookie('sid'),
                     loginid: $.cookie('uid'),
                     scoreid:self.scoreid,
                 }).done(function (data) {
                     // console.log(data)
                     if(data.course){
                         self.course = data.course
                         self.sheetlist = data.sheetlist
                         self.students = data.stuscorelist
                     }
                    //  self.stuscorecourse = data.stuscorecourse
                    //  console.log(self.students)
                     
                     if(self.students.length == 0){
                        self.noContent = true
                    }else{
                        self.noContent = false
                    }
                 }).fail(function(){
                     self.noContent = true
                 });
            },
            goGraded:function(item){
                var self = this
                self.stuscore = item
              if(self.course.multiscoresheet == 0 || !self.course.multiscoresheet){
                     self.invokeNative('IntentCourseGradeActivity', {
                        examineeid: self.stuscore.uid,//uid
                        examid: self.scoreid,//scoreid
                        placeid: self.course.placeid,//placeid
                        placeroomnum: self.course.roomnum,//roomnum
                        dispalyname: self.course.displayname,//displayname
                        examinerid: $.cookie('uid'),//
                        scoresheetcode: self.sheetlist[0].scoresheetcode,//
                        scoretype: 2,
                        learnid: self.course.learnid,
                        learnname: self.course.learnname,
                        stuname: self.stuscore.stuname
                    });

                }else if(this.course.multiscoresheet == 1){
                    this.selectModel.show = true
                }
            },
             // 点击评分后弹出的模态框
            select:function(){
                if(this.sel === ''){
                    this.toast('至少选择一项')
                }else{
                    let self = this
                    self.selectModel.show = false
                    self.invokeNative('IntentCourseGradeActivity', {
                        examineeid: self.stuscore.uid,//uid
                        examid: self.scoreid,//scoreid
                        placeid: self.course.placeid,//placeid
                        placeroomnum: self.course.roomnum,//roomnum
                        dispalyname: self.course.displayname,//displayname
                        examinerid: $.cookie('uid'),//
                        scoresheetcode: self.sheetlist[self.sel].scoresheetcode,//
                        scoretype: 2,
                        learnid: self.course.learnid,
                        learnname: self.course.learnname,
                        stuname: self.stuscore.stuname
                    });

                }
            },
            // 结束评分（全部学生都未评分）：确定和取消
            ok:function(){
                if(this.train === ''){
                    this.toast('至少选择一项')
                }else{
                    this.finish(this.sel+3)
                }
            },
            close:function(){
                this.trainModel.show = false
            },
            // 结束评分接口
            finish:function(status){
                let self = this
                self.post('/score/stopgrade', {
                command: 'score/stopgrade',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                id:self.course.id,
                status:status
            }).done(function (data) {
                   self.$router.push({
                   name:"fdsk_grade",
                   query:{
                       type:2
                   }
               })
            });
            },
            // 结束评分（部分学生未评分）
            submitScore:function(){
                    let self = this
                    let scores = []
                    for(let i=0;i<self.students.length;i++){
                        scores.push(self.students[i].score)
                    }
                    console.log(scores)
                    let stunum =0;
                    scores.map(function(item,index,arr){
                        if(item == undefined){
                            stunum ++
                        }
                    })
                    console.log(stunum)
                    if(stunum == 0){
                        self.finish(2)
                    }else if(stunum == scores.length){
                        self.trainModel.show = true
                    }else if(stunum < scores.length && scores.indexOf(undefined) > -1){
                        // 当有部分学生未评分的时候，显示提示框
                         self.showConfirm({
                            title:'提醒',
                            msg:`还有${stunum}位学生没成绩，你确定结束评分了吗？`,
                            theme:'modal-confirm modal-white',
                            ok: function () {
                                 self.finish(2)
                            },
                            cancel: function () {}
                         })
                    }
            }
        }
    }
</script>
<style scoped>
    .root{
        /*height: 100%;*/
        background:rgb(242,242,242);
        position: relative;
    }
     .selectStuUl{
        padding: 0.3rem  0.2rem;
        margin-bottom: 0.2rem;
        background: #3499db;
        position: relative;
        border-top: solid 0.02rem #3499db;
        color: white;
    }
     .selectStuUl li{
        margin-bottom: 0.2rem;
    }
    .selectStuUl li:nth-last-of-type(1){
        margin: 0;
    }
     .selectStuUl li span:nth-child(1){
        display: inline-block;
        width: 1.5rem;
    }
    .stuUl{
        width: 100%;
        background: #ffffff;
    }
    .stuUl li{
        height: 0.8rem;
    }
    .stuUlHeader{
        width: 100%;
        background: rgb(219,219,219);
        padding: 0 5%;
    }
    .stuUl li span{
        display: inline-block;
        width: 2rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
    }
    .stuUl li span:nth-child(2){
        float: right;
    }
    .stuUl li span:nth-child(2) a{
        display: inline-block;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        color: white;
        background: #3499db;
        border-radius: 0.1rem;
    }
    .stuUlContent{
        width: 90%;
        margin: 0 auto;
        border-bottom: solid 1px #c3c3c3;
    }
    .stuUlContent:nth-last-of-type(1){
        border: none;
    }
    .footer{
        width: 100%;
        border: none;
    }
    .footer a{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        border-radius: 0.1rem;
        font-size: 0.35rem;
        background: white;
        text-align: center;
    }

    .footer p{
        width: 100%;
        margin: 0.2rem auto;
        font-size: 0.2rem;
        text-align: center;
        color: #c3c3c3;
    }
    .modelUl li{
        color: black;
        padding: 0 0.2rem;
        height: 0.6rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .modelUl li a img{
        width: 0.3rem;
        height: 0.3srem;
    }
</style>