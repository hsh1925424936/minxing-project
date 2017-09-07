<template>
    <div>
        <div class ="left-menu">
            <ul>
                <li :class = "{'li-focus':currentReport=='inclass'}" @click="currentReport='inclass'">课堂报告</li>
                <li :class = "{'li-focus':currentReport=='exam'}" @click="currentReport='exam'">考试报告</li>
                <li :class = "{'li-focus':currentReport=='grade'}" @click="currentReport='grade'">学生成绩</li>
            </ul>
        </div>
        <div class = "right-container">
            <in-class-report v-show =" currentReport =='inclass'"></in-class-report>
            <exam-report v-show =" currentReport =='exam'"></exam-report>
            <grade-report v-show =" currentReport =='grade'"></grade-report>
        </div>
    </div>
</template>

<script>
import inClassReport from './inClassReport'
import examReport from './examReport'
import gradeReport from './gradeReport'
    export default {
        data() {
            return {
                currentReport:'inclass',
            }
        },
        components: {
            inClassReport,
            examReport,
            gradeReport,
        },
        created() {
        },
        mounted () {

            this.$route.query.currentReport&&(this.currentReport = this.$route.query.currentReport);
        },

        methods: {}
    }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
    .left-menu{
        float:left;
        width:150px;
        height:80vh;
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
    }
    .left-menu>ul>li{
        display:block;
        width:100%;
        height:50px;
        text-align:center;
        color:#8590a6;
        margin:0 auto;
        line-height:50px;
        border-bottom:1px solid #e1eaf1;
    }
    .left-menu>ul>li:hover{
        background-color:#eef1f6;
        color:#20a0ff;
        cursor:pointer;
    }
    .li-focus{
        background-color:#20a0ff  !important;
        color:white !important;
    }
    .right-container{
        float:left;
        width:calc(100% - 180px);
        min-height:80vh;
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        margin-left:20px;
        padding:10px;
        box-sizing:border-box;
    }
</style>
