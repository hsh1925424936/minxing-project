<template>
    <div>
        <ul class="qdetaillist">
            <li>
                <span class="xlabel">题目名称：</span>
                <div class="xcontent">{{name}}</div>
            </li>
            <li v-show="picturelist">
                <span class="xlabel">附件：</span>
                <div class="xcontent">
                    <a target="_blank" :href="value.filepath" v-if="ispicture(value.attrvalue)"
                        class="preview" v-for="(value,index) in picturelist">
                        <img :src="value.filepath"/>
                    </a>
                    <span v-if="!ispicture(value.attrvalue)" v-for="(value,index) in picturelist"
                        @click="showMyFile(value.filepath)" style="cursor:pointer;">
                        {{getfilename(value.attrvalue)}}
                    </span>
                </div>
            </li>
            <li>
                <span class="xlabel">题目描述：</span>
                <div class="xcontent">{{comment}}</div>
            </li>
            <li>
                <span class="xlabel">训练项：</span>
                <div class="xcontent">{{learnname}}</div>
            </li>
            <li>
                <span class="xlabel">所属类别：</span>
                <div class="xcontent">{{categoryname}}</div>
            </li>
            <li>
                <span class="xlabel">标签：</span>
                <div class="xcontent">
                    <el-tag type="gray" v-for="value in lablist" class="mr10">{{value.name}}</el-tag>
                </div>
            </li>
            <li>
                <span class="xlabel">难度：</span>
                <div class="xcontent">
                    <el-rate v-model="difficult" disabled></el-rate>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import methods from '../../assets/js/methods'
    import xhttp from '../../assets/js/http'
    export default {
        data() {
            return {
                difficult:0,
                name:'',
                comment:'',
                questionitem:[],
                lablist:[],
                picturelist:[],
                categoryname:'',
                learnname:''
            }
        },
        props:['questionid','isshowfile','showfile'],
        components: {},
        mounted () {
            this.queryqdetail()
        },
        watch:{
            'questionid'(){
                this.queryqdetail()
            }
        },
        methods: {
            showMyFile(url){
                this.$emit('update:isshowfile', true);
                this.$emit('update:showfile', url);
            },
            getfilename(url){
                var arr = url.split("/");
                return arr[arr.length-1];
            },
            ispicture(name){//判断是否图片
                var arr = name.split(".");
                var format = arr[arr.length-1];
                if(format=='png' || format=='PNG' || format=='bmp' || format=='BMP' || format=='gif' || format=='GIF' || format=='jpg' || format=='JPG' || format=='jpeg' || format=='JPEG'){
                  return true;
                }else{
                  return false;
                }
            },
            queryqdetail(){
                var self=this
                var data={
                    command:'question/queryoprquestion',
                    sessionid: $.cookie('sid'),
                    loginid:$.cookie('uid'),
                    questionbaseid:this.questionid
                }
                function callback(res){
                    self.name=res.name
                    self.comment=res.comment
                    self.learnname=res.learnname
                    self.questionitem=res.questionitem
                    self.lablist=res.lablist
                    self.picturelist=res.picturelist
                    self.difficult=res.difficult
                    self.categoryname=res.categoryname
                }
                xhttp.post('/question/queryoprquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../assets/css/common.css";
    .xcontent .preview{
        height:50px; margin-right:10px; width:50px;
    }
    .xcontent .preview img{
        height:100%; width:100%;
    }
</style>
