<template>
<div>
    <div class = "user-logo">
        <el-upload
          class="avatar-uploader"
          action="/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>点击上传头像</span>
    </div>
    <div class ="info-detail" >
        <span class = "first">姓名:</span><span class = "next">{{userinfo.name}}</span>
        <span class = "first">性别:</span><span class = "next">{{userinfo.sex==0?'男':'女'}}</span>
        <span class = "first">工号:</span><span class = "next">{{userinfo.staffid}}</span>
        <span class = "first">部门:</span><span class = "next">{{userinfo.department}}</span>
        <span class = "first">角色:</span><span class = "next">{{userinfo.role}}</span>
        <span class = "first">职称:</span><span class = "next">{{userinfo.levelname}}</span>
        <span class = "first">证件号码:</span><span class = "next">{{userinfo.cardnum}}</span>
        <span class = "first">手机号:</span><span class = "next">{{userinfo.mobile}}</span>
        <span class = "first">一卡通号:</span><span class = "next">{{userinfo.cardno}}</span>
        <span class = "first">邮箱:</span><span class = "next">{{userinfo.email}}</span>
    </div>
</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {
                imageUrl:'',
                userinfo:{},
            }
        },
        components: {},
        created() {
        },
        mounted () {
          this.getUserInfo();
        },

        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                post('/user/uploaduserphoto',{
                  "command": "user/uploaduserphoto",
                  "sessionid": getCookie('sid'),
                  "loginid": getCookie('uid'),
                  "uid": getCookie('uid'),
                  "photourl": res.data.uri
                }).done(data=>{
                  if(data&&data.errcode==0){
                    this.$message({
                      type:'success',
                      message:'修改头像成功'
                    });
                   this.$bus.$emit('updateHeadImg')
                  }
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                  this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            getUserInfo(){
              let self = this;
              post('/teachingstaff/queryteacherinfo',{
                command:'teachingstaff/queryteacherinfo',
                loginid:getCookie('uid'),
                sessionid:getCookie('sid'),
                uid:getCookie('uid')
              }).done(data=>{
                if(data&&data.errcode==0){
                  self.userinfo = data;
                }
              })
            }
        }
    }

</script>
<style >
  @import "../../assets/css/common.css";
  .user-logo{
    margin:30px;
    float:left;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .info-detail{
    float:left;
    width:700px;
  }
  .first{
    width:80px;
    height:30px;
    line-height: 30px;
    text-align: right;
    margin:15px;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
  }
  .next{
    width:200px;
    height:30px;
    line-height: 30px;
    text-align: left;
    margin:15px;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
  }
</style>
