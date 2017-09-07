
<template>
    <div class="root">
        <div class="cont">
            <div class="header flex">
                <el-input placeholder="请输入药物名称" v-model="searchName" class="search">
                    <!--<i class="el-icon-circle-close"></i>-->
                    <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
                <el-button type="primary" @click="add">新增</el-button>
            </div>
            <div class="list">
                <span v-if="showMedicineList" class="medicineName" v-for="(item,index) in levellist" @click="select(index)" :class="active(index)">{{item.name}}</span>
            </div>
            <div class="subject" v-for="item in medicine">
                <h2>{{item.subjectname}}</h2>
                <div v-for="v in item.items">
                    <ul class="subjectUl">
                        <li>
                            <img :src="url+v.typical" alt="">
                        </li>
                        <li>
                            <h3 @click="detail(v.id)">{{v.name}}</h3>
                            <p>
                                <span>药用部位：<span style="color:#333333;">{{v.functions}}</span></span>
                            </p>
                        </li>
                        <li>
                            <span style="color:#888888;">最新修改时间</span>
                            <span style="text-align:center;margin-top:2rem;">{{v.update_at}}</span>
                        </li>
                        <li>
                            <span style="color:#888888;">修改人</span>
                            <span style="text-align:center;margin-top:2rem;">{{v.updater}}</span>
                        </li>
                        <li>
                            <span style="color:#888888;">操作</span>
                            <p style="display:flex;justify-content:center;margin-top:2rem;">
                                <el-button type="primary" size="small" @click="edit(v.id)">编辑</el-button>
                                <el-button @click='deleteItem(v.id)' size="small">删除</el-button>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <el-dialog title="" :visible.sync="dialogVisibleAdd" size="small" :before-close="handleCloseAdd">
            <h2 style="text-align:center;color:rgb(0,160,230);margin-top:-30px;font-weight:590;" v-if="showEdit">编辑</h2>
            <h2 style="text-align:center;color:rgb(0,160,230);margin-top:-30px;font-weight:590;" v-else>新增</h2>
            <div class="message addCont">
                <h3>基本信息</h3>
                <el-form :model="addMedicine" :rules="rules" ref="addMedicine" label-width="100px">
                    <el-form-item label="药品名称" prop="addName">
                        <el-input v-model="addMedicine.addName" style="width:300px;"></el-input>
                        <span>2-7字</span>
                    </el-form-item>
                    <el-form-item label="科目分类" prop="addSelect">
                        <el-select v-model="addMedicine.addSelect" placeholder="请选择" class="select">
                            <el-option v-for="item in levellist" :key="item.name" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-if="showSubject" v-model="addMedicine.addSecondSubject" placeholder="请选择" class="select">
                            <el-option v-for="item in levellistSecond" :key="item.name" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="别名" prop="addAlias">
                        <el-input class="input" v-model="addMedicine.addAlias" style="width:300px;"></el-input>
                        <span>2-16字</span>
                    </el-form-item>
                    <el-form-item label="来源" prop="addSource">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addSource" style="width:300px;"></el-input>
                        <span>2-65字</span>
                    </el-form-item>
                    <el-form-item label="产地" prop="addOrigin">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addOrigin" style="width:300px;"></el-input>
                        <span>2-45字</span>
                    </el-form-item>
                    <el-form-item label="性状与鉴别" prop="addIdentify">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addIdentify" style="width:300px;"></el-input>
                        <span>10-350字</span>
                    </el-form-item>
                    <el-form-item label="主要成分" prop="addComponent">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addComponent" style="width:300px;"></el-input>
                        <span>2-40字</span>
                    </el-form-item>
                    <el-form-item label="药理作用" prop="addEffect">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addEffect" style="width:300px;"></el-input>
                        <span>2-40字</span>
                    </el-form-item>
                    <el-form-item label="炮制" prop="addProcessing">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addProcessing" style="width:300px;"></el-input>
                        <span>2-40字</span>
                    </el-form-item>
                    <el-form-item label="性味与归经" prop="addTropism">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addTropism" style="width:300px;"></el-input>
                        <span>2-40字</span>
                    </el-form-item>
                    <el-form-item label="功能主治" prop="addFunctions">
                        <el-input type="textarea" class="textarea" v-model="addMedicine.addFunctions" style="width:300px;"></el-input>
                        <span>2-60字</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="upload addCont">
                <h3>图片上传</h3>
                <div class="addUploadImages">
                    <div>
                        <h4>典型形态<span style="color:red;">*</span></h4>
                        <el-upload class="avatar-uploader" action="/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess1" :on-remove="handleRemove1"
                                   :before-upload="beforeAvatarUpload1" list-type="picture">
                            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">

                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>格式：支持jpg、png</span><br>
                                <span>比例：宽/高=3/5</span><br>
                                <span>大小：2M以内</span>
                            </p>
                        </el-upload>
                    </div>

                    <div>
                        <h4>性状鉴别<span style="color:red;">*</span></h4>
                        <el-upload class="avatar-uploader" action="/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess2" :on-remove="handleRemove2"
                                   :before-upload="beforeAvatarUpload2" list-type="picture">
                            <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>格式：支持jpg、png</span><br>
                                <span>比例：宽/高=3/5</span><br>
                                <span>大小：2M以内</span>
                            </p>
                        </el-upload>
                    </div>

                    <div>
                        <h4>功能主治<span style="color:red;">*</span></h4>
                        <el-upload class="avatar-uploader" action="/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess3" :on-remove="handleRemove3"
                                   :before-upload="beforeAvatarUpload3" list-type="picture">
                            <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>格式：支持jpg、png</span><br>
                                <span>比例：宽/高=3/5</span><br>
                                <span>大小：2M以内</span>
                            </p>
                        </el-upload>
                    </div>
                </div>
            </div>
                <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('addMedicine')">保存</el-button>
				<el-button @click="handleCloseAdd()">取 消</el-button>
			</span>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="dialogVisibleDetail" :before-close="handleCloseDetail">
            <h2>基本信息</h2>
            <div class="detailslist">
                <div>
                    <img :src="details.typical" alt="">
                </div>
                <div>
                    <h3>{{details.name}}</h3>
                    <p v-if="details.alias">
                        <span>别名：</span>
                        <span>{{details.alias}}</span>
                    </p>
                    <p>
                        <span>来源：</span>
                        <span>{{details.source}}</span>
                    </p>
                    <p>
                        <span>产地：</span>
                        <span>{{details.origin}}</span>
                    </p>
                </div>
            </div>
            <h2>性状鉴别</h2>
            <div class="detailslist">
                <div>
                    <img :src="details.character" alt="">
                </div>
                <div>
                    <span>性状鉴别：</span>
                    <p>{{details.identify}}</p>
                </div>
            </div>
            <h2>主治功能</h2>
            <div class="detailslist">
                <div>
                    <img :src="details.function" alt="">
                </div>
                <div>
                    <p>
                        <span>主要成分：</span>
                        <span>{{details.component}}</span>
                    </p>
                    <p v-if="details.effect">
                        <span>药理作用：</span>
                        <span>{{details.effect}}</span>
                    </p>
                    <p v-if="details.processing">
                        <span>炮制：</span>
                        <span>{{details.processing}}</span>
                    </p>
                    <p>
                        <span>性味与归经：</span>
                        <span>{{details.tropism}}</span>
                    </p>
                    <p>
                        <span>功能主治：</span>
                        <span>{{details.functions}}</span>
                    </p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="edit(details.id)">编辑</el-button>
				<el-button @click="deleteItem(details.id)">删除</el-button>

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
        name: 'identifyMedicine',
        data() {
            var validateNameBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入药品名称！'));
                } else {
                    callback()
                }
            };
            var validateSelectBlank = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择科目分类！'));
                } else {
                    callback()
                }
            };
            var validateOriginBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入产地！'));
                } else {
                    callback()
                }
            };
            var validateEffectBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入功效内容！'));
                } else {
                    callback()
                }
            };
            var validateTropismBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入性味与归经内容！'));
                } else {
                    callback()
                }
            };
            var validateSourceBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入产地！'));
                } else {
                    callback()
                }
            };
            var validateComponentBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入主要成分！'));
                } else {
                    callback()
                }
            };
            var validateIdentifyBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入性状鉴别！'));
                } else {
                    callback()
                }
            };
            var validateFunctionsBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入功能主治！'));
                } else {
                    callback()
                }
            };
            var validateProcessingBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入炮制！'));
                } else {
                    callback()
                }
            };
            return {
                url:'',
                levellist: [],
                searchName: '',
                subjectId: '',
                dialogVisibleAdd: false,
                dialogVisibleDetail: false,
                medicine: [],
                dialogImageUrl: '',
                dialogVisible: false,
                showSubject: false,
                details: {},
                levellistSecond: [],
                imageUrl1: '',
                imageUrl2: '',
                imageUrl3: '',
                fileList: [],
                addMedicine: {
                    addOrigin: '',//产地
                    addName: '',//名字
                    addSelect: '',//类型
                    addSubject: '',//分类
                    addSecondSubject: '',//二级分类
                    addAlias: '',//别名
                    addSource: '',//来源
                    addIdentify: '',//性状鉴别
                    addComponent: '',//主要成分
                    addEffect: '',//药理作用
                    addProcessing: '',//炮制
                    addTropism: '',//性味与归经
                    addFunctions: ''//功能主治
                },
                addSubject: '',
                typical: '',
                character: '',
                function: '',
                global: window,
                showEdit: false,
                showMedicineList: true,
                editId: '',
                rules: {
                    addName: [{
                        required: true,
                        validator: validateNameBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 7,
                            message: '字数必须小于7',
                            trigger: 'blur'
                        }
                    ],
                    addAlias: [
                        { required: false, trigger: 'blur' },
                        { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ],
                    addSource: [{
                        required: true,
                        validator: validateSourceBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 65,
                            message: '字数必须小于65',
                            trigger: 'blur'
                        }
                    ],
                    addComponent: [{
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
                            max: 40,
                            message: '字数必须小于40',
                            trigger: 'blur'
                        }
                    ],
                    addSelect: [{
                        required: true,
                        validator: validateSelectBlank,
                        trigger: 'blur'
                    },],
                    addOrigin: [{
                        required: true,
                        validator: validateOriginBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 45,
                            message: '字数必须小于45',
                            trigger: 'blur'
                        },
                    ],
                    addIdentify: [{
                        required: true,
                        validator: validateIdentifyBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 10,
                            message: '字数必须大于10',
                            trigger: 'blur'
                        },
                        {
                            max: 350,
                            message: '字数必须小于350',
                            trigger: 'blur'
                        },
                    ],
                    addEffect: [
                        { required: false, trigger: 'blur' },
                        { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
                    ],
                    addProcessing: [
                        { required: false, trigger: 'blur' },
                        { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
                    ],
                    addFunctions: [{
                        required: true,
                        validator: validateFunctionsBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 60,
                            message: '字数必须小于60',
                            trigger: 'blur'
                        },
                    ],
                    addTropism: [{
                        required: true,
                        validator: validateTropismBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 2,
                            message: '字数必须大于2',
                            trigger: 'blur'
                        },
                        {
                            max: 40,
                            message: '字数必须小于40',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        watch: {
            'addMedicine.addSelect': function (val, oldval) {
                // console.log(val)
                if(val == ''){
                    this.showSubject = false
                }else{
                    this.showSubject = true
                    post('/hr/querylevellist', {
                        command: 'hr/querylevellist',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        code: 'medicine',
                        pid: val
                    }).done(function (data) {
                        if (data && data.errcode == 0) {
                            this.levellistSecond = data.levellist;
                            if (this.levellistSecond.length == 0) {
                                this.showSubject = false
                                this.addMedicine.addSecondSubject = this.addMedicine.addSubject
                            }
                        }
                    }.bind(this))
                }

            },
            'searchName': function (val, oldval) {
                if (val == '') {
                    this.showMedicineList = true
                } else {
                    this.showMedicineList = false
                }
            },
        },
        mounted() {
            this.queryLevel()
        },
        methods: {
            handleCloseAdd() {
                this.$refs['addMedicine'].resetFields();
                this.dialogVisibleAdd = false
            },
            handleCloseDetail() {
                this.dialogVisibleDetail = false
            },

            // 搜索
            search() {
                this.queryMedicineList(this.searchName, '')
            },
            // 查询药物列表
            queryMedicineList(name, id) {
                let self = this;
                post('/medicine/list', {
                    command: 'medicine/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name: name,
                    subject: id
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
                                    'id': data.medicinelist[i].id,
                                    'name': data.medicinelist[i].name,
                                    'functions': data.medicinelist[i].functions,
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
                // console.log(self.medicine)
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
                        // console.log(self.levellist)
                        // alert(self.levellist[0].id)
                        self.subjectId = self.levellist[0].id
                        // alert(self.subjectId)
                        self.queryMedicineList(self.searchName, self.subjectId)

                    }
                })
            },
            select(index) {
                $('.medicineName').removeClass('active')
                $($('.medicineName')[index]).addClass('active')
                this.subjectId = this.levellist[index].id
                this.queryMedicineList(this.searchName, this.subjectId)
                // alert(this.subjectId)
            },
            active(index) {
                return {
                    'active': index == 0
                }
            },
            add() {
                this.dialogVisibleAdd = true
                this.showEdit = false
                this.showSubject = false
                this.addMedicine = {
                    addOrigin: '',//产地
                    addName: '',//名字
                    addSelect: '',//类型
                    addSubject: '',//分类
                    addSecondSubject: '',//二级分类
                    addAlias: '',//别名
                    addSource: '',//来源
                    addIdentify: '',//性状鉴别
                    addComponent: '',//主要成分
                    addEffect: '',//药理作用
                    addProcessing: '',//炮制
                    addTropism: '',//性味与归经
                    addFunctions: ''//功能主治
                }
                this.imageUrl1 = ''
                this.imageUrl2 = ''
                this.imageUrl3 = ''
            },
            save(addMedicine) {
                let self = this
                this.$refs[addMedicine].validate((valid) => {
                    if (valid) {
                        if (this.typical == '' || this.character == '' || this.function == '') {
                            this.$message.error('还有图片没有上传！')
                        } else if (this.showEdit) {
                            this.editMed()
                        } else {
                            this.addMed()
                        }
                    }
                })
            },
            addMed() {
                let self = this
                let subjectid = ''
                self.addMedicine.addSecondSubject ? subjectid = self.addMedicine.addSecondSubject : subjectid = self.addMedicine.addSelect
                post('/medicine/add', {
                    command: 'medicine/add',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name: self.addMedicine.addName,
                    subject: subjectid,
                    origin: self.addMedicine.addOrigin,
                    alias: self.addMedicine.addAlias,
                    source: self.addMedicine.addSource,
                    identify: self.addMedicine.addIdentify,
                    component: self.addMedicine.addComponent,
                    effect: self.addMedicine.addEffect,
                    processing: self.addMedicine.addProcessing,
                    tropism: self.addMedicine.addTropism,
                    functions: self.addMedicine.addFunctions,
                    typical: self.typical,
                    character: self.character,
                    function: self.function
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        self.typical = ''
                        self.character = ''
                        self.function = ''
                        self.handleCloseAdd()
                        self.queryMedicineList(self.searchName, self.subjectId)
                        self.$message({
                            type: 'success',
                            message: '新增成功了'
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }

                })
            },
            detail(id) {
                this.dialogVisibleDetail = true
                this.queryDetail(id)
            },
            queryDetail(id) {
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
                            id:data.id,
                            name:data.name,
                            first:data.first,
                            second:data.second,
                            origin:data.origin,
                            alias:data.alias,
                            source:data.source,
                            identify:data.identify,
                            component:data.component,
                            effect:data.effect,
                            processing:data.processing,
                            tropism:data.tropism,
                            functions:data.functions,
                            typical:data.typical,
                            character:data.character,
                            function:data.function
                        },
                        self.addMedicine.addName = data.name,
                        self.addMedicine.addSelect = data.first,
                        self.addMedicine.addOrigin = data.origin,
                        self.addMedicine.addAlias = data.alias,
                        self.addMedicine.addSource = data.source,
                        self.addMedicine.addIdentify = data.identify,
                        self.addMedicine.addComponent = data.component,
                        self.addMedicine.addEffect = data.effect,
                        self.addMedicine.addProcessing = data.processing,
                        self.addMedicine.addTropism = data.tropism,
                        self.addMedicine.addFunctions = data.functions,
                        self.typical = data.typical,
                        self.character = data.character,
                        self.function = data.function,
                        self.imageUrl1 = self.url + data.typical,
                        self.imageUrl2 = self.url + data.character,
                        self.imageUrl3 = self.url + data.function
                        if (data.second == null) {
                            self.showSubject = false
                        } else {
                            self.addMedicine.addSecondSubject = data.second
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
                        self.dialogVisibleDetail = false
                        self.queryMedicineList(self.searchName, self.subjectId)
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        self.$message.error(data.errdesc)
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
            handleAvatarSuccess1(res, file) {
                //  console.log(res)
                // console.log(file)
                this.imageUrl1 = URL.createObjectURL(file.raw)
                this.typical = file.response.data.uri
                // console.log(this.typical)
            },
            handleRemove1(file, fileList) {
                console.log(file, fileList);
            },
            beforeAvatarUpload1(file) {
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
            handleAvatarSuccess2(res, file) {
                console.log(file)
                this.imageUrl2 = URL.createObjectURL(file.raw);
                this.character = file.response.data.uri
            },
            handleRemove2(file, fileList) {
                console.log(file, fileList);
            },
            beforeAvatarUpload2(file) {
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
            handleAvatarSuccess3(res, file) {
                //  console.log(res)
                console.log(file)
                this.imageUrl3 = URL.createObjectURL(file.raw);
                this.function = file.response.data.uri
                // console.log(this.funtion)
            },
            handleRemove3(file, fileList) {
                console.log(file, fileList);
            },
            beforeAvatarUpload3(file) {
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
            beforeAvatarUpload4(file) {
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
            beforeAvatarUpload5(file) {
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
            edit(id) {
                this.showEdit = true
                this.dialogVisibleAdd = true
                this.queryDetail(id)
                this.editId = id
            },
            editMed() {
                let self = this
                let subjectid = ''
                self.addMedicine.addSecondSubject ? subjectid = self.addMedicine.addSecondSubject : subjectid = self.addMedicine.addSelect
                post('/medicine/edit', {
                    command: 'medicine/edit',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: self.editId,
                    name: self.addMedicine.addName,
                    subject: subjectid,
                    origin: self.addMedicine.addOrigin,
                    alias: self.addMedicine.addAlias,
                    source: self.addMedicine.addSource,
                    identify: self.addMedicine.addIdentify,
                    component: self.addMedicine.addComponent,
                    effect: self.addMedicine.addEffect,
                    processing: self.addMedicine.addProcessing,
                    tropism: self.addMedicine.addTropism,
                    functions: self.addMedicine.addFunctions,
                    typical: self.typical,
                    character: self.character,
                    function: self.function
                }).done(function (data) {
                    self.queryMedicineList(self.searchName, self.subjectId)
                    if (data && data.errcode == 0) {
//                        self.dialogVisibleAdd = false
                        self.dialogVisibleDetail = false
                        self.typical = ''
                        self.character = ''
                        self.function = ''
                        self.handleCloseAdd()
                        self.$message({
                            type: 'success',
                            message: '编辑成功了'
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: data.errdesc
                        })
                    }

                })
            }
        }
    }

</script>
<style scoped>
    .root {
        width: 100%;
        height: 100%;
        padding: 0.8rem;
        box-sizing: border-box;
        overflow: hidden;
    }

    .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        /*justify-content: center;*/
    }
    .cont {
        width: 100%;
        height: 100%;
        background: rgb(255, 255, 255);
        padding: 1.5rem 0;
        box-sizing: border-box;
        overflow: auto;
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
        width: calc(100% - 2rem);
        margin: 0 1rem;
        padding: 1.25rem 0;
        border-bottom: solid 1px rgb(220, 220, 220);
        box-sizing: border-box;
        display: flex;
    }

    .subject div:nth-last-child(1) .subjectUl {
        border: none;
    }

    .subjectUl li {
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
    }

    .subjectUl li:nth-child(1) {
        width: 12%;
        justify-content: center;
        align-items: center;
        margin-right: 1.75rem;
    }

    .subjectUl li:nth-child(2) {
        width: 50%;
        justify-content: center;
        margin-right: 1.75rem;
        font-size: 0.87rem;
        color: #333333;
    }

    .subjectUl li:nth-child(2) p:nth-child(2) {
        margin: 0.5rem 0;
    }

    .subjectUl li:nth-child(2) h3 {
        font-size: 1.13rem;
        color: #333333;
    }

    .subjectUl li:nth-child(3) {
        width: 10%;
        align-items: center;
        padding-top: 0.8rem;
        font-size: 0.87rem;
        color: #333333;
    }

    .subjectUl li:nth-child(4) {
        width: 10%;
        align-items: center;
        padding-top: 0.8rem;
        font-size: 0.87rem;
        color: #333333;
    }

    .subjectUl li:nth-child(5) {
        width: 18%;
        align-items: center;
        padding-top: 0.8rem;
        font-size: 0.87rem;
        color: #333333;
    }

    .subjectUl li img {
        width: 150px;
        height: 112px;
        /*height: 4rem;*/
        border: solid 1px rgb(230, 230, 230);
        /*padding:1rem;*/
    }

    .subjectUl li h3 {
        font-size: 1rem;
        font-weight: normal;
        cursor: pointer;
    }

    .subjectUl li {
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        color: gray;
    }

    .subject h2 {
        color: rgb(0, 160, 233);
        /*margin-left:-20px;*/
        font-weight: normal;
        font-size: 1rem;
    }

    .subject h2::before {
        content: '';
        border: solid 3px rgb(0, 160, 230);
        margin-right: 10px;
    }

    .addCont h3 {
        color: rgb(0, 160, 233);
        margin-left: -20px;
        font-weight: normal;
    }

    .addCont h3::before {
        content: '';
        border: solid 3px rgb(0, 160, 230);
        margin-right: 10px;
    }

    .avatar-uploader {
        width: 12.625rem;
        height: 10.125rem;
        border: 1px dashed black;
        border-radius: 6px;
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
        width: 12.625rem;
        height: 10.125rem;
        display: block;
    }

    .addUploadImages {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .addUploadImages>div {
        margin-left: 1.25rem;
        margin-top: 0.5rem;
        position: relative;
    }

    .addUploadImages>div p {
        position: absolute;
        width: 100%;
        z-index: 100;
        bottom: 0.5rem;
        text-align: center;
        color: gray;
        font-size: 0.75rem;
        line-height: 1.8;
    }

    .addUploadImages>div h5 {
        display: flex;
        margin-top: 0.5rem;
        align-items: center;
    }

    .addUploadImages>div h5 span {
        font-size: 1rem;
        margin-right: 0.5rem;
    }

    .addUploadImages h4 {
        margin-bottom: 0.4rem;
        font-weight: normal;
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
    }

    .detailsHead h2 {
        font-size: 1.25rem;
    }

    .detailsHead p {
        font-size: 0.87rem;
        margin: 1rem 0;
        color: gray;
    }

    .detailsHead p span b {
        color: rgb(120, 120, 120);
    }

    .detailsHead p:nth-of-type(1) span:nth-child(1) {
        margin-right: 2rem;
    }

    .detailsPic {
        display: flex;
        flex-wrap: wrap;
    }

    .detailsPic div {
        margin-right: 1.25rem;
        font-size: 0.87rem;
        margin-bottom: 1.25rem;
    }

    .detailsPic div p {
        width: 100%;
        text-align: center;
        overflow: hidden;
    }

    .detailsPic div h5 {
        width: 100%;
        color: rgb(0, 160, 233);
        font-size: 0.87rem;
    }

    .detailsPic div img {
        width: 8.42rem;
        height: 6.75rem;
        border: solid 1px rgb(220, 220, 220);
        margin: 0.5rem 0;
    }



    /*TODO 修改~*/
    .detailslist {
        display: flex;
        margin-bottom:1rem;
    }
    .detailslist>div {
        width:50%;
        display: flex;
        flex-direction: column;
    }
    .detailslist>div:first-child {
        justify-content: center;
        align-items: center;
    }
    .detailslist p {
        padding:0.6rem 0;
    }
    .detailslist img {
        width: 12.63rem;
        height: 10.125rem;
        border: solid 1px rgb(220, 220, 220);
        margin: 0.5rem 0;
    }
</style>
