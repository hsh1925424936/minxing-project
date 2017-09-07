<template>
    <div class="rightpart">
        <div class="main">
            <header class="flex">
                <el-input placeholder="请输入病例关键名称" v-model="searchitem" class="search">
                    <el-button slot="append" icon="search" @click="searchName()"></el-button>
                </el-input>
                <el-button type="primary" @click="newcase()">新增</el-button>
            </header>
            <section>
                <div class="list">
                    <p>
                        <span class="levelname" :class="{active : i == index }" v-model="levelid" @click="firstlevel(level.id,index)" v-for=" (level,index) in levellist ">{{level.name}}</span>
                    </p>
                </div>
                <p class="nodetail" v-if="detaillist.length == 0">{{detailinfo}}</p>
                <div class="box">
                    <ul v-for="(detail,index) in detaillist" class="flex">
                        <li class="name" @click="showDetail(detail.id)">
                            <span>{{detail.original}}</span>
                            <i v-show="detail.ephedrine==1">麻黄碱</i>
                        </li>
                        <li class="detail">
                            <span>
                                <i>姓名：{{detail.name}}</i> <br>
                                <i>性别：{{detail.sex | sex}}</i>
                            </span>
                            <span>症状：{{detail.symptom}}</span>
                        </li>
                        <li>
                            <span>最新修改时间</span>
                            <span>{{detail.update_at}}</span>
                        </li>
                        <li>
                            <span>修改人</span>
                            <span>{{detail.updater}}</span>
                        </li>
                        <li>
                            <span>操作</span>
                            <div>
                                <el-button type="primary" size="small" @click="edit(detail.id)">编辑</el-button>
                                <el-button size="small" @click="deleteitem(detail.id)">删除</el-button>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
        <!--TODO 新增病例-->
        <el-dialog title="" :visible.sync="dialogVisibleAdd" size="small" :before-close="handleCloseAdd">
            <h2>
                <template v-if="newmedicine">新增病例</template>
                <template v-else>编辑病例</template>
            </h2>
            <div class="addbox">
                <el-form :model="caselist" :rules="rules" ref="caselist" label-width="100px">
                    <div class="flex">
                        <div class="leftpart">
                            <el-form-item label="病例类型" prop="type">
                                <el-select v-model="caselist.type" placeholder="请选择" class="selectbox">
                                    <el-option v-for="item in levellist" :key="item.name" :label="item.name" :value="item.id" :disabled="!newmedicine"></el-option>
                                </el-select>
                            </el-form-item>
                            <h3 class="flag">基本信息</h3>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="caselist.name" style="width:220px;"></el-input>
                                <span>2-16字</span>
                            </el-form-item>
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="caselist.sex" placeholder="请选择" class="selectbox">
                                    <el-option v-for="item in sexlist" :key="item.name" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="年龄" prop="age">
                                <el-input v-model.number="caselist.age" style="width:220px;"></el-input>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="caselist.remark" style="width:220px;"></el-input>
                            </el-form-item>
                        </div>
                        <div class="headimg flex flex-w-center flex-h-center flex-column">
                            <el-upload
                                class="avatar-uploader flex flex-h-center flex-w-center flex-column"
                                action="/file/upload"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccessHead"
                                :before-upload="beforeAvatarUploadHead">
                                <img v-if="imageUrlhead" :src="imageUrlhead" class="avatar">
                                <p v-else>
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                    <span>头像上传</span><br>
                                </p>
                            </el-upload>
                            <span>
                                上传头像有利于学生更好的理解、扮演好角色
                            </span>
                        </div>
                    </div>
                    <h3 class="flag">病况信息</h3>
                    <el-form-item label="原病名称" prop="original">
                        <el-input v-model="caselist.original" style="width:300px;"></el-input>
                        <span>2-16字</span>
                    </el-form-item>
                    <el-form-item label="症状" prop="symptom">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="caselist.symptom" style="width:300px;"></el-input>
                        <span>20字以上</span>
                    </el-form-item>
                    <el-form-item v-if="caseType == 1" label="可推荐用药" prop="drugs">
                        <el-button type="primary" @click="choice()">
                            <template v-if="medicinesure">修改</template>
                            <template v-else>添加</template>
                        </el-button>
                        <div class="medicineresult">
                            <span v-for="item in choicelist">{{item}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="处方" v-if="caseType == 2" prop="standard">
                        <el-upload
                            class="case-uploader flex flex-h-center flex-w-center flex-column"
                            action="/file/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessCase"
                            :before-upload="beforeAvatarUploadCase">
                            <img v-if="imageUrlCase" :src="imageUrlCase" class="avatar">
                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>处方上传</span><br>
                            </p>
                        </el-upload>
                        <span>
                            <template>
                                <el-radio class="radio" v-model="caselist.standard" label="0">标准处方</el-radio>
                                <el-radio class="radio" v-model="caselist.standard" label="1">错误处方</el-radio>
                            </template>
                        </span>
                    </el-form-item>
                    <el-form-item label="处方说明" v-if="caseType == 2" prop="recipenotes">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="caselist.recipenotes" style="width:300px;"></el-input>
                        <span>8-200字</span>
                    </el-form-item>
                    <el-form-item label="过往病史">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="caselist.history" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="口忌">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="caselist.avoid" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="其他注意事项">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="caselist.others" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item v-if="caseType == 3" label="诱导用药" prop="drugs">
                        <el-button type="primary" @click="choice()">
                            <template v-if="medicinesure">修改</template>
                            <template v-else>添加</template>
                        </el-button>
                        <div class="medicineresult" v-if="medicinesure">
                            <span v-for="item in choicelist">{{item}}</span>
                        </div>
                        <span style="color: #e4393c;">
                            注意：诱导用药是为了迷惑店员，考察店员是否有判断重症病的能力，对于这部分患者建议他们去医院治疗，也许能及早挽救生命。
                        </span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="flex flex-w-center">
                <el-button type="primary" @click="save()">保存</el-button>
                <el-button @click="handleCloseAdd()">取 消</el-button>
            </span>
        </el-dialog>
        <!-- TODO 选择药品dialog-->
        <el-dialog title="" :visible.sync="dialogVisibleChoice" size="tiny" :before-close="handleCloseChoice">
            <el-input placeholder="请输入药品关键名称" v-model="searchname" class="search">
                <el-button slot="append" icon="search" @click="drugdetail(searchname)"></el-button>
            </el-input>
            <div class="checklist">
                <el-checkbox-group v-model="caselist.drugs">
                    <ul>
                        <li v-for="val in drugslist">
                            <div>
                                <span>
                                    <el-checkbox :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
                                </span>
                                <span>
                                    适应症：{{val.indication}}
                                </span>
                            </div>
                        </li>
                    </ul>
                </el-checkbox-group>
            </div>
            <span slot="footer" class="flex flex-w-center">
                <el-button type="primary" @click="sure()">确定</el-button>
                <el-button @click="handleCloseChoice">取 消</el-button>
            </span>
        </el-dialog>
        <!--查看药品详情-->
        <el-dialog title="病例详情" :visible.sync="dialogVisibleDetail" :before-close="handleCloseDetail">
            <div class="detailbox">
                <h2>{{detail.type}}</h2>
                <h3 class="flag">基本信息</h3>
                <ul>
                    <li v-if="detail.head">
                        <img :src="detail.head" alt=""/>
                    </li>
                    <li>
                        <b>姓名：</b>
                        <span>{{detail.name}}</span>
                    </li>
                    <li>
                        <b>性别：</b>
                        <span>{{detail.sex | sex}}</span>
                    </li>
                    <li>
                        <b>年龄：</b>
                        <span>{{detail.age}}</span>
                    </li>
                    <li>
                        <b>备注：</b>
                        <span>{{detail.remark}}</span>
                    </li>
                </ul>
                <div>
                    <h3 class="flag">病况信息</h3>
                    <ul>
                        <li>
                            <b>原病名称：</b>
                            <span>{{detail.original}}</span>
                        </li>
                        <li>
                            <b>症状：</b>
                            <span>{{detail.symptom}}</span>
                        </li>
                        <li v-if="caseType == 1" class="medicineresult">
                            <b>可推荐用药：</b>
                            <span v-for="item in detail.drugs">{{item.name}}</span>
                        </li>
                        <li v-if="caseType == 2">
                            <b>处方药：</b>
                            <img :src="detail.recipe" alt="">
                        </li>
                        <li v-if="caseType == 2">
                            <b>处方说明：</b>
                            <span>{{detail.original}}</span>
                            <span class="standard">{{detail.standard | standard}}</span>
                        </li>
                        <li>
                            <b>过往病史：</b>
                            <span>{{detail.history}}</span>
                        </li>
                        <li>
                            <b>口忌：</b>
                            <span>{{detail.avoid}}</span>
                        </li>
                        <li>
                            <b>其他注意事项：</b>
                            <span>{{detail.others}}</span>
                        </li>
                        <li v-if="caseType == 3" class="medicineresult">
                            <b>诱导用药：</b>
                            <span v-for="item in detail.drugs">{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
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
        name: 'medicineCase',
        data() {
            let validateSelectBlank = (rule, value, callback) => {
                value === '' ? callback(new Error('请选择病例类型！')) : callback();
            }
            let validateStandardBlank = (rule, value, callback) => {
                if (this.caseType == 2){
                    value === '' ? callback(new Error('请选择是否标准处方！')) : callback();
                }

            }
            let validateRecipenotesBlank = (rule, value, callback) => {
                if (this.caseType == 2){
                    value === '' ? callback(new Error('请输入处方说明！')) : callback();
                }

            }
            return {
                sexlist:[
                    {
                        name:'男',
                        id:'0'
                    },{
                        name:'女',
                        id:'1'
                    }
                ],
                i:0,//active
                editid:'',//当前编辑的ID
                detailinfo:'',//当前分类无数据显示内容
                searchitem:'',//搜索
                searchname:'',//搜索药品
                levellist:'',//一级分类
                levelid:'',//一级分类id
                detaillist:'',//当前分类详情列表
                detail:'',//当前药品详情
                dialogVisibleAdd:false,//新增dialog是否展示
                dialogVisibleChoice:false,//选择药品dialog是否展示
                dialogVisibleDetail:false,//药品详情
                newmedicine:true,//判断dialog是新增还是修改
                caselist:{
                    name:'',//姓名
                    type:'',//病例类型
                    sex:'',//性别
                    age:'',//年龄
                    remark:'',//备注
                    original:'',//病例名称
                    recipe:'',//处方，处方药
                    symptom:'',//症状
                    history:'',//过往病史
                    avoid:'',//口忌
                    others:'',//其他注意事项
                    head:'',//头像
                    drugs:[],//药品列表
                    standard:'',//是否标准处方
                    recipenotes:''//处方说明
                },
                imageUrlhead:'',//上传头像url
                imageUrlCase:'',//上传处方url
                caseType:0,//1：非处方  2: 处方   3：重症
                drugslist:'',//可选的药品列表
                choicelist:[],//选中的药品列表
                medicinesure:false,//显示选择的药品
                rules: {//elementui验证
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ],
                    type: [{
                        required: true,
                        validator: validateSelectBlank,
                        trigger: 'change'
                    }],
                    drugs: [{
                        required: true,
                        message: '请选择药品'
                    }],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    age: [
                        { required: true, message: '年龄不能为空'},
                        { type: 'number', message: '年龄必须为数字值'}
                    ],
                    original: [
                        { required: true, message: '请输入原病名称', trigger: 'blur' },
                        { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ],
                    symptom: [
                        { required: true, message: '请输入症状', trigger: 'blur' },
                        { min: 20, message: '长度在 20 字以上', trigger: 'blur' }
                    ],
                    standard:[{
                        required: true,
                        validator: validateStandardBlank
                    }],
                    recipenotes:[{
                        required: true,
                        validator: validateRecipenotesBlank
                    },{ min: 8, max: 200, message: '长度在 8 到 200 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            'caselist.type':function(val,oldval){
                let _this = this;
                if (val){
                    $.each(_this.levellist,function(k,v){
                        if(val == v.id){
                            _this.caseType = v.name === '非处方药病例' ? 1 : v.name === '处方药病例' ? 2 : v.name === '重症病例' ? 3 : 0 ;
                        }
                    });
                }
            }
        },
        filters :{
            'sex':function(val){
                return val? '女' : '男'
            },
            'standard':function(val) {
                return val ? '错误处方' : '标准处方'
            }
        },
        mounted() {
            this.queryLevel();
        },
        methods: {
            //搜索病例
            searchName(){
                this.i=  null ;
                this.detailinfo='未搜索到相关病例，请重新搜索~';
                this.leveldetail('',this.searchitem);
            },
            //获取一级分类
            queryLevel() {
                let _this = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'case'
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.levellist=data.levellist;
                        if(_this.levellist){
                            _this.levelid=_this.levellist[0].id;
                            _this.leveldetail(_this.levelid);
                        }
                    }
                })
            },
            //选择一级分类
            firstlevel(param,index){
                this.levelid=param;
                this.detailinfo='当前分类暂无病例~';
                this.leveldetail(param);
                this.i = index ;
            },
            //获取当前分类详情
            leveldetail(param,param2) {
                let _this = this;
                post('/case/list', {
                    command: 'case/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    type:param,
                    name:param2
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.detaillist=data.caselist;
                    }
                });
            },
            //新增编辑的 dialog 关闭按钮
            handleCloseAdd() {
                this.$refs['caselist'].resetFields();
                this.medicinesure = false;
                    for (let i in this.caselist){
                       this.caselist[i] = ''
                    }
                this.caselist.drugs = [];
                console.log(this.caselist);
                this.choicelist = [];
                this.caseType = 0;
                this.imageUrlhead = '' ;
                this.imageUrlCase = '' ;
                this.dialogVisibleAdd = false;
            },
            //选择药品关闭
            handleCloseChoice() {
                this.dialogVisibleChoice = false;
                if(!this.medicinesure){
                    this.caselist.drugs=[];
                }
                this.caselist.recipe = '';
                this.caselist.standard='';
                this.caselist.recipenotes=''
            },
            //新建病例
            newcase(){
                let _this = this;
                _this.newmedicine = true;
                _this.dialogVisibleAdd = true;
            },
            handleCloseDetail() {
                this.dialogVisibleDetail = false;
            },
            //查看药品详情
            showDetail(param){
                let _this = this;
                post('/case/detail', {
                    command: 'case/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id:param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.detail=data;
                        $.each(_this.levellist,function(k,v){
                            if(data.type == v.name){
                                _this.caseType = v.name === '非处方药病例' ? 1 : v.name === '处方药病例' ? 2 : v.name === '重症病例' ? 3 : 0 ;
                            }
                        });
                        _this.dialogVisibleDetail = true;
                    } else {
                        _this.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }
                })
            },
            //头像上传成功
            handleAvatarSuccessHead(res, file) {
                this.imageUrlhead = URL.createObjectURL(file.raw);
                this.caselist.head = file.response.data.uri;
            },
            //控制头像格式
            beforeAvatarUploadHead(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传图片只能是JPG或PNG格式')
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            //处方上传成功
            handleAvatarSuccessCase(res, file) {
                this.imageUrlCase = URL.createObjectURL(file.raw);
                this.caselist.recipe = file.response.data.uri
            },
            //控制头像格式
            beforeAvatarUploadCase(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传图片只能是JPG或PNG格式')
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            //获取药品详情
            drugdetail(param) {
                let _this = this;
                post('/drug/list', {
                    command: 'drug/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name:param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.drugslist=data.druglist;
                    }
                });
            },
            //选择药品
            choice(){
                this.drugdetail();
                this.dialogVisibleChoice=true;
            },
            sure(){
                this.choicelist = [];
                for (let i = 0 ; i < this.caselist.drugs.length ; i++){
                    for (let j = 0 ; j < this.drugslist.length ; j++){
                        if (this.caselist.drugs[i] == this.drugslist[j].id){
                            this.choicelist.push(this.drugslist[j].name);
                        }
                    }
                }
                this.dialogVisibleChoice=false;
                this.medicinesure=true;
            },
            //新增保存
            save(){
                let _this = this;
                let drugresult, realsex, typename;
                if(_this.caseType == 1 || _this.caseType == 3){
                    drugresult = _this.caselist.drugs.join(",");
                    _this.caselist.standard='';
                    _this.caselist.recipe = '';
                    _this.caselist.recipenotes='';
                }else if(_this.caseType == 2){
                    drugresult='';
                    _this.caselist.drugs = [];
                }
                let command = _this.newmedicine ? 'case/add': 'case/edit',message = _this.newmedicine ? '新增成功了~': '修改成功了~';
                if (command == 'case/edit'){
                    realsex = _this.caselist.sex == '男' ? 0 : _this.caselist.sex == '女' ? 1 : "";
                    $.each(_this.levellist,function(k,v){
                        if(_this.caselist.type == v.name){
                            typename  = v.name === '非处方药病例' ? v.id : v.name === '处方药病例' ? v.id : v.name === '重症病例' ? v.id : 0 ;
                        }
                    });
                }else {
                    realsex = _this.caselist.sex ;
                    typename = _this.caselist.type ;
                }
                _this.$refs['caselist'].validate( function(valid){
                    if (valid) {
                        post('/'+command, {
                            command: command,
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id:_this.editid,
                            name: _this.caselist.name,
                            type:typename,
                            sex:realsex,
                            age:_this.caselist.age,
                            remark:_this.caselist.remark,
                            original:_this.caselist.original,
                            recipe:_this.caselist.recipe,
                            symptom:_this.caselist.symptom,
                            history:_this.caselist.history,
                            avoid:_this.caselist.avoid,
                            others:_this.caselist.others,
                            head:_this.caselist.head,
                            drugs:drugresult,
                            standard:_this.caselist.standard,
                            recipenotes:_this.caselist.recipenotes
                        }).done(function (data) {
                            if (data && data.errcode == 0) {
                                _this.leveldetail(_this.levelid);
                                _this.medicinesure = false;
                                _this.handleCloseAdd();
                                _this.$message({
                                    type: 'success',
                                    message: message
                                })
                            } else {
                                _this.$message({
                                    type: 'error',
                                    message: data.errdesc
                                })
                            }
                        })
                    }
                })
            },
            //删除药品
            deleteitem(param){
                let _this = this;
                _this.$confirm('此操作将永久删除该病例, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/case/delete', {
                    command: 'case/delete',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.leveldetail(_this.levelid);
                        _this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }
                })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            },
            //编辑药品
            edit(param){
                let _this=this;
                _this.newmedicine=false;
                _this.editid=param;
                post('/case/detail', {
                    command: 'case/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id:param
                }).done(function(data){
                    if (data && data.errcode == 0) {
                        $.each(_this.levellist,function(k,v){
                            if(data.type == v.name){
                                _this.caseType = v.name === '非处方药病例' ? 1 : v.name === '处方药病例' ? 2 : v.name === '重症病例' ? 3 : 0 ;
                            }
                        });
                        _this.caselist.name=data.name;
                        _this.caselist.type=data.type;
                        _this.caselist.age=data.age;
                        _this.caselist.remark=data.remark;
                        _this.caselist.original=data.original;
                        _this.caselist.symptom=data.symptom;
                        _this.caselist.history=data.history;
                        _this.caselist.avoid=data.avoid;
                        _this.caselist.others=data.others;
                        _this.caselist.sex = data.sex === 0 ? '男' : data.sex === 1 ? '女' : '' ;
                        _this.caselist.standard = data.standard +'';
                        _this.caselist.recipenotes = data.recipenotes;
                        if (data.drugs && data.drugs.length > 0){
                            _this.medicinesure = true;
                            data.drugs.forEach(function(k,v){
                                _this.caselist.drugs.push(k.id);
                                _this.choicelist.push(k.name);
                            });
                        }
                        if (_this.caseType == 2){
                            _this.imageUrlCase = data.recipe;
                            _this.caselist.recipe = data.recipe;
                        }
                        _this.imageUrlhead = data.head;
                        _this.caselist.head = data.head;
                        _this.dialogVisibleAdd = true;
                    } else {
                        _this.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }
                })
            }
        }
    }

