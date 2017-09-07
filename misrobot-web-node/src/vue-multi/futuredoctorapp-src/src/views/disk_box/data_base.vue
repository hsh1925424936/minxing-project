<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            资料库
            <!-- <span slot='headerRight' style="float:right;font-size:.24rem;">下载记录</span> -->
        </c-header>
         <div class="search flex">
                <div class="searchLeft flex" @click="selCourseShow = true">
                    <img src="../../assets/images/bnt_shaixuan.png" alt="">
                </div>
                <div class="searchRight flex">
                    <input type="text" v-model="searchName" placeholder="请输入关键字查询">
                    <span @click="search">搜索</span>
                </div>
        </div>
        <div class="g-main">     
           <div class="list flex" v-for="(item,index) in shareFileList" @click="enterDetail(item)"> 
                <!-- <input type="radio" class="radio" name="1" @click.stop="select(item)"> -->
                <img :src="getUrl(item)" alt="">
                <div>
                    <h2 class="flex-between">
                        <span>{{item.name}}{{item.suffix}}</span>
                        <span>{{item.coursename}}</span>
                    </h2>
                    <div>
                        <p>{{item.filesize}}</p>
                        <p class="flex-between">
                            <span>{{item.updatetime}}</span>
                            <span v-if="item.uname">分享来自{{item.uname}}</span>
                        </p>
                        
                    </div>
                </div>
           </div>
        </div>
        <div v-if="showIframe" class="iframe">
             <c-header>
            <div slot="headerLeft">
                <a @click="showIframe = false" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            资料库
        </c-header>
             <iframe :src="url" frameborder="0"></iframe>
        </div>
            <!--视频-->
       <transition name="fade">
            <div v-if="showVideo" class="videoAlert">
                <!-- <video controls>
                    <source :src="videoUrl" type="video/mp4">
                </video> -->
                     <video :src="videoUrl" loop autoplay controls="controls">
                    </video> 
                    <!-- <my-video :sources="video.sources" :options="video.options"></my-video> -->
            </div>

       </transition>
        <!--音频  -->
        <transition name="fade">
            <div v-if="showAudio" class="audioAlert">
                <img src="../../assets/images/yinpin.gif" alt="">
                <audio :src="audioUrl" muted="true" loop autoplay controls>
                </audio>
            </div>
       </transition>
        <!--图片  -->
        <transition name="fade">
            <div v-if="showPicture" class="pictureAlert">
                <img :src="imgUrl" alt="无法获取资源">
            </div>
        </transition>
        <!-- <div class="footer flex-between">
            <p class="flex">
                 <input type="checkbox" class="checkbox" style="margin-right:.1rem;" @click="selectAll">全选 
            </p>
            <p>
                <span>下载</span>
            </p>
        </div> -->

         <transition name='fade'>
            <div class="modelDiv" v-show='selCourseShow' @click='selCourseShow = false'>
                <transition name='slide'>
                    <div class="modelCont" v-show='selCourseShow' @click.stop='selTeacherShow = true'>
                        <p class="modelHead">
                            <a @click.stop='selCourseShow = false'>取消</a>
                            <a @click.stop='ok'>完成</a>
                        </p>
                        <p class="center"></p>
                        <ol class="teacherOl">
                            <li v-for="(item,index) in courseName" :data-id="item.course_id" :class='{active:index==0}'>{{item.course_name}}</li>
                        </ol>
                    </div>
                </transition>
            </div>
        </transition>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import Vue from 'vue'
    // import myVideo from 'vue-video'
    import cHeader from '../header'
    import methods from '../../methods'
    import noContent from '../no_content'
    import { mapState,mapActions } from 'vuex'
    let bus = new Vue({})
    export default {
        name:'myTest',
        components:{
            cHeader,
            noContent,
        },
        data(){
            return{
                searchName:'',
                shareFileList:[],
                selCourseShow:false,
                showIframe:false,
                showPicture:false,
                showVideo:false,
                showAudio:false,
                courseName:[],
                courseId:'',
                url:'',
                imgUrl:'',
                audioUrl:"",
                videoUrl:'',
                noContent:false,
            }
        },
        mounted(){
            let self = this
            this.init()
            this.queryStudentCourse()
            this.registerToNative('goBack', function (data) {
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
                if(this.showIframe){
                    this.showIframe = !this.showIframe
                }else if(this.showPicture){
                    this.showPicture = !this.showPicture
                }else if(this.showVideo){
                    this.showVideo = !this.showVideo
                }else if(this.showAudio){
                    this.showAudio = !this.showAudio
                }else{
                     window.location.href = '/pages/futuredoctorapp/application.html'
                }
            },
            queryStudentCourse(){
                let self = this
                this.post("/courseware/getstuallcource",{
                    command:'courseware/getstuallcource',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    stuid:$.cookie('uid')
                }).done((data)=>{
                    // console.log(data)
                    if(data && data.errcode == 0){
                        this.courseName = data.courselist
                        // 选择课程名称的时候
                        
                        // 默认课程id 为第一个数据的id
                        this.courseId = this.courseName[0].course_id
                        $('ol').on('scroll', function () {
                            let height = $($('.center')[0]).offset().top
                            $($('ol>li')[0]).removeClass('active')
                            $('ol>li').each(function () {
                                if ($(this).offset().top <= height + 10 && $(this).offset().top >= height - 10) {
                                    $(this).css('color','black').siblings().css('color','#c3c3c3')
                                    self.courseId = $(this).attr('data-id')
                                }
                            })
                        })
                    }
                }).fail((data)=>{
                    console.log(error)
                })
            },
            init(){
                this.post('/courseware/searchsharefiles4s',{
                    command:'courseware/searchsharefiles4s',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    sid:$.cookie('uid'),
                    filename:this.searchName,
                    status:4,
                    courseid:this.courseId,
                }).done((data)=>{
                    // console.log(data)
                    if(data && data.errcode == 0){
                        this.shareFileList = data.sharefilelist
                        if(this.shareFileList.length == 0){
                            this.noContent = true
                        }else{
                            this.noContent = false
                        }
                    }else{
                        this.noContent = true
                    }
                }).fail((error)=>{
                    // console.log(error)
                    this.noContent = true
                })
            },
            search(){
                this.init()
            },
            select(){
                
            },
            selectAll(){

            },
            getUrl(item){
                if(item.filecls == 100){
                    return require('../../assets/images/wenjian.png')
                }else if(item.filecls == 4){
                    if(item.suffix == '.docx' || item.suffix == '.doc'){
                        return require('../../assets/images/word.png')
                    }else if(item.suffix == '.xlsx' || item.suffix == '.xls'){
                        return require('../../assets/images/excel.png')
                    }else if(item.suffix == '.ppt' || item.suffix == '.pptx'){
                        return require('../../assets/images/ppt.png')
                    }else{
                        return require('../../assets/images/word.png')
                    }
                }else if(item.filecls == 1){
                    return require('../../assets/images/avi.png')
                }else if(item.filecls == 2){
                    return require('../../assets/images/yinpin.png')
                }else if(item.filecls == 3){
                    return item.filepath
                }
            },
            enterDetail(item){
                if(item.filecls == 100){//文件夹
                    this.$router.push({
                        name: "fdDataBaseFile",
                        query:{
                            parent_id:item.cid,
                            file_class:item.filecls,
                            uid:item.uid,
                            name:item.name
                        }
                    })
                }else if(item.filecls == 4){// wps格式文档
                    // window.open(item.filepath)
                    this.showIframe = true
                    this.url = "https://view.officeapps.live.com/op/embed.aspx?src="+item.filepath
                    //window.open(item.filepath)
                }else if(item.filecls == 3){//图片
                    // window.open(item.filepath)
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                    this.showPicture = true
                    this.imgUrl = item.filepath
                }else if(item.filecls == 1){//视频
                    this.showVideo = true
                    this.videoUrl = item.filepath
                }else if(item.filecls == 2){
                    this.showAudio = true
                    this.audioUrl = item.filepath
                }
            },
            ok(){
                this.init()
                this.selCourseShow = false
            }
        }
    }
</script>
<style scoped>
   .flex {
       display:flex;
       align-items: center;
       justify-content: flex-start;
   }
   .flex-between {
       display: flex;
       justify-content: flex-between;
       align-items: center;
   }
   .search{
       width:100%;
       height:.88rem;
       /* border-bottom: solid 1px lightgray; */
       padding:0 .3rem;
       margin-bottom:.2rem;
       background:rgb(255,255,255);
   }
   .searchLeft img{
       width:.35rem;
       margin-right: .3rem;
   }
   .searchRight{
       background:rgb(242,242,242);
       width:calc(100% - .35rem);
       height:.6rem;
       border-radius:.1rem;
       /* color:#999999; */
   }
   .searchRight span{
       padding-left:.18rem;
       color:rgb(140,140,140);
       border-left:solid 1px rgb(220,220,220);
   }
   .searchRight input{
       width:80%;
       outline: none;
       padding-left:.1rem;
       background:transparent;
   }
   input::-webkit-input-placeholder{
        color:#c3c3c3;
        opacity:1;
    }
    .list{
        padding:.1rem .2rem;
    }
    .list img{
        width:.8rem;
        margin:0 .2rem;
    }
    .list>div{
         width:calc(100% - 1.2rem);
        flex-grow: 1;
    }
    .list>div h2{
        width:100%;
        /* word-wrap: wrap; */
        font-size:.26rem;
        color:#333333;
        font-weight: normal;
    }
    .list>div h2 span:nth-of-type(1){
        width:60%;
        word-break: break-all;
    }
    .list>div div{
        margin-top:.2rem;
    }
    .list div p{
        font-size:.22rem;
        color:#c3c3c3;
        margin-bottom: 0;
    }
    .footer{
        background:rgb(255,255,255);
        color:#3499db;
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
        /* margin-right: .2rem; */
    }

    .radio:checked {
        background-image: url('../../assets/images/cheak_on.png');
        background-size: cover;
    }
     .content{
        width: 100vw;
        height: 100vh;
        position:fixed;
        top:0;
        background:rgba(0,0,0,0.2);
    }
    .content ul{
        position:absolute;
        background: rgb(255,255,255);
        width:2rem;
        left:.1rem;
        /* line-height: 1.8; */
        border-radius: .1rem;
        right:.1rem;
        top:1.5rem;
        padding:0 .2rem;
    }
    .content ul li{
        width:100%;
        height:.7rem;
        text-align: center;
        line-height: .7rem;
        border-bottom: solid 1px rgb(220,220,220);
    }
    .content ul li:nth-last-child(1){
        border-bottom: none;
    }
    .content p{
        width:0;
        height: 0;
        border-left:.15rem solid transparent;
        border-right:.15rem solid transparent;
        border-bottom: .15rem solid #ffffff;
        position: absolute;
        left:.3rem;
        top:1.4rem;
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter,
    .slide-leave-active {
        transform: translateY(100%);
        opacity: 0;
    }

    .modelDiv {
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        z-index: 100;
    }

    .modelCont {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4rem;
        background: white;
    }

    .modelHead {
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.2rem;
        border-bottom: solid 1px #c3c3c3;
        margin: 0;
    }

    .modelHead a:nth-last-of-type(1) {
        color: #3499db;
    }

    .modelCont ol {
        width: 100%;
        height: 3.2rem;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1.3rem;
    }

    .modelCont ol li {
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        color: #c3c3c3;
    }

    .center {
        border-top: solid 1px #c3c3c3;
        border-bottom: solid 1px #c3c3c3;
        width: calc(100% - 0.4rem);
        height: 0.6rem;
        position: absolute;
        z-index: 5000;
        bottom: 1.3rem;
        margin: 0 0.2rem;
    }

     ::-webkit-scrollbar {
        display: none;
    }
    /*.slide-enter-active,.slide-leave-active{
        transition: all .5s ease;
    }
    .slide-enter,.slide-leave-active{
        transform: translateY(-100%);
        opacity: 0;
    }*/
    .active{
        color: black!important;
    }
    .iframe{
        position:absolute;
        top:0;
        left:0;
        width:100vw;
        height: 100vh;
        z-index:1000;
    }
    .iframe iframe{
        width:100%;
        height:100%;
    }
    .pictureAlert{
        position:absolute;
        /* top:30%; */
        width:100vw;
        height:100vh;
        overflow:auto;
        text-align:center;
        background:rgba(0,0,0,1);
    }
    .pictureAlert img{
        /* width:100%; */
        height:80vh;
        margin-top:10vh;  
        /* height:50%; */
    }
    .videoAlert{
        position:absolute;
        width:100vw;
        height:100vh;
        background:rgba(0,0,0,1);
        overflow: hidden;
    }
     .videoAlert video{
          width:100%;  
         /* height:50%;  */
    } 
    .audioAlert{
        position:absolute;
        width:100vw;
        height:100vh;
        background:rgb(238,238,238);
    }
    .audioAlert img{
        width:100%;
    }
    .audioAlert audio{
        width:100%;
        /* margin-top:40%; */
    }
    /* video::-webkit-media-controls {
        display:none !important;
    } */
    video::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    video::-webkit-media-controls-panel {
        width: calc(100% + 30px);
    }
    audio::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    audio::-webkit-media-controls-panel {
        width: calc(100% + 30px);
    }
</style>