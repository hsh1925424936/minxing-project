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
                                <span>药用部位：<span style="color:#333333;">{{v.parts}}</span></span>
                                <span style="margin-left:3.75rem;">产地：<span style="color:#333333;">{{v.origin}}</span></span>
                            </p>
                            <p>
                                <span>功效：<span style="color:#333333;">{{v.effect}}</span></span>
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
                        <span>2-16字</span>
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
                <div class="addUploadImages">
                    <div>
                        <h4>鉴赏图鉴<span style="color:red;">*</span></h4>
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
                        <h4>真品鉴赏<span style="color:red;">*</span></h4>
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
                        <h4>显微镜切片<span style="color:red;">*</span></h4>
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

                    <div>
                        <h4>伪品1<span style="color:red;">*</span></h4>
                        <el-upload class="avatar-uploader" action="/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess4" :on-remove="handleRemove4"
                                   :before-upload="beforeAvatarUpload4" list-type="picture">
                            <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>格式：支持jpg、png</span><br>
                                <span>比例：宽/高=3/5</span><br>
                                <span>大小：2M以内</span>
                            </p>
                        </el-upload>
                        <h5>
                            <span style="color:red;">*</span>
                            <el-input style="width:10rem;" size="small" v-model="firstFakeName" placeholder="伪品名称"></el-input>
                        </h5>
                    </div>

                    <div>
                        <h4>伪品2<span style="color:red;">*</span></h4>
                        <el-upload class="avatar-uploader" action="/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess5" :on-remove="handleRemove5"
                                   :before-upload="beforeAvatarUpload5" list-type="picture">
                            <img v-if="imageUrl5" :src="imageUrl5" class="avatar">
                            <p v-else>
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <span>格式：支持jpg、png</span><br>
                                <span>比例：宽/高=3/5</span><br>
                                <span>大小：2M以内</span>
                            </p>
                        </el-upload>
                        <h5>
                            <span style="color:red">*</span>
                            <el-input style="width:10rem;" size="small" v-model="secondFakeName" placeholder="伪品名称"></el-input>
                        </h5>
                    </div>

                </div>
            </div>
                <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('addMedicine')">保存</el-button>
				<el-button @click="dialogVisibleAdd = false">取 消</el-button>
			</span>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="dialogVisibleDetail" :before-close="handleCloseDetail">
            <div class="detailsHead">
                <h2>{{details.name}}</h2>
                <p>
                    <span>药用部位：<b>{{details.parts}}</b></span>
                    <span>产地：<b>{{details.origin}}</b></span>
                </p>
                <p>
                    <span>功效：<b>{{details.effect}}</b></span>
                </p>
                <p>
                    <span>主治：<b>{{details.treatment}}</b></span>
                </p>
                <p>
                    <span>性味与归经：<b>{{details.tropism}}</b></span>
                </p>
            </div>
            <div class="detailsPic">
                <div>
                    <h5>鉴赏图鉴</h5>
                    <img :src="url+details.typical" alt="">
                    <p>{{details.name}}</p>
                </div>
                <div>
                    <h5>真品鉴赏</h5>
                    <img :src="url+details.real" alt="">
                    <p>真品{{details.name}}</p>
                </div>
                <div v-for="item in details.fakes">
                    <h5>伪品鉴别1</h5>
                    <img :src="url+item.fake" alt="">
                    <p>{{item.name}}</p>
                </div>
                <div>
                    <h5>显微镜切片</h5>
                    <img :src="url+details.micro" alt="">
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
            var validatePartsBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入药用部位！'));
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
            var validateTreatmentBlank = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入主治内容！'));
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
                // showModal:false,
                details: {},
                levellistSecond: [],
                imageUrl1: '',
                imageUrl2: '',
                imageUrl3: '',
                imageUrl4: '',
                imageUrl5: '',
                fileList: [],
                addMedicine: {
                    addOrigin: '',
                    addName: '',
                    addSelect: '',
                    addSubject: '',
                    addSecondSubject: '',
                    addTropism: '',
                    addParts: '',
                    addEffect: '',
                    addTreatment: ''
                },
                addSubject: '',
                typical: '',
                real: '',
                micro: '',
                fakes: [
                    {fake:'',name:''},
                    {fake:'',name:''}
                ],
                secondFakeName: '',
                firstFakeName: '',
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
                            max: 16,
                            message: '字数必须小于16',
                            trigger: 'blur'
                        },
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
                            max: 16,
                            message: '字数必须小于16',
                            trigger: 'blur'
                        },
                    ],
                    addParts: [{
                        required: true,
                        validator: validatePartsBlank,
                        trigger: 'blur'
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
                        },
                    ],
                    addEffect: [{
                        required: true,
                        validator: validateEffectBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 8,
                            message: '字数必须大于8',
                            trigger: 'blur'
                        },
                        {
                            max: 30,
                            message: '字数必须小于30',
                            trigger: 'blur'
                        },
                    ],
                    addTreatment: [{
                        required: true,
                        validator: validateTreatmentBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 8,
                            message: '字数必须大于8',
                            trigger: 'blur'
                        },
                        {
                            max: 30,
                            message: '字数必须小于30',
                            trigger: 'blur'
                        },
                    ],
                    addTropism: [{
                        required: true,
                        validator: validateTropismBlank,
                        trigger: 'blur'
                    },
                        {
                            min: 8,
                            message: '字数必须大于8',
                            trigger: 'blur'
                        },
                        {
                            max: 30,
                            message: '字数必须小于30',
                            trigger: 'blur'
                        },
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
                    addOrigin: '',
                    addName: '',
                    addSelect: '',
                    addSubject: '',
                    addSecondSubject: '',
                    addTropism: '',
                    addParts: '',
                    addEffect: '',
                    addTreatment: ''
                }
                this.imageUrl1 = ''
                this.imageUrl2 = ''
                this.imageUrl3 = ''
                this.imageUrl4 = ''
                this.imageUrl5 = ''
                this.firstFakeName = ''
                this.secondFakeName = ''
            },
            save(addMedicine) {
                let self = this
                // alert(self.firstFakeName)
                this.$refs[addMedicine].validate((valid) => {
                    if (valid) {
                        if (this.typical == '' || this.real == '' || this.micro == '' || this.fakes.length != 2) {
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
                self.fakes[0].name = self.firstFakeName
                self.fakes[1].name = self.secondFakeName
                post('/medicine/add', {
                    command: 'medicine/add',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name: self.addMedicine.addName,
                    subject: subjectid,
                    origin: self.addMedicine.addOrigin,
                    parts: self.addMedicine.addParts,
                    effect: self.addMedicine.addEffect,
                    treatment: self.addMedicine.addTreatment,
                    tropism: self.addMedicine.addTropism,
                    typical: self.typical,
                    real: self.real,
                    micro: self.micro,
                    fakes: self.fakes
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        self.dialogVisibleAdd = false
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
                self.fakes = []
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
                        self.addMedicine.addName = data.name
                        self.addMedicine.addOrigin = data.origin
                        self.addMedicine.addParts = data.parts
                        self.addMedicine.addTreatment = data.treatment
                        self.addMedicine.addTropism = data.tropism
                        self.imageUrl1 = self.url + data.typical
                        self.imageUrl2 = self.url + data.real
                        self.imageUrl3 = self.url + data.micro
                        self.addMedicine.addEffect = data.effect
                        self.imageUrl4 = self.url + data.fakes[0].fake
                        self.firstFakeName = data.fakes[0].name
                        self.imageUrl5 = self.url + data.fakes[1].fake
                        self.secondFakeName = data.fakes[1].name
                        self.addMedicine.addSelect = data.first
                        self.typical = data.typical
                        self.real = data.real
                        self.micro = data.micro
                        // self.fakes[0].fake = data.fakes[0].fake
                        // self.fakes[1].fake = data.fakes[1].fake
                        self.fakes.push({
                            fake: data.fakes[0].fake,
                            name: data.fakes[0].name
                        }, {
                            fake: data.fakes[1].fake,
                            name: data.fakes[1].name
                        })
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
                //  console.log(res)
                console.log(file)
                this.imageUrl2 = URL.createObjectURL(file.raw);
                this.real = file.response.data.uri
                // console.log(this.real)
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
                this.micro = file.response.data.uri
                // console.log(this.micro)
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
            handleAvatarSuccess4(res, file) {
                this.imageUrl4 = URL.createObjectURL(file.raw);
                this.fakes[0].fake = file.response.data.uri
            },
            handleRemove4(file, fileList) {
                console.log(file, fileList);
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
            handleAvatarSuccess5(res, file) {
                console.log(file)
                this.imageUrl5 = URL.createObjectURL(file.raw);
                this.fakes[1].fake = file.response.data.uri
            },
            handleRemove5(file, fileList) {
                console.log(file, fileList);
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
                self.fakes[0].name = self.firstFakeName
                self.fakes[1].name = self.secondFakeName
                post('/medicine/edit', {
                    command: 'medicine/edit',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: self.editId,
                    name: self.addMedicine.addName,
                    subject: subjectid,
                    origin: self.addMedicine.addOrigin,
                    parts: self.addMedicine.addParts,
                    effect: self.addMedicine.addEffect,
                    treatment: self.addMedicine.addTreatment,
                    tropism: self.addMedicine.addTropism,
                    typical: self.typical,
                    real: self.real,
                    micro: self.micro,
                    fakes: self.fakes
                }).done(function (data) {
                    self.queryMedicineList(self.searchName, self.subjectId)
                    if (data && data.errcode == 0) {
                        self.dialogVisibleAdd = false
                        self.dialogVisibleDetail = false
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
</style>