</script>
<style lang="scss" scoped>
    @import '../assets/css/common.css';
    h2 {
        padding-bottom: 1rem;
    }
    .rightpart {
        width: 100%;
        padding: 0.8rem;
        overflow: auto;
    }
    .main {
        padding: 1.5rem 0;
        background: #fff;
    header {
        padding: 0 1.5rem;
        justify-content: space-between;
    .search {
        width: 20rem;
    }
    }
    section{
        padding:1.5rem;
    }
    }
    .list {
    span {
        cursor: pointer;
        padding:0.5rem 1rem;
    }
    }
    .select {
    li {
        margin:1rem 0;
        font-size: 0.9rem;
    span {
        padding:0.5rem;
    }
    }
    }
    .active {
        border-bottom: 3px solid rgb(0, 160, 233);
    }
    .nodetail {
        text-align: center;
        color: rgb(0, 160, 233);
        line-height: 6rem;
        font-size: 1.2rem;
    }
    .box {
        .name {
            cursor: pointer;
            color: rgb(0, 160, 233);
            :hover {
                color: #00ffff;
            }
            span {
                font-size: 1.2rem;
                text-align: center;
            }
        }
        ul {
            padding: 1.25rem 0;
            border-bottom: solid 1px rgb(220, 220, 220);
            .detail {
                justify-content: flex-start;
                align-items:flex-start;

            span {
                line-height: 1rem;
                height:4rem;
                overflow:hidden;
                i {
                    font-style: normal;
                }
            }
            span:first-child {
                height:2rem;
            }
        }
            li {
                display: inline-flex;
                width:25%;
                height:6rem;
                justify-content: space-around;
                flex-direction: column;
                align-items: center;
                font-size: 0.8rem;
                word-break: break-all;
            }
        }
    }
    .flag {
        color: rgb(0, 160, 233);
        font-weight: normal;
        border-left:5px solid rgb(0, 160, 233);
        padding-left:1.5rem;
        margin-bottom:1rem;
    }
    .leftpart {
        width:60%;
    }
    .headimg {
         width:40%;
     }
    .headimg>span {
        width:10rem;
        padding-top: 1rem;
        text-align: center;
        color: #e4393c;
    }
    .avatar-uploader {
        width: 12rem;
        height: 12rem;
        border: 1px dashed black;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: rgb(243, 248, 252);
    }

    .avatar-uploader:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    .avatar {
        width: 12rem;
        height: 12rem;
        display: block;
    }
    .addUploadImages>div p {
        text-align: center;
        color: gray;
        font-size: 0.75rem;
        line-height: 1.8;
    }
    .checklist {
        border: 1px solid #bfcbd9;
        border-radius: 5px;
        margin-top:1rem;
        ul {
            max-height: 20rem;
            overflow: auto;
        }
        li {
            border-bottom: 1px solid #bfcbd9;
            div {
                padding:1rem;
                display:flex;
                flex-direction: column;
                span:last-child {
                    padding:5px 0 0 20px;
                }
            }
        }
    }
    .medicineresult span {
        /*padding:5px;*/
        margin-right:10px;
        color: #20a0ff;
    }
    .case-uploader {
        width: 10rem;
        height: 10rem;
        border: 1px dashed black;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: rgb(243, 248, 252);
    }
    .detailbox {
        li {
            display:flex;
            padding:0.5rem 0 ;
            b {
                width:7rem;
                text-align: right;
                flex:0 0 auto;
            }
        }
        img {
            width:8rem;
            height:8rem;
            padding-left: 50px;
        }
    }
    .standard {
        padding-left: 2rem;
        color: #20a0ff;
    }
</style>
