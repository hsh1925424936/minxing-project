<template>
  <div class="courseinfo">
    <h3 class="coursename">{{coursename}}</h3>
    <ul class="flex_pingjun infolist">
      <li>
        <span class="name">班级：</span>
        <span class="content" v-for="value in classinfo">{{value.name}} {{value.stunum}}人</span>
      </li>
      <li>
        <span class="name">上课总人数：</span>
        <span class="content">{{totalstu}}人</span>
      </li>
      <li>
        <span class="name">上课时间：</span>
        <span class="content">{{starttime.slice(0,16)+'~'+endtime.slice(11,16)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import methods from '../assets/js/methods'
  import xhttp from '../assets/js/http'
    export default {
        data() {
            return {
              coursename:'',
              starttime:'',
              endtime:'',
              totalstu:'',
              classinfo:[]
            }
        },
      mounted(){
        this.querycoursedetail()
      },
        methods:{
          querycoursedetail(){
            var self=this
            var data={
              command:"course/querycoursedetailinfo",
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              scheduleid:$.cookie('prescheduleid')
            }
            function callback(res){
              self.coursename=res.coursename
              self.starttime=res.starttime
              self.endtime=res.endtime
              self.classinfo=res.classinfo
              self.totalstu=res.students.length
            }
            xhttp.post('/course/querycoursedetailinfo',data,callback,xhttp.errcodefn,xhttp.errfn)
          }
        }
    }

</script>
<style lang="scss">
  .coursename{
    text-align: center;
    height:40px;
    line-height: 40px;
  }
  .courseinfo{
    border:1px solid #ccc;
  }
  .flex_pingjun{
    display:flex;
    justify-content: space-around;
  }
  .infolist{
    padding:10px 0;
  }
</style>
