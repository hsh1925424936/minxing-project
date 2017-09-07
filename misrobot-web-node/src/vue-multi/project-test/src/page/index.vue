<template>
  <div class="root">
    <div class="nav flex">
      <div class="navLeft">
        <span>建智慧医教 为明日良医</span>
      </div>
      <div class="navRight flex">
        <img src="../assets/images/user.png" alt="">
        <span>{{userName}}</span>
        <el-button type="primary" @click="logout" style='border-color: white;background:rgb(0,160,233);'>退出</el-button>
      </div>
    </div>
    <div class="main flex">
      <div class="mainLeft flex-column">
        <img src="../assets/images/logo.png" alt="">
        <ul>
          <li v-for="item in menus">{{item}}</li>
        </ul>
      </div>
      <div class="mainRight">
        <div class="cont">
          <div class="header flex">
            <el-input placeholder="请输入药物名称" v-model="searchName" class="search">
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
            <el-button type="primary" @click="add">新增</el-button>
          </div>
          <div class="list">
            <span class="medicineName" v-for="(item,index) in levellist" @click="select(index)" :class="active(index)">{{item.name}}</span>
          </div>
          <div class="subject" v-for="item in medicine">
            <h2>{{item.subjectname}}</h2>
            <div v-for="v in item.items">
              <ul class="subjectUl">
                <li>
                  <img src="../assets/images/logo.png" alt="">
                </li>
                <li>
                  <h3 @click="detail(v.id)">{{v.name}}</h3>
                  <p>
                    <span>药用部位：{{v.parts}}</span>
                    <span>产地：{{v.origin}}</span>
                  </p>
                  <p>
                    <span>功效：{{v.effect}}</span>
                  </p>
                </li>
                <li>
                  <span>最新修改时间</span>
                  <span style="text-align:center;margin-top:1rem;">{{v.update_at}}</span>
                </li>
                <li>
                  <span>修改人</span>
                  <span style="text-align:center;margin-top:1rem;">{{v.updater}}</span>
                </li>
                <li>
                  <span>操作</span>
                  <p style="display:flex;justify-content:center;margin-top:1rem;">
                    <el-button type="primary" size="small" @click="edit(v.id)">编辑</el-button>
                    <el-button @click='deleteItem(v.id)' size="small">删除</el-button>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogVisibleAdd" size="small" :before-close="handleCloseAdd">
      <h2 style="text-align:center;color:rgb(0,160,230);margin-top:-30px;font-weight:590;">新增</h2>
      <div class="message addCont">
        <h3>基本信息</h3>
		<el-form :model="addMedicine" :rules="rules" ref="addMedicine" label-width="100px">
			<el-form-item label="药品名称" prop="addName">
				<el-input v-model="addMedicine.addName" style="width:300px;"></el-input>
				<span>2-16字</span>
			</el-form-item>
			<el-form-item label="科目分类" prop="addSelect">
				 <el-select v-model="addMedicine.addSelect" placeholder="请选择" class="select">
					<el-option v-for="item in levellist" :key="item.name" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产地" prop="addOrigin">
				<el-input class="input" v-model="addMedicine.addOrigin" style="width:300px;"></el-input>
				<span>2-16字</span>
			</el-form-item>
			<el-form-item label="药用部位" prop="addParts">
				<el-input class="input" v-model="addMedicine.addParts" style="width:300px;"></el-input>
				<span>2-16字</span>
			</el-form-item>
			<el-form-item label="功效" prop="addEffect">
				<el-input type="textarea" class="textarea" v-model="addMedicine.addEffect"></el-input>
				<span>8-30字</span>
			</el-form-item>
			<el-form-item label="主治" prop="addTreatment">
				<el-input type="textarea" class="textarea" v-model="addMedicine.addTreatment"></el-input>
				<span>8-30字</span>
			</el-form-item>
			<el-form-item label="性味与归经" prop="addTropism">
				<el-input type="textarea" class="textarea" v-model="addMedicine.addTropism"></el-input>
				<span>8-30字</span>
			</el-form-item>
		</el-form>
      </div>
      <div class="upload addCont">
        <h3>图片上传</h3>
       <el-upload
			class="avatar-uploader"
			action="/file/upload"
			:show-file-list="false"
			:on-success="handleAvatarSuccess"
			:on-remove="handleRemove"
			:before-upload="beforeAvatarUpload"
			:file-list="fileList"
			list-type="picture">
			<img v-if="imageUrl" :src="imageUrl" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleAdd = false">取 消</el-button>
				<el-button type="primary" @click="save('addMedicine')">保存</el-button>
			</span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisibleDetail" size="small" :before-close="handleCloseDetail">
      <div>
        <h2>{{details.name}}</h2>
        <p>
          <span>药用部位：{{details.parts}}</span>
          <span>产地：{{details.origin}}</span>
        </p>
        <p>
          <span>功效：{{details.effect}}</span>
        </p>
        <p>
          <span>主治：{{details.treatment}}</span>
        </p>
        <p>
          <span>性味与归经：{{details.tropism}}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisibleDetail = false">编辑</el-button>
				<el-button @click="dialogVisibleDetail = false">删除</el-button>

			</span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getCookie,
    removeCookie,
    post,
    getStorage,
    setStorage,
    removeStorage
  } from '../config/util'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import $ from 'jquery'
  export default {
    name: 'index',
    data() {
	var validateNameBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入药品名称！'));
			}else{
				callback()
		}
	  };
	  var validateSelectBlank = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择科目分类！'));
			}else{
				callback()
		}
	  };
	  var validateOriginBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入产地！'));
			}else{
				callback()
		}
	  };
	  var validatePartsBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入药用部位！'));
			}else{
				callback()
		}
	  };
	  var validateEffectBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入功效内容！'));
			}else{
				callback()
		}
	  };
	  var validateTreatmentBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入主治内容！'));
			}else{
				callback()
		}
	  };
	   var validateTropismBlank = (rule, value, callback) => {
			if (value === '' || value.trim() === '') {
				callback(new Error('请输入主治内容！'));
			}else{
				callback()
		}
	  };
      return {
        userName: getCookie('name'),
        menus: ['中药鉴别'],
        levellist: [],
        searchName: '',
        subjectId: '',
        dialogVisibleAdd: false,
        dialogVisibleDetail: false,
        medicine: [],
        dialogImageUrl: '',
        dialogVisible: false,
        details: {},
		imageUrl: '',
		fileList:[],
		addMedicine:{
			addOrigin:'',
			addName:'',
			addSelect: '',
			addTropism:'',
			addParts:'',
			addEffect:'',
			addTreatment:''
		},
		rules:{
			addName:[
				{ required: true,validator: validateNameBlank, trigger: 'blur' },
				{min:2,message:'字数必须大于2',trigger:'blur'},
				{max:16,message:'字数必须小于16',trigger:'blur'},
			],
			addSelect:[
				{ required: true,validator: validateSelectBlank, trigger: 'blur' },
			],
			addOrigin:[
				{ required: true,validator: validateOriginBlank, trigger: 'blur' },
				{min:2,message:'字数必须大于2',trigger:'blur'},
				{max:16,message:'字数必须小于16',trigger:'blur'},
			],
			addParts:[
				{ required: true,validator: validatePartsBlank, trigger: 'blur' },
				{min:2,message:'字数必须大于2',trigger:'blur'},
				{max:16,message:'字数必须小于16',trigger:'blur'},
			],
			addEffect:[
				{ required: true,validator: validateEffectBlank, trigger: 'blur' },
				{min:8,message:'字数必须大于8',trigger:'blur'},
				{max:30,message:'字数必须小于30',trigger:'blur'},
			],
			addTreatment:[
				{ required: true,validator: validateTreatmentBlank, trigger: 'blur' },
				{min:8,message:'字数必须大于8',trigger:'blur'},
				{max:30,message:'字数必须小于30',trigger:'blur'},
			],
			addTropism:[
				{ required: true,validator: validateTropismBlank, trigger: 'blur' },
				{min:8,message:'字数必须大于8',trigger:'blur'},
				{max:30,message:'字数必须小于30',trigger:'blur'},
			],
		}
      }
    },
    mounted() {
      // this.$nextTick(function(){
      // $($('.medicineName')[0]).addClass('active')
      // })
      this.queryMedicineList()
      this.queryLevel()
    },
    methods: {
      handleCloseAdd() {
        this.dialogVisibleAdd = false
      },
      handleCloseDetail() {
        this.dialogVisibleDetail = false
      },
      // 退出
      logout() {
        removeCookie("uid");
        removeCookie("sid");
        removeCookie("name");
        this.$router.push({
          name: 'Login'
        });
      },
      // 搜索
      search() {
        this.queryMedicineList()
      },
      // 查询药物列表
      queryMedicineList() {
        let self = this;
        post('/medicine/list', {
          command: 'medicine/list',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          name: self.searchName,
          subject: self.subjectId
        }).done((data) => {
          if (data && data.errcode == 0) {
            let arr = []
            let list = []
            for (let i = 0; i < data.medicinelist.length; i++) {
              arr.push(data.medicinelist[i].subjectname)
            }
            for (let i = 0; i < self.unique(arr).length; i++) {
              list.push({
                'subjectname': self.unique(arr)[i],
                items: []
              })
            }
            for (let s in self.unique(arr)) {
              for (let i = 0; i < data.medicinelist.length; i++) {
                if (self.unique(arr)[s] == data.medicinelist[i].subjectname) {
                  list[s].items.push({
                    'effect': data.medicinelist[i].effect,
                    'id': data.medicinelist[i].id,
                    'name': data.medicinelist[i].name,
                    'origin': data.medicinelist[i].origin,
                    'parts': data.medicinelist[i].parts,
                    'subject': data.medicinelist[i].subject,
                    'subjectname': data.medicinelist[i].subjectname,
                    'typical': data.medicinelist[i].typical,
                    'update_at': data.medicinelist[i].update_at,
                    'updater': data.medicinelist[i].updater
                  })
                }
              }
            }
            self.medicine = list
          }
          console.log(self.medicine)
        })
      },
      // 获取药物列表
      queryLevel() {
        let self = this;
        post('/hr/querylevellist', {
          command: 'hr/querylevellist',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          code: 'medicine'
        }).done(function (data) {
          if (data && data.errcode == 0) {
            self.levellist = data.levellist;
            //console.log(list)
            self.subjectId = self.levellist[0].id

          }
        })
      },
      select(index) {
        $('.medicineName').removeClass('active')
        $($('.medicineName')[index]).addClass('active')
        this.subjectId = this.levellist[index].id
        this.queryMedicineList()
        // alert(this.subjectId)
      },
      active(index) {
        return {
          'active': index == 0
        }
      },
      add() {
        this.dialogVisibleAdd = true

      },
	  save(addMedicine){
		  let self = this
		// alert(self.addMedicine.addSelect)
		alert(self.addMedicine.tropism)
		this.$refs[addMedicine].validate((valid)=>{
			if(valid){
				this.addMed()
			}
		})
	  },
	  addMed(){
		let self = this
		post('/medicine/add',{
			command:'medicine/add',
			sessionid: getCookie('sid'),
          	loginid: getCookie('uid'),
			name:self.addMedicine.addName,
			subject:self.addMedicine.addSelect,
			origin:self.addMedicine.addOrigin,
			parts:self.addMedicine.addParts,
			effect:self.addMedicine.addEffect,
			treatment:self.addMedicine.addTreatment,
			tropism:self.addMedicine.addTropism,
			typical:'typical',
			real:'real',
			micro:'micro',
			fakes:[
				{fake:'fake',name:'孙大龙'}
			]
		}).done(function(data){
			if(data && data.errcode == 0){
				self.dialogVisibleAdd = false
				self.$message({
					type:'success',
					message:'新增成功了'
				})
			}else{
				self.$message({
					type:'error',
					message:data.errdesc
				})
			}

		})
	  },
      detail(id) {
        this.dialogVisibleDetail = true
        let self = this
        post('/medicine/detail', {
          command: 'medicine/detail',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          id: id
        }).done(function (data) {
          // alert('sccess')
          if (data && data.errcode == 0) {
            self.details = {
              effect: data.effect,
              fakes: data.fakes,
              id: data.id,
              micro: data.micro,
              name: data.name,
              origin: data.origin,
              parts: data.parts,
              real: data.real,
              treatment: data.treatment,
              tropism: data.tropism,
              typical: data.typical
            }
          }
        })
      },
      deleteItem(id) {
        let self = this
        this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
			 post('/medicine/delete', {
				command: 'medicine/delete',
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
				id: id
				}).done(function (data) {
				if (data && data.errcode == 0) {
					this.queryMedicineList()
					 this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}
			})

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 去重
      unique: function (arr) {
        let res = [];
        let json = {};
        for (var i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res;
      },
     handleAvatarSuccess(res,file) {
		//  console.log(res)
		console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
	  handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      }
    }
  }

</script>
<style scoped>
  .root {
    width: 100vw;
    height: 100vh;
	overflow:hidden;
  }

  .nav {
    width: 100%;
    background: rgb(0, 160, 233);
    color: white;
    height: 4rem;
    padding: 0 2rem;
    font-size: 1.3rem;
    box-sizing: border-box;
  }

  .navRight {
    width: 12rem;
  }
  .navRight span{
	  position:relative;
	  right:1.5rem;
	  bottom: 0.1rem;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /*.flex-column{
		display:flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items:flex-start;
	}*/

  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    /*justify-content: center;*/
  }

  .main {
    width: 100%;
    height: calc(100% - 4rem);
  }

  .mainLeft {
    width: 12%;
    height: 100%;
    /*border:solid 1px red;*/
    background: rgb(11, 36, 48);
  }

  .mainLeft>img {
    width: 5rem;
    margin: 1.5rem;
  }

  .mainLeft ul {
    width: 100%;
  }

  .mainLeft ul li {
    width: 100%;
    background: rgb(34, 52, 60);
    color: rgb(0, 160, 233);
    text-align: center;
    padding: 0.5rem 0;
    font-size: 1rem;
    cursor: pointer;
  }

  .mainRight {
    width: 88%;
    height: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
	overflow-x:hidden;
  }

  .cont {
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255);
    padding: 1.5rem 0;
    box-sizing: border-box;
	overflow:auto;
  }

  .header {
    width: 100%;
    padding: 0 1.5rem;
    box-sizing: border-box;
  }

  .search {
    width: 20rem;
    /*border:solid 1px #3499db;*/
    /*border-radius: 5px;*/
  }

  .medicineName {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    margin: 1rem 1.5rem 0;
    /*font-weight: 350;*/
    font-size: 0.9rem;
    /*border:solid 1px red;*/
    cursor: pointer;
  }

  .active {
    background: rgb(0, 160, 233);
    color: white;
    border-radius: 0.2rem;
  }

  /*.message {
    width: 100%;
  }

  .message p,
  h3 {
    width: 100%;
    margin-bottom: 1rem;
  }

  .textareaP {
    display: flex;
    justify-content: flex-start;
  }

  .message p label {
    width: 12%;
  }*/

  .message p .input {
    width: 40%;
  }

  .textarea {
    width: 80%;
  }

  .select {
    width: 24%;
  }

  .subject h2 {
    margin-top: 1rem;
  }

  .subjectUl {
	width:calc(100% - 6rem);
	height:6rem;
    margin: 0 3rem;
    /*padding: 1rem 0;*/
    border-bottom: solid 1px rgb(230, 230, 230);
	box-sizing:border-box;
	display: flex;
  }
  .subjectUl li:nth-child(1){
	  width:12%;
	  display:flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items:center;
  }
  .subjectUl li:nth-child(2){
	  width:50%;
	  font-size:0.8rem;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
  }
  .subjectUl li:nth-child(2) p:nth-child(2){
	  margin:0.5rem 0;
  }
   .subjectUl li:nth-child(2) h3{
	  font-size:1rem;
	  /*margin-bottom:0.5rem!important;*/
  }
  .subjectUl li:nth-child(3){
	  width:10%;
	  display:flex;
	  flex-direction: column;
	  align-items:center;
	  padding-top:0.8rem;
  }

  .subjectUl li:nth-child(4){
	  width:10%;
	  display:flex;
	  flex-direction: column;
	  align-items:center;
	  padding-top:0.8rem;
  }
  .subjectUl li:nth-child(5){
	  width:18%;
	  display:flex;
	  flex-direction: column;
	  align-items:center;
	  padding-top:0.8rem;
  }
  .subjectUl li img {
    width: 6rem;
    height: 4rem;
    /*border:solid 1px rgb(230,230,230);*/
    /*padding:1rem;*/
  }
  .subjectUl li h3{
	  font-size:1rem;
	  font-weight: normal;
	  cursor:pointer;
  }
  .subjectUl li {
    display: flex;
    flex-direction: column;
	font-size:1rem;
	color: gray;
    /*justify-content: center;*/
    /*align-items: center;*/
    /*align-content: center;*/
  }
  .subject h2{
	  color:rgb(0, 160, 233);
	  /*margin-left:-20px;*/
	  font-weight: normal;
	  font-size:1rem;
  }
  .subject h2::before{
	  content:'';
	  border:solid 3px rgb(0,160,230);
	  margin-right:10px;
  }
  .addCont h3{
	color:rgb(0, 160, 233);
	margin-left:-20px;
	font-weight: normal;
  }
  .addCont h3::before{
	  content:'';
	  border:solid 3px rgb(0,160,230);
	  margin-right:10px;
  }
  .avatar-uploader{
	width:178px;
	height:178px;
    border: 1px dashed black;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
	background:rgb(243,248,252);
  }
  /*.el-upload{
	border: 1px dashed black;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }*/
  .avatar-uploader:hover {
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
</style>
