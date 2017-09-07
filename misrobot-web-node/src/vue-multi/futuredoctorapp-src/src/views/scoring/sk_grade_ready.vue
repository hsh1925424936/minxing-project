<template>
    <div>
        <ul class="grade_wait_ul" v-for='item in lists'>
            <li><span>课程名称：</span><span>{{item.coursename}}</span></li>
            <li><span>技&nbsp;能&nbsp;项&ensp;：</span><span>{{item.learnname}}</span></li>
            <li><span>上课时间：</span><span>{{item.starttime}}</span></li>
            <li><span>上课教室：</span><span>{{item.place}}</span></li>
            <li class="reportCard">
                <a @click='queryGrade(item)'>成绩单</a>
            </li>
        </ul>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import methods from '../../methods';
    import moment from 'moment';
    import noContent from '../no_content';
    export default {
        name:'sk_grade_ready',
        components:{
            noContent,
        },
        data () {
            return {
                lists:[
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2017-4-25 18:00','place':'1206病房'},
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2017-4-27 18:00','place':'1206病房'},
                    // {'coursename':'临床诊断学','learnname':'医患沟通','starttime':'2017-4-26 18:00','place':'1206病房'},
                ],
                noContent:true
            }
        },
        methods:{
            ...methods,
            queryGrade:function(item){
                this.$router.push({
                    name:"fdscore_statistics",
                    query:item
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
        mounted(){
            var self = this
            self.post('/score/listscore', {
                command: 'score/listscore',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                teacherid:$.cookie('uid'),
                status:2
            }).done(function (data) {
                self.lists = self.sort(data.scorelist)
                console.log(data)
                self.noContent = false
                if(self.lists.length == 0){
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
        padding: 0.3rem  0.2rem 0;
        margin-bottom: 0.2rem;
        background: white;
        position: relative;
    }
    .grade_wait_ul li{
        margin-bottom: 0.2rem;
    }
    .reportCard{
        margin: 0!important;
        height: 1rem;
        border-top: solid 1px #c3c3c3;
        position: relative;
    }
    .reportCard a{
        display: inline-block;
        width: 1.5rem;
        height: 0.6rem;
        border-radius: 0.1rem;
        text-align: center;
        line-height: 0.6rem;
        border: solid 1px #c3c3c3;
        position: absolute;
        right: 0;
        top: 0.2rem;
    }
    .grade_wait_ul li span:nth-child(1){
        display: inline-block;
        width: 1.5rem;
    }
</style>