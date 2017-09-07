<template>
    <div>
        <ul class="grade_wait_ul" v-for='item in list' @click='selectStu(item.id)'>
            <li><span>课程名称：</span><span>{{item.coursename}}</span></li>
            <li><span>技&nbsp;能&nbsp;项&ensp;：</span><span>{{item.learnname}}</span></li>
            <li><span>上课时间：</span><span>{{item.starttime}}</span></li>
            <li><span>上课教室：</span><span>{{item.place}}</span></li>
            <img class="grade_wait_right" src="../../assets/images/icon_xiangyou.png" alt="">
        </ul> 
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import Vue from 'vue';
     import moment from 'moment';
    import noContent from '../no_content';
    import methods from '../../methods';
    export default{
        name:'sk_grade_wait',
        components:{
            noContent
        },
        data () {
            return{
                list:[
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2月16日18：30','place':'1206病房'},
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2月17日18：30','place':'1206病房'},
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2月18日18：30','place':'1206病房'},
                ],
                total:0,
                noContent:true
            }
        },
        methods:{
            ...methods,
            selectStu:function(value){
                // location.href = '#/sk_grade/selectStu'
                this.$router.push({
                    name:"fdselectStu",
                    query:{
                        booking:value
                    }
                })
            },
             sort:function(elements){
                for(var i=0;i<elements.length-1;i++){
                    for(var j=0;j<elements.length-i-1;j++){
                        if(moment(elements[j].starttime).format('X') < moment(elements[j+1].starttime).format('X')){
                            var swap = elements[j];
                            elements[j] = elements[j+1]
                            elements[j+1] = swap 
                        }
                    }
                }
                return elements
            }
        },
        mounted() {
            var self = this
            self.post('/score/listscore', {
                command: 'score/listscore',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                teacherid: $.cookie('uid'),
                status:1
            }).done(function (data) {
				// self.list = data.scorelist
                // console.log(Date.parse(new Date(data.scorelist[0].starttime)))
                    if(data.scorelist){
                        self.list = self.sort(data.scorelist)
                        self.total = data.total
                    }   
                    // console.log(self.list)
                    self.$emit('list-length',self.total)
                    self.noContent = false
                    
                if(self.list.length == 0){
                    self.noContent = true
                }
            }).fail(function(){
                self.noContent = true
            });
        }
    }
</script>
<style scoped>
    .grade_wait_ul{
        padding: 0.3rem  0.2rem;
        margin-bottom: 0.2rem;
        background: white;
        position: relative;
    }
    .grade_wait_ul li{
        margin-bottom: 0.2rem;
    }
    .grade_wait_ul li:nth-last-of-type(1){
        margin: 0;
    }
    .grade_wait_ul li span:nth-child(1){
        display: inline-block;
        width: 1.5rem;
    }
    .grade_wait_right{
        position: absolute;
        width: 0.16rem;
        height: 0.24rem;
        right:0.2rem;
        top: calc(50% - 0.12rem);
    }
</style>