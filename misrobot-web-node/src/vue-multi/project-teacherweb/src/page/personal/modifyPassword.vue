<template>
<div>
    <div class="modify-pass-body">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm2.oldPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
            </el-form-item>
          
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
       data() {
      var checkAge = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          if (this.ruleForm2.oldPass !== '') {
            this.$refs.ruleForm2.validateField('pass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if(value.length<6){
            callback(new Error('新密码至少需要6位'));
        }else if(value==this.ruleForm2.oldPass){
            callback(new Error('新密码不能和旧密码相同'));
        }
        else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldPass: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            post('/usr/changepassword',{
                "command":"usr/changepassword",
                "sessionid":getCookie('sid'),
                "uid":getCookie('uid'),
                loginid:getCookie('uid'),
                oldpassword:this.ruleForm2.oldPass,
                "newpassword":this.ruleForm2.pass
            }).done((data)=>{
                if(data&&data.errcode==0){
                    this.$message({
                        type:'success',
                        message:'更新密码成功'
                    });
                    this.resetForm('ruleForm2');
                }else if(data.errcode==1){
                    this.$message.error('旧密码错误')
                }
                else{
                    this.$message.error('修改密码失败')
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
    }

</script>
<style >
  @import "../../assets/css/common.css";
  .modify-pass-body{
    width:500px;
    margin:30px auto;
  }
</style>
