<template>
<div class = "noti-root">
    <div class = "noti-top">
        <el-checkbox v-model="pickAll" @change = "checkAll">全选</el-checkbox>
        <div>
        <el-button type = "text" @click = "signRead">标为已读</el-button>
        <el-button type = "text" @click = "signAll">全部标为已读</el-button>
       <!--  <el-button type = "text">删除</el-button> -->
        </div>
    </div>
    <div class = "noti-item" v-for =  "item in notificationList" >
        <div class = "noti-item-top">
            <div>
                <el-checkbox v-model="item.checked" ></el-checkbox>
                <el-badge  style="margin-left:10px" is-dot :hidden="item.status" class="item"><span @click="showDetail(item)">{{item.title}}</span></el-badge>
            </div>
            <span style="color:#8590a6;">{{item.departtime}}</span>
        </div>
        <div class = "noti-item-down"  @click="showDetail(item)">
        {{item.content}}
        </div>
    </div>
    <el-pagination style="float:right;margin:10px 10px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
    </el-pagination>
</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {
                pickAll:false,
                pagenum:1,
                pagesize:10,
                totalCount:0,
                notificationList:[]
            }
        },
        computed:{
            checkedIds(){
                return this.notificationList.filter(item=>{
                    if(item.checked)
                    return item
                }).map(it=>{
                    return it.id
                })
            },
            allNewIds(){
                return this.notificationList.filter(item=>{
                        if(item.status!=1)
                        return item
                }).map(it=>{
                        return it.id
                    })
                }
        },
        components: {},
        created() {
        },
        mounted () {
            this.getAnnounceList();
        },

        methods: {
            getAnnounceList(){
                let self = this;
                post('/announce/queryannouncelist',{
                    "command":"announce/queryannouncelist",
                    "sessionid":getCookie('sid'),
                    "loginid":getCookie('uid'),
                    "uid":getCookie('uid'),
                    "page":this.pagenum,
                    "reqnum":this.pagesize

                }).done(data=>{
                    console.log(data)
                    self.notificationList = data.announcelist.map(item=>{
                        item.checked =false;
                        return item;
                    });
                    self.totalCount = data.allcount;
                })
            },
            handleSizeChange(size){
                this.pagesize = size;
                this.getAnnounceList();
            },
            handleCurrentChange(page){
                this.pagenum = page;
                this.getAnnounceList();
            },
            checkAll(){
                console.log(this.pickAll)
                if(this.pickAll){
                   this.notificationList.forEach((item,index)=>{
                        item.checked = true;
                    })
                }else{
                    this.notificationList.forEach((item,index)=>{
                        item.checked = false;
                    })
                }

            },
            showDetail(item){
                console.log(item)
                item.content = item.content||'';
                //if(item.content){
                    this.$alert(item.content, item.title, {
                      confirmButtonText: '确定',
                      callback: action => {
                        item.status=1;
                      }
                    });
               /* }else{

                    this.$alert('请去手机端查看', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {

                      }
                    });
                }*/
            },
            signRead(){
                console.log(this.checkedIds)
                post('/announce/markread',{
                    command:'announce/markread',
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    uid:getCookie('uid'),
                    ids:this.checkedIds
                }).done(data=>{
                    if(data&&data.errcode==0){
                        this.getAnnounceList();
                    }
                })
            },
            signAll(){
                post('/announce/markread',{
                    command:'announce/markread',
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    uid:getCookie('uid'),
                    ids:this.allNewIds
                }).done(data=>{
                    if(data&&data.errcode==0){
                        this.getAnnounceList();
                    }
                })
            }


        }
    }

</script>
<style >
  @import "../../assets/css/common.css";
  .noti-root{
    padding:30px 30px 50px 30px;
  }
  .noti-top{
    display: flex;
    justify-content: space-between;
    height:50px;
    border-bottom:1px solid #e1eaf1;
  }
  .noti-item{
    height:70px;
    border-bottom:1px solid #e1eaf1;
  }
  .noti-item-top{
    margin:8px 0;
    display: flex;
    justify-content: space-between;
  }
  .noti-item-down{
    color:#8590a6;
    margin-left:25px;
  }
</style>
