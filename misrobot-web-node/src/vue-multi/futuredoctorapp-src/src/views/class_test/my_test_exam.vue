<template>
    <div class="g-wrapper">
        <c-header>
             <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div> 
            <span style="font-size:.3rem;">{{testname}}</span>
            <span slot='headerRight' @click="submit" style="float:right;font-size:.24rem;">提交</span>
        </c-header>
        <div class="g-main">
            <div class="list">
                <p class="score">满分：<span>{{totalScore}}</span>分</p>
            </div>
            <div class="list" v-for="(item,index) in testContent">
                <h2>{{index+1}}、{{item.title}}（共{{item.totalnum}}道题，每题{{item.score}}分）</h2>
                <div class="cont" v-for="(cont,key) in item.cont">
                    <div class="flex">
                        <span>{{key+1}}、</span>
                        <h3>{{cont.questionbasename}}</h3>
                    </div>
                    <div v-if="cont.picturelist && cont.picturelist.length != 0" class="img">
                         <img :src="img.filepath" alt="" v-for="img in cont.picturelist" v-if="ispicture(img.filepath)">
                        <audio :src="img.filepath" muted="true" v-for="img in cont.picturelist" controls v-if="isaudio(img.filepath)">
                        </audio>
                          <video :src="img.filepath" controls v-for="img in cont.picturelist" v-if="isvideo(img.filepath)">
                          </video> 
                    </div>
                    <!-- <textarea v-if="item.type == 3" class="textarea"></textarea> -->
                    <ul v-if="item.cateid == 1">
                        <li v-for="ans in cont.questionitem">
                            <label>
                                <input type="radio" class="radio input" :name="index*10+key" @click="select(cont,item,ans)"><span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}}
                            </label>
                        </li>
                    </ul>
                    <ul v-if="item.cateid == 2">
                        <li v-for="ans in cont.questionitem">
                            <label>
                                <input type="checkbox" class="checkbox" @click="select(cont,item,ans)"><span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}}
                            </label>
                        </li>
                    </ul>
                    <ul v-if="item.cateid == 4" class="flexBetween">
                        <li>
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" @click="select(0,cont)">正确
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" @click="select(1,cont)">错误
                            </label>
                            
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../header'
    import methods from '../../methods'
    import { mapState,mapActions } from 'vuex'
    export default {
        name:'fdMyTestExam',
        components:{
            cHeader
        },
        data(){
            return{
                testname:'',
                testContent:[
                    // {
                    //     title:'一、选择题（共1小题，4分）',
                    //     type:0,
                    //     cont:[
                    //         {
                    //             code:'1、',
                    //             title:'患者男性，27岁。既往身体健康，运动后突然呼吸困难。以前'+
                    //             '有过不明原因的心脏杂音，现双肺湿性啰音超过1/2肺野，心脏可闻及病理性'+
                    //             '第4心音及IV/VII海鸥样杂音，向心底及腋下穿导，最有可能的诊断是',
                    //             answer:[
                    //                 {code:'A',title:'无痛性心梗死',id:1},
                    //                 {code:'B',title:'二尖瓣键索断裂',id:2},
                    //                 {code:'C',title:'特发性肥厚主动脉下狭窄',id:3},
                    //                 {code:'D',title:'房间隔缺损',id:4},
                    //                 {code:'E',title:'血栓柱塞二尖瓣',id:5}
                    //             ]    
                    //         }
                    //     ]
                    // },
                    // {
                    //     title:'二、判断题（共2小题，每题3分）',
                    //     type:2,
                    //     cont:[
                    //         {
                    //             code:'1、',
                    //             title:'首选的止血方法是刮宫',
                    //             answer:[
                    //                 {code:'',title:'正确',id:6},
                    //                 {code:'',title:'错误',id:7},
                    //             ]
                    //         },
                    //         {
                    //             code:'2、',
                    //             title:'首选的止血方法是雄激素',
                    //             answer:[
                    //                 {code:'',title:'正确',id:8},
                    //                 {code:'',title:'错误',id:9}
                    //             ]
                    //         }
                    //     ]
                    // },
                    // {
                    //     title:'三、问答题（共5题，总共30分）',
                    //     type:3,
                    //     cont:[
                    //         {
                    //             code:'1、',
                    //             title:'复苏抢救时应采取哪些紧急措施？（6分）',
                    //             answer:[]
                    //         }
                    //     ]
                    // }
                ],
                questionlist:[],
                totalScore:0,
                checkedNum:0,
                answer:'',
            }
        },
        // filters:{
        //     index:function(value){
                
        //     }
        // },
        mounted(){
            let self = this
            this.testname = this.$route.query.name
            this.queryPaperCategoryList()
            this.queryViewPaper()
            // console.log(this.testContent)
            self.registerToNative('goBack', function (data) {
                self.back();
			});
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
            back(){
                 this.showConfirm({
                    title: '提醒',
                    msg: '你当前评价尚未提交保存，是否确认返回？',
                    theme: 'modal-confirm modal-white',
                    ok: function () {
                        window.history.back()
                    },
                    cancel: function () {

                    }
                })
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
            queryViewPaper(){
                 let self = this
                this.post('/exampaper/viewpaper',{
                    command:'exampaper/viewpaper',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    paperid:self.$route.query.paperid
                }).done(function(data){
                    // console.log(data)
                //    alert('success')
                    if(data && data.errcode == 0){
                        self.totalScore = data.paperinfo.score
                    }
                }).fail(function(error){
                    
                })
            },
            queryPaperCategoryList(){
                let self = this
                this.post('/exampaper/querypapercategorylist',{
                    command:'exampaper/querypapercategorylist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    paperid:self.$route.query.paperid
                }).done(function(data){
                    // console.log(data)
                    if(data && data.categoryList.length != 0){
                        data.categoryList.map((item)=>{
                            self.testContent.push({
                                cateid:item.cateid,
                                title:item.nickname,
                                id:item.id,
                                paperid:item.paperid,
                                totalnum:item.totalnum,
                                totalscore:item.totalscore,
                                score:item.score,
                                cont:[],
                                priority:item.priority,
                            })
                            self.queryPaperQuestion(item.id,item.cateid)
                        })
                        console.log(self.testContent)
                    }
                }).fail(function(error){
                    console.log(error)
                })
            },
            queryPaperQuestion(mainid,cateid){
                let self = this
                this.post('/exampaper/querypaperquestion',{
                    command:'exampaper/querypaperquestion',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    paperid:self.$route.query.paperid,
                    mainid:mainid,
                    cateid:cateid
                }).done(function(data){
                    // alert('success')
                    if(data && data.questionlist.length != 0){
                        self.testContent.map((item)=>{
                            data.questionlist.map((item1)=>{
                                if(item1.mainid == item.id){
                                    item.cont.push(item1)
                                }
                            })
                        })
                    }
                    console.log(self.testContent)
                    self.testContent.sort(self.sort)
                }).fail(function(error){
                    console.log(error)
                })
            },
            sort(a,b){
                return a.priority - b.priority;
            },
            select(key,item,ans){
                // alert(key)
                // console.log(item)
                // alert('aaa')
                // console.log(ans)
                if(key == 0 || key == 1){
                    if(typeof item.checked == 'undefined'){
                        this.$set(item,'checked',true)
                    }
                    item.answer = key
                    console.log(item)
                }else if(item.cateid == 1){
                    // console.log(key)
                    key.questionitem.map(item1=>{
                        delete item1.checked
                    })
                    if(typeof ans.checked == 'undefined'){
                        this.$set(ans,'checked',true)
                        this.$set(item,'checked',true)
                    }
                    key.answer = ans.itemname
                }else if(item.cateid == 2){
                    if(typeof ans.checked == 'undefined'){
                        this.$set(ans,'checked',true)
                        this.$set(item,'checked',true)
                    }else{
                        delete ans.checked
                    }
                }
            },
            submit(){
                let self = this
                this.questionlist = []
                this.checkedNum = 0
                this.answer = ''
                this.testContent.map((item)=>{
                    if(item.cateid == 4){
                        item.cont.map((item1)=>{
                            if(item1.checked){
                                this.questionlist.push({
                                    cateid:item.cateid,
                                    questionbaseid:item1.questionbaseid,
                                    answer:item1.answer,
                                    score:item1.score
                                })
                            }
                        })
                    }else if(item.cateid == 1){
                       item.cont.map((item2)=>{
                           item2.questionitem.map((item3)=>{
                               if(item3.checked){
                                   this.questionlist.push({
                                       cateid:item.cateid,
                                       questionbaseid:item2.questionbaseid,
                                       answer:item2.answer,
                                       score:item2.score
                                   })
                                    this.$set(item2,'checked',true)
                               }
                           })
                       })
                    }else if(item.cateid == 2){
                        item.cont.map((item4)=>{
                            this.answer = ""
                            item4.questionitem.map((item5)=>{
                                if(item5.checked){
                                    this.answer+=item5.itemname
                                    this.$set(item4,'checked',true)
                                }
                            })
                            this.questionlist.push({
                                cateid:item.cateid,
                                questionbaseid:item4.questionbaseid,
                                answer:self.answer,
                                score:item4.score
                            })
                        })
                    }
                })
                this.testContent.map((item)=>{
                    item.cont.map((item1)=>{
                        if(!item1.checked){
                            this.checkedNum++
                        }
                    })
                })

                // alert(this.checkedNum)
                if(this.checkedNum != 0){
                    this.toast('还有'+this.checkedNum+'道题，没有做！')
                }else{
                    this.post('/unifyexam/submittest',{
                        command:'unifyexam/submittest',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid:$.cookie('uid'),
                        paperid:self.$route.query.paperid,
                        questionlist:self.questionlist,
                        examid:self.$route.query.id,
                        uploadpath:'',
                    }).done(function(data){
                        // alert('success')
                        if(data &&　data.errcode == 0){
                            self.$router.push({
                                name: 'fdIntegrated_my_test'
                            })
                        }else if(data.errcode == 7011){
                            self.showConfirm({
                                title: '提醒',
                                msg: '你已提交过试卷，请勿重复提交！',
                                theme: 'modal-confirm modal-white',
                                ok: function () {
                                    
                                },
                                cancel: function () {

                                }
                            })
                        }
                    }).fail(function(error){
                        console.log(error)
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .list{
        margin-top:.2rem;
        margin-bottom: 0;
        padding:0 .3rem .1rem;
        font-size:.24rem;
    }
    .list:nth-of-type(1){
        padding-bottom:0;
    }
    .score{
        width:100%;
        height:.72rem;
        line-height: .72rem;
        text-align: right;
        margin:0;
        /* padding:0 .3rem; */
        font-size:.28rem;
        color:#333333;
    }
    .list h2{
        font-size:0.26rem;
        color:#333333;
        font-weight: normal;
        width:100%;
        height:.72rem;
        line-height: .72rem;
        border-bottom: solid 1px rgb(230,230,230);
    }
    .cont{
        border-bottom:solid 1px rgb(230,230,230);
    }
    .cont:nth-last-of-type(1){
        border:none;
    }
    .flex{
        display:flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding:.2rem 0;
    }
    .flex span{
        position:relative;
         top:.02rem; 
    }
    .cont div h3{
        font-size:.24rem;
        font-weight: normal;
        line-height: 1.6;
    }
    .cont ul{
        padding-left:.4rem;
    }
    .cont ul li{
        margin-bottom: .2rem;
        display:flex;
        align-items: center;
    }
    .flexBetween{
        width:100%;
        display:flex;
        /* justify-content: flex-around; */
    }
    .flexBetween li{
        width:50%;
    }
    .textarea{
        width:100%;
        height:1.5rem;
        background:rgb(242,242,242);
        padding:.2rem;
        /* margin-left:.4rem; */
    }
    /* .textarea textarea{
        width:100%;
        height:1rem;
    }  */
    .input{
        position: relative;
        top:.05rem;
    }
    .checkbox{
		width:0.21rem;
		height: 0.21rem;
		background-image: url('../../assets/images/checkbox.png');
		border-radius: 0;
        position:relative;
        top:.02rem;
        margin-right: .2rem;
	}
	.checkbox:checked{
		background-image:url(../../assets/images/checkbox_on.png);
	}
    .radio {
        width: .25rem;
        height: .25rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: .15rem;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;
        background-image: url('../../assets/images/cheak.png');
        background-size: cover;
        margin-right: .2rem;
    }

    .radio:checked {
        background-image: url('../../assets/images/cheak_on.png');
        background-size: cover;
    }
    .img{
        display: flex;
        flex-direction: column;
        width:100%;
    }
    .img img{
        width:100%;
        margin-bottom:.05rem;
        /* height: 100%; */
    }
    .img audio{
        width:100%;
    }
    .img video{
        width:100%;
    }
    video::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    video::-webkit-media-controls-panel {
        width: calc(100% + 40px);
    }
    audio::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    audio::-webkit-media-controls-panel {
        width: calc(100% + 40px);
    }
</style>