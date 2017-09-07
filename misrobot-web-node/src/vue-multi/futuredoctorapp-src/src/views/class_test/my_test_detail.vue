<template>
    <div class="g-wrapper">
        <c-header>
             <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div> 
            <span style="font-size:.3rem;">{{testname}}</span>
        </c-header>
        <div class="g-main">
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
                    <ul v-if="item.title == '单选题'">
                        <li v-for="ans in cont.questionitem">
                            <label v-if="ans.itemname == cont.answer1" :class="{'error':cont.answer1 != cont.answer}">
                                <input type="radio" class="radio input" :name="index*10+key" checked disabled><span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}}
                            </label>
                            <label v-if="ans.itemname != cont.answer1">
                                 <input type="radio" class="radio input" :name="index*10+key" disabled><span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}} 
                            </label>
                        </li>
                    </ul>
                    <ul v-if="item.title == '多选题'">
                        <li v-for="ans in cont.questionitem">
                            <label v-if="ans.select" :class="{'error':cont.answer1.toUpperCase() != cont.answer.toUpperCase()}">
                                <input type="checkbox" class="checkbox" checked disabled>
                                <span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}}
                            </label>
                            <label v-if="!ans.select">
                                <input type="checkbox" class="checkbox" disabled>
                                <span v-if="ans.itemname">{{ans.itemname}}、</span>{{ans.content}}
                            </label>
                        </li>
                    </ul>
                    <ul v-if="item.title == '判断题'" class="flexBetween">
                        <li v-if="cont.answer1 == 0" :class="{'error':cont.answer1 != cont.answer}">
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" checked disabled>正确
                            </label>
                        </li>
                        <li v-if="cont.answer1 == 0">
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" disabled>错误
                            </label>
                        </li>
                        <li v-if="cont.answer1 == 1">
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" disabled>正确
                            </label>
                            
                        </li>
                        <li v-if="cont.answer1 == 1" :class="{'error':cont.answer1 != cont.answer}">
                            <label>
                                <input type="radio" :name="index*10+key" class="radio input" checked disabled>错误
                            </label>
                            
                        </li>
                    </ul>
                     <div>
                        <h3 style="color:#3499db;">正确答案：{{cont.answer | answer}}</h3>
                    </div>
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
        filters:{
            answer:function(val){
                if(val == 0){
                    return '正确'
                }else if(val == 1){
                    return '错误'
                }else{
                    return val
                }
            }
        },
        data(){
            return{
                testname:'',
                testContent:[],
                totalScore:0,
                answerList:[],
                testList:[]
            }
        },
        mounted(){
            let self = this
            this.testname = this.$route.query.name
            this.queryPaperCategoryList()
            this.queryViewPaper()
            this.queryStuExamInfo()
            console.log(this.testContent)
            // console.log(this.answerList)
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
                window.history.back()
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
            queryStuExamInfo(){
                let self = this
                this.post('/unifyexam/querystuexaminfo',{
                    command:'unifyexam/querystuexaminfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    paperid:self.$route.query.paperid,
                    examid:self.$route.query.id
                }).done(function(data){
                    if(data && data.errcode == 0){
                        self.answerList = data.gradeinfo
                        // console.log(self.answerList)
                    }
                }).fail(function(error){
                    // console.log(error)
                })
            }, 
            queryViewPaper(){
                 let self = this
                this.post('/exampaper/viewpaper',{
                    command:'exampaper/viewpaper',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    paperid:self.$route.query.paperid
                }).done(function(data){
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
                    if(data && data.errcode == 0){
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
                        self.testContent.sort(self.sort)
                    }
                }).fail(function(error){
                    // console.log(error)
                })
            },
            sort(a,b){
                return a.priority - b.priority;
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
                }).done((data)=>{
                    if(data && data.errcode == 0){
                        data.questionlist.map((item)=>{
                            this.answerList.map((item1)=>{
                                if(item.questionbaseid == item1.questionbaseid){
                                    item.answer1 = item1.answer1
                                }
                            })
                        })
                        this.testContent.map((item)=>{
                            data.questionlist.map((item1)=>{
                                if(item1.mainid == item.id){
                                    item.cont.push(item1)
                                }
                            })
                            if(item.cateid == 2){
                                item.cont.map(item1=>{
                                    item1.questionitem.map(item2=>{
                                        if(item1.answer1.indexOf(item2.itemname)>-1){
                                            item2.select = true
                                        }
                                    })
                                })
                            }
                        })
                        // self.testContent.map((item)=>{
                        //     data.questionlist.map((item1)=>{
                        //         if(item.cateid == 2){
                        //             item1.questionitem.map((item3)=>{
                        //                 self.answerList.map((item4)=>{
                        //                     if(item4.answer1.indexOf(item3.itemname) > -1){
                        //                         item3.select = true
                        //                     }else{
                        //                         item3.select = false
                        //                     }
                        //                 })
                                        
                        //             })
                        //         }
                        //     })
                        // })
                    }
                }).fail(function(error){
                    console.log(error)
                })
            },
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
    .error{
        color:red;
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
        /* padding-bottom: .2rem; */
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