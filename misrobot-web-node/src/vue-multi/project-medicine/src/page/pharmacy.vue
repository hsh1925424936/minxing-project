<template>
    <div class="rightpart">
        <div class="main">
            <header class="flex">
                <el-input placeholder="请输入药品关键名称" v-model="searchitem" class="search">
                    <el-button slot="append" icon="search" @click="searchName()"></el-button>
                </el-input>
                <el-button type="primary" @click="add()">新增</el-button>
            </header>
            <section>
                <div class="list">
                    <ul class="select">
                        <li>
                            <span class="levelname" v-for=" (level,index) in levellist " v-model="levelid" @click="firstlevel(level.id,index)" :class="{active : i == index}">{{level.name}}</span>
                        </li>
                        <li>
                            <span class="itemname" v-for=" (levelitem,index) in druglist " v-model="s_levleid" @click="secondlevel(levelitem.id,index)">{{levelitem.name}}</span>
                        </li>
                    </ul>
                </div>
                <p class="nodetail" v-if="detaillist.length==0">{{searchinfo}}</p>
                <div class="content">
                    <ul v-for="(detail,index) in detaillist" class="flex">
                        <li class="name" @click="showDetail(detail.id)">
                            <span>{{detail.name}}</span>
                            <i v-show="detail.ephedrine==1">麻黄碱</i>
                        </li>
                        <li class="detail">
                            <span>适应症：{{detail.indication}}</span>
                            <span>禁忌症：{{detail.contraindication}}</span>
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
        <!--TODO 新增药品-->
        <el-dialog title="" :visible.sync="dialogVisibleAdd" size="small" :before-close="handleCloseAdd">
            <h2>
                <template v-if="newmedicine">新增药品</template>
                <template v-else>编辑药品</template>
            </h2>
            <div class="addbox">
                <el-form :model="addpharmacy" :rules="rules" ref="addpharmacy" label-width="100px">
                    <el-form-item label="药品名称" prop="name">
                        <el-input v-model="addpharmacy.name" style="width:80%;"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item label="药品类型" prop="type">
                        <el-select v-model="addpharmacy.type" placeholder="请选择" class="selectbox" @change="selectList(addpharmacy.type)">
                            <el-option v-for="item in levellist" :key="item.name" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="药品分类" prop="drug">
                        <el-select v-model="addpharmacy.drug" placeholder="请选择" class="selectbox">
                            <el-option v-for="item in selectlist" :key="item.name" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <span v-show="newmedicine">请先选择药品类型</span>
                    </el-form-item>
                    <el-form-item label="适应症" prop="indication">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addpharmacy.indication" style="width:80%;"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item label="禁忌症" prop="contraindication">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addpharmacy.contraindication" style="width:80%;" placeholder="默认为尚不明确"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item label="不良反应" prop="untoward">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addpharmacy.untoward" style="width:80%;" placeholder="默认为尚不明确"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item label="用法用量" prop="dosage">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addpharmacy.dosage" style="width:80%;"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item label="成分" prop="component">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addpharmacy.component" style="width:80%;"></el-input>
                        <span>2-500字</span>
                    </el-form-item>
                    <el-form-item prop="ephedrine" style="padding-left: 100px">
                        <template>
                            <el-radio class="radio" v-model="addpharmacy.ephedrine" label="0">不含满黄建</el-radio>
                            <el-radio class="radio" v-model="addpharmacy.ephedrine" label="1">含有麻黄碱</el-radio>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="flex flex-w-center">
                <el-button type="primary" @click="save()">保存</el-button>
                <el-button @click="resetForm('addpharmacy')">取 消</el-button>
            </span>
        </el-dialog>
        <!--查看药品详情-->
        <el-dialog title="药品详情" :visible.sync="dialogVisibleDetail" :before-close="handleCloseDetail">
            <ul class="detailbox">
                <li>
                    <b>药品名称：</b>
                    <span>{{detail.name}}</span>
                    <i>（麻黄碱）</i>
                </li>
                <li>
                    <b>药品类型：</b>
                    <span>{{detail.first}}</span>
                </li>
                <li>
                    <b>药品分类：</b>
                    <span>{{detail.second}}</span>
                </li>
                <li>
                    <b>适应症：</b>
                    <span>{{detail.indication}}</span>
                </li>
                <li>
                    <b>禁忌症：</b>
                    <span>{{detail.contraindication}}</span>
                </li>
                <li>
                    <b>不良反应：</b>
                    <span>{{detail.untoward}}</span>
                </li>
                <li>
                    <b>用法用量：</b>
                    <span>{{detail.dosage}}</span>
                </li>
                <li>
                    <b>成分：</b>
                    <span>{{detail.component}}</span>
                </li>
            </ul>
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
        name: 'identifyPharmacy',
        data() {
            let validateNameBlank = (rule, value, callback) => {
                value === '' || value.trim() === '' ? callback(new Error('请输入药品名称！')) : callback();
            }
            let validateSelectBlank = (rule, value, callback) => {
                value === '' ? callback(new Error('请选择分类！')) : callback();
            }
            let validateDrugBlank = (rule, value, callback) => {
                value === '' ? callback(new Error('请选择分类！')) : callback();
            }
            let validateIndicationBlank = (rule, value, callback) => {
                value === '' || value.trim() === '' ? callback(new Error('请输入适应症！')) : callback();
            }
            let validateDosageBlank = (rule, value, callback) => {
                value === '' || value.trim() === '' ? callback(new Error('请输入用法用量！')) : callback();
            }
            let validateComponentBlank = (rule, value, callback) => {
                value === '' || value.trim() === '' ? callback(new Error('请输入该药品成分！')) : callback();
            }
            let validateEphedrineBlank = (rule, value, callback) => {
                value === '' ? callback(new Error('请选择是否含有麻黄碱！')) : callback();
            }
            return {
                i:'',//active
                searchitem:'',//搜索
                editid:'',//要修改的药品id
                searchinfo:'',
                levellist:'',//一级分类
                levelid:'',//一级分类id
                druglist:'',//二级分类
                s_levleid:'',//二级分类id
                selectlist:'',//新增时展示的二级分类
                detaillist:'',//详情列表
                detail:'',//详情
                dialogVisibleAdd:false,//新增以及编辑的dialog
                dialogVisibleDetail:false,//查看详情的dialog
                newmedicine:true,//新增 or 编辑
                addpharmacy:{//新增的内容
                    name:'',//名称
                    type:'',//类型
                    drug:'',//分类
                    indication:'',//适应症
                    contraindication:'',//禁忌症
                    untoward:'',//不良反应
                    dosage:'',//用法用量
                    component:'',//成分
                    ephedrine:''//是否含有麻黄碱
                },
                rules: {//elementui验证
                    name: [{
                        required: true,//是否必填
                        validator: validateNameBlank,//自定义的验证方式
                        trigger: 'blur'//验证方式  失去焦点
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 16,
                            message: '字数必须小于16',
                            trigger: 'blur'
                        }
                    ],
                    type: [{
                        required: true,
                        validator: validateSelectBlank,
                        trigger: 'change'
                    }],
                    drug: [{
                        required: true,
                        validator: validateDrugBlank,
                        trigger: 'change'
                    }],
                    indication: [{
                        required: true,
                        validator: validateIndicationBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 500,
                            message: '字数必须小于500',
                            trigger: 'blur'
                        }
                    ],
                    contraindication: [{
                        required: false,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 500,
                            message: '字数必须小于500',
                            trigger: 'blur'
                        }
                    ],
                    untoward: [{
                        required: false,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 500,
                            message: '字数必须小于500',
                            trigger: 'blur'
                        }
                    ],
                    dosage: [{
                        required: true,
                        validator: validateDosageBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 500,
                            message: '字数必须小于500',
                            trigger: 'blur'
                        }
                    ],
                    component: [{
                        required: true,
                        validator: validateComponentBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 500,
                            message: '字数必须小于500',
                            trigger: 'blur'
                        }
                    ],
                    ephedrine: [{
                        required: true,
                        validator: validateEphedrineBlank,
                        trigger: 'change'
                    }]
                }
            }
        },
        watch: {
            //监听一级分类改变，获取二级分类
            'levelid': function (val, oldval) {
                var _this = this;
                if(val){
                    post('/hr/querylevellist', {
                        command: 'hr/querylevellist',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        code: 'drug',
                        pid: val
                    }).done(function (data) {
                        if (data && data.errcode == 0) {
                            _this.druglist = data.levellist;
                            _this.leveldetail(this.levelid);
                        }
                    }.bind(this))
                }
            },
            //监听二级分类改变
            's_levleid':function(val, oldval){
                if(val){
                    this.leveldetail(this.s_levleid);
                }
            }
        },
        mounted() {
            this.queryLevel();
        },
        methods: {
            //搜索药品
            searchName(){
                $('.itemname').removeClass('active');
                this.i = null;
                this.searchinfo='未搜索到相关药品，请重新搜索~';
                this.leveldetail('',this.searchitem);
            },
            //新增编辑的 dialog 关闭按钮
            handleCloseAdd() {
                this.$refs['addpharmacy'].resetFields();
                for (let i in this.addpharmacy) {
                    this.addpharmacy[i] = ''
                }
                console.log(this.addpharmacy);
                this.dialogVisibleAdd = false;
            },
            handleCloseDetail() {
                this.dialogVisibleDetail = false;
            },
            //获取一级分类
            queryLevel() {
                let _this = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'drug'
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
            //获取新增时当前的二级分类
            selectList(param){
                var _this = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'drug',
                    pid:param || _this.s_levleid
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.selectlist = data.levellist;
                    }
                })
            },
            //获取当前分类详情
            leveldetail(param,param2) {
                let _this = this;
                post('/drug/list', {
                    command: 'drug/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    type:param,
                    name:param2
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.detaillist=data.druglist;
                    }
                });
            },
            //选择一级分类
            firstlevel(param,index){
                this.searchinfo='当前分类暂无药品~';
                this.levelid=param;
                this.s_levleid='';
                this.leveldetail(param);
                this.i = index ;
                $('.itemname').removeClass('active');
            },
            //选择二级分类
            secondlevel(param,index){
                this.searchinfo='当前分类暂无药品~';
                this.s_levleid=param;
                $('.itemname').removeClass('active');
                $($('.itemname')[index]).addClass('active')
            },
            //控制active ，默认是index=0
            active(index) {
                return {
                    'active': index == 0
                }
            },
            //新建药品
            add(){
                let _this = this;
                _this.newmedicine = true;
                _this.dialogVisibleAdd = true;
            },
            //关闭新增窗口
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.dialogVisibleAdd = false;
            },
            //新增保存
            save(){
                let _this = this;
                let command = _this.newmedicine ? 'drug/add': 'drug/edit',message = _this.newmedicine ? '新增成功了~': '修改成功了~';
                _this.$refs['addpharmacy'].validate( valid => {
                    if (valid) {
                        post('/'+command, {
                            command: command,
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id:_this.editid,
                            name: _this.addpharmacy.name,
                            type:_this.addpharmacy.drug,
                            indication:_this.addpharmacy.indication,
                            contraindication:_this.addpharmacy.contraindication || '尚不明确',
                            untoward:_this.addpharmacy.untoward  || '尚不明确',
                            dosage:_this.addpharmacy.dosage,
                            component:_this.addpharmacy.component,
                            ephedrine:parseInt(_this.addpharmacy.ephedrine)
                        }).done(function (data) {
                            if (data && data.errcode == 0) {
                                _this.s_levleid ? _this.leveldetail(_this.s_levleid) : _this.leveldetail(_this.levelid);
                                _this.handleCloseAdd()
                                _this.$refs['addpharmacy'].resetFields();
                                _this.editid='';
                                _this.$message({
                                    type: 'success',
                                    message: message
                                })
                                _this.dialogVisibleAdd = false;
                            } else {
                                _this.editid='';
                                _this.$message({
                                    type: 'error',
                                    message: data.errdesc
                                })
                            }
                        })
                    }
                })
            },
            //查看药品详情
            showDetail(param){
                let _this = this;
                post('/drug/detail', {
                    command: 'drug/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id:param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.detail=data;
                        _this.dialogVisibleDetail = true;
                    } else {
                        _this.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }
                })
            },
            //编辑药品
            edit(param){
                let _this=this;
                _this.newmedicine=false;
                _this.editid=param;
                post('/drug/detail', {
                    command: 'drug/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id:param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        _this.addpharmacy=data;
                        _this.addpharmacy.type=data.firstid;
                        _this.selectList(_this.addpharmacy.type);
                        _this.addpharmacy.drug=data.secondid;
                        _this.addpharmacy.ephedrine=data.ephedrine.toString();
                        _this.dialogVisibleAdd = true;
                    } else {
                        _this.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }
                })
            },
            //删除药品
            deleteitem(param){
                let _this = this;
                _this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/drug/delete', {
                        command: 'drug/delete',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: param
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        if (_this.s_levleid){
                            _this.leveldetail(_this.s_levleid);
                        }else {
                            _this.leveldetail(_this.levelid);
                        }
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
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../assets/css/common.css';
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
    .active{
        background: rgb(0, 160, 233);
        color: white;
        border-radius: 0.2rem;
    }
    .list {
    span {
        cursor: pointer;
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
    .nodetail {
        text-align: center;
        color: rgb(0, 160, 233);
        line-height: 6rem;
        font-size: 1.2rem;
    }
    .content {
    ul {
        padding: 1.25rem 0;
        border-bottom: solid 1px rgb(220, 220, 220);
    .detail {
        justify-content: flex-start;
        align-items:flex-start;
        span {
            line-height: 1rem;
            height:3rem;
            overflow:hidden;
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
    }
    }
    }
    .name {
        cursor:pointer;
        color:rgb(0, 160, 233);
    span {
        font-size: 1.2rem;
        text-align: center;
    }
    i {
        font-style: normal;
        color: #FF6600;
    }
    }
    .selectbox {
        width: 30%;
    }
    h2 {
        padding-bottom:1rem;
    }
    .detailbox {
        li {
            display:flex;
            padding:0.5rem 0 ;
            b {
                width:5rem;
                text-align: right;
                flex:0 0 auto;
            }
        }
        li:first-child i {
            color: #FF6600;
        }
    }
</style>
