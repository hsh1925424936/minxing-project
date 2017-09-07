<template>
    <div class ="share-item">
        <img src='' class ="logo"/>
        <span class = "file-name">{{shareItem.name+shareItem.suffix}}</span>
        <el-tag type="primary">{{shareItem.expire==0?'未过期':'已过期'}}</el-tag>
        <span class = "start-time">{{shareItem.starttime}}</span>
        <span class = "end-time">{{shareItem.endtime==''?'长期有效':shareItem.endtime}}</span>
        <el-button type = "primary" @click ="shareAction(shareItem)">{{shareItem.status==1||shareItem.expire==1?'重新共享':'停止共享'}}</el-button>
    </div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {}
        },
        props:{
            shareItem:{
                type:Object,
                default:function(){
                    return {}
                }
            }
        },
        components: {},
        created() {
        },
        mounted () {

        },

        methods: {

            shareAction(item){
                if(item.status==1||item.expire==1){
                    this.$emit('reShare',item);
                }else{
                    this.$confirm('是否确认停止共享?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      post('/courseware/operatesharefiles',{
                            command:'courseware/operatesharefiles',
                            sessionid:getCookie('sid'),
                            loginid:getCookie('uid'),
                            shareids:item.shareids,
                            status:1
                        }).done((data)=>{
                            if(data&&data.errcode ==0){
                                this.$message({
                                    type:'success',
                                    message:'已停止共享'
                                })
                                this.shareItem.status = 1;
                                this.shareItem.expire=1;
                            }else{
                                this.$message.error('停止共享失败')
                            }
                        })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消停止共享'
                      });
                    });

                }

            }
        }
    }

</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
  .share-item{
    margin:10px 0px;
    padding:10px;
    display:flex;
    justify-content:space-between;
    border:1px solid #e1eaf1;
  }
  .share-item:hover{
    background:#eef1f6;
  }
  .file-name{
    display:block;
    width:200px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .end-time{
    width:140px;
  }
  .start-time::after{
    content:'分享日期';
    display:block;
    position:relative;
    top:8px;
    left:30px;
    color:#8590a6
  }
  .end-time::after{
    content:'截止日期';

    display:block;
    position:relative;
    top:8px;
    left:30px;
    color:#8590a6
  }
</style>
