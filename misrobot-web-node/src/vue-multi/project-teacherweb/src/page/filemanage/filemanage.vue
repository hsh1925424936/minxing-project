<template>
    <div>
        <div class ="left-menu">
            <ul>
                <li :class = "{'li-focus':currentType=='-1'}" @click="currentType='-1'">全部</li>
                <li :class = "{'li-focus':currentType=='4'}" @click="currentType='4'">文档</li>
                <li :class = "{'li-focus':currentType=='3'}" @click="currentType='3'">图片</li>
                <li :class = "{'li-focus':currentType=='1'}" @click="currentType='1'">视频</li>
                <li :class = "{'li-focus':currentType=='0'}" @click="currentType='0'">其他</li>
                <li :class = "{'li-focus':currentType=='back'}" style="position:absolute;bottom:120px;border-top:1px solid #e1eaf1" @click="currentType='back'">回收站</li>
                <li :class = "{'li-focus':currentType=='record'}" style="position:absolute;bottom:70px" @click="openRecords">共享记录</li>

            </ul>
            <div class= "storage-left">
                <el-progress :show-text="false"  :percentage="diskPersent"></el-progress>
                <div style="text-align:center;color:#8590a6;margin-top:10px;font-size:13px">
                    容量：{{diskUsed}}/{{diskTotal}}
                </div>
            </div>
        </div>
        <div class = "right-container">
            <div  class = "tools">
                <el-upload
                  v-if="currentType!='record'&&currentType!='back'"
                  style="margin-left:30px"
                  action="/file/create"
                  :data="uploadData"
                  :show-file-list="false"
                  :on-success = "handleSuccess"
                  :on-error = "handleError"
                  :on-progress = "handleProgress"
                  >
                  <el-button  type="primary">点击上传</el-button>

                </el-upload>
                <el-button v-if="currentType=='back'" type = "primary" style="margin-left:30px" @click = "clearAll">全部清空</el-button>
                <div style="line-height:36px" v-if="currentType=='record'">
                    分享记录
                </div>
                <div v-if="currentType=='record'">
                    <el-select v-model ="selectTime" >
                        <el-option :value="0" label = "全部时间"></el-option>
                        <el-option :value="1" label = "近三天"></el-option>
                        <el-option :value="2" label = "近一周"></el-option>
                        <el-option :value="3" label = "近一个月"></el-option>
                        <el-option :value="4" label = "一个月以上"></el-option>
                    </el-select>
                    <el-select v-model = "selectStatus" >
                        <el-option :value = "undefined" label = "全部状态"></el-option>
                        <el-option :value="2" label = "未过期"></el-option>
                        <el-option :value="3" label = "已过期"></el-option>
                    </el-select>
                </div>
                <div v-if="currentType!='record'">
                    <el-button v-if="currentType!='back'"  @click = "newFolder">新建文件夹</el-button>
                    <!-- <el-button v-if="currentType!='back'" @click = "download">下载</el-button> -->
                    <el-button v-if="currentType!='back'" @click = "dialogFileMove">移动到</el-button>
                    <!-- <el-button @click = "inRename=!inRename">重命名</el-button> -->
                    <el-button v-if="currentType!='back'" @click = "openShare">共享</el-button>
                    <el-button v-if="currentType=='back'" @click ="recoverFiles">恢复</el-button>
                    <el-button @click ="delFiles">删除</el-button>
                </div>
                <div >
                    <div class="search-input" style = "float:left">
                        <el-input style = "width:200px" v-model="firstInput" placeholder="请输入文件名查询"></el-input>
                    </div>
                    <div class = "search-btn" style = "float:left;margin-left:10px">
                        <el-button type = "primary" @click ="queryByInput">查询</el-button>
                    </div>
                </div>
            </div>
            <el-progress v-show ="percent!=0&&percent!=100" :percentage="percent"></el-progress>
            <!-- <el-breadcrumb style ="margin: 20px 30px 0px;" separator=">">
              <el-breadcrumb-item @click = "delFiles">所有文件</el-breadcrumb-item>
              <el-breadcrumb-item @click = "delFiles">所有文件</el-breadcrumb-item>
            </el-breadcrumb> -->
            <breadcrumb v-if="currentType!='record'" style ="margin: 20px 30px 0px;" @click = "toDir" :dirs = "dirs"></breadcrumb>
            <div v-if="currentType!='record'" class = "file-list">
                <div @drop="drop($event,item.id)" @dragover="allowDrop($event)" class = "file-item" :title = "item.filename" key="index" v-for="(item,index) in files" @click ="chooseFile(item)" :class="{'file-item-hover':item.choosed}">
                    <img @dragstart = "drag($event,item.id)" class = "file-img" :src = "getImg(item)" @dblclick ="openFile(item)"/>

                    <!-- <div class = "file-rename" v-show="item.inRename" @click.stop> -->
                        <!-- <el-input :autofocus= "true" size="mini" placeholder = "" v-model ="item.name" @blur="doRename(item)"></el-input> -->
                        <input @click.stop v-show="item.inRename" class = "file-name-input" v-model ="item.name" @blur = "doRename(item)" />
                   <!--  </div> -->
                    <span v-show="!item.inRename"  @click.stop @dblclick = "dblclick(item,$event)" class = "file-name">{{item.filename}}</span>

                    <div  :class = "{checked:item.choosed,check:!item.choosed}"></div>
                    <div :class = "{folderNone:item.filecls==100||currentType=='back'}" title="点击下载" class = "download-logo" @click.stop><a class ="downloadImg" :href = "item.filepath" download></a></div>
                </div>

            </div>
            <div v-if="currentType=='record'">
                <div v-for="item in shareRecords">
                    <share-item :shareItem = "item" @reShare ="reShare"></share-item>
                </div>
                <el-pagination
                    v-if="shareTotal>5"
                    style="float:right"
                    :page-size="6"
                    :current-page.sync="cpage"
                    layout="prev, pager, next"
                    :total="shareTotal">
                  </el-pagination>

            </div>
        </div>
        <el-dialog title="移动到" :visible.sync="dialogMove" :close-on-click-modal="false" @close="">
            <el-tree
               ref = "dirsTree"
              :data="allDirs"
              :props="props"
              :load="loadNode"
              @current-change="handleCurrentChange"
              lazy
              :default-expanded-keys="[0]"
              node-key="id"
              highlight-current
              >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMove = false">取 消</el-button>
                <el-button type="primary" @click="moveToDir">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="文件共享" :visible.sync="dialogShare" size="tiny" :close-on-click-modal="false" @close="closeDialogShare">
            <div class = "shareFiles">
                <span v-if="index<3" v-for="(item,index) in shareList">{{item.filename}}<span v-if="index<shareList.length-1&&index<2">、</span></span>
                <span v-if ="shareList.length>3">等{{shareList.length}}个文件</span>
            </div>
            <div class = "choose-stu">
                <span>选择学生：</span><el-input disabled style="width:150px;margin-right:10px" v-model = "checkedInfo" ></el-input><el-button v-if="shareList[0]&&(shareList[0].sharestuids===undefined)" type="primary" @click="dialogSelStu=true">选择</el-button>
            </div>
            <div class ="choose-stu">
                <span style="margin-left:15px">有效期：</span>
                <el-radio class="radio" v-model="shareTimeRadio" label="1">长期有效</el-radio>
                <el-radio class="radio" v-model="shareTimeRadio" label="2">固定日期</el-radio>
            </div>
            <div class ="choose-stu">
                <el-date-picker
                  style = "margin-left:70px;"
                  v-if="shareTimeRadio==2"
                  v-model="shareTime"
                  type="date"
                  placeholder="选择截止日期">
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogShare = false">取 消</el-button>
                <el-button type="primary" @click="submitShare">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog  title="选择学生" :visible.sync="dialogSelStu" :close-on-click-modal="false" @close="closeSelStu">
            <translist ref="translist" :dirs ="transdirs" :data1 = "leftData" @getChildrens="getChildren" @clickDir = "clickDir" @checkedData = "getCheckedData"></translist>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSelStu = false">取 消</el-button>
                <el-button type="primary" @click="submitCheck">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import breadcrumb from '../../components/breadcrumb'
import translist from '../../components/translist'
import shareItem  from './shareitem';
// import {loadMore} from '../../components/mixin'
import $ from 'jquery'
    export default {
        data() {
            return {
                currentType:'',
                dirs:[{name:'所有文件',id:0}],
                transdirs:[{name:'所有班级',id:0}],
                leftData:[

                ],
                checkedInfo:'',//学生名
                classList:[],
                checkedStu:[],
                firstInput:'',
                files:[],
                dialogMove:false,
                diskUsed:'',
                diskTotal:'',
                diskPersent:0,
                allDirs:[],
                props:{label:'name',children:'children'},
                currentDir:'',
                dialogShare:false,
                dialogSelStu:false,
                shareTimeRadio:'1',
                shareTime:'',
                shareRecords: [],
                shareList:[],
                selectTime:0,
                selectStatus:undefined,
                cpage:1,
                shareTotal:0,
                stime:undefined,
                etime:undefined,
                percent:0,
            }
        },
        // mixins:[loadMore],
        computed:{
            choosedItem(){
                let arr = [];
                this.files.forEach(function(item,index){
                    item.choosed&&arr.push(item);
                });
                return arr;
            },
            uploadData(){
                return{
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    parent_id:this.dirs[this.dirs.length-1].id,
                }
            },

        },
        components: {
            breadcrumb,
            shareItem,
            translist,
        },
        created() {
        },
        mounted () {
            this.initDiskUsed();
            this.currentType=this.$route.query.ctype||-1;
            this.getAllClass();
            this.initShareRecords();
        },
        watch:{
            currentType(curval,oldval){
                if(curval=='back'){
                    this.dirs.splice(1,1000);
                    this.getBackFiles({page:1})
                }else{
                    if(oldval=='back'){
                       this.dirs.splice(1,1000);
                    }
                    this.getFiles({page:1,parent_id:this.dirs[this.dirs.length-1].id,'file_class':curval,})
                }

            },
            cpage(cval,oval){
                this.searchShareRecords({pagenum:this.cpage,stime:this.stime,etime:this.etime,status:this.selectStatus,filename:this.firstInput});
            },
            selectStatus(cval,oval){
                this.searchShareRecords_select();
            },
            selectTime(cval,oval){
                if(cval==0){
                    this.stime = undefined;
                    this.etime  = undefined;
                }else if(cval==1){
                    this.stime = moment(new Date()).subtract(3,'days').format('YYYY-MM-DD HH:mm:ss');
                    this.etime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                }else if (cval ==2){
                    this.stime = moment(new Date()).subtract(7,'days').format('YYYY-MM-DD HH:mm:ss');
                    this.etime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                }else if(cval ==3){
                    this.stime = moment(new Date()).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss');
                    this.etime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                }else{
                    this.stime = undefined;
                    this.etime = moment(new Date()).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss');
                }
                this.searchShareRecords_select();
            },
            choosedItem(cval,oval){
                this.shareList = cval;
            }

        },
        methods: {
            handleSuccess(res){
                console.log('success');
                console.log(res)
                if(res.data&&res.data.errcode!=0){

                    this.$message.error(res.data.errdesc);
                }else{
                    this.$message({
                        type:'success',
                        message:'上传成功'
                    });

                    this.getFiles({page:1});
                }
               this.percent=0;
            },
            handleError(res){
                console.log('error');
                console.log(res)
                this.$message.error('上传失败')
            },
            handleProgress(ev){
                console.log(ev)
                this.percent = ev.percent.toFixed(1);
            },
            chooseFile(item){

                item.choosed?this.$set(item,'choosed',false):this.$set(item,'choosed',true);
            },
            delFiles(){

                if(this.currentType=='back'){
                    this.realDelFiles();
                    return;
                }
                let self = this;
                if(this.choosedItem.length>0){
                    this.$confirm('是否将文件放入回收站?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      callback:action=>{
                        if(action=='cancel'){
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        }else{
                            post('/courseware/movetotrash',{
                                uid:getCookie('uid'),
                                loginid:getCookie('uid'),
                                sessionid:getCookie('sid'),
                                command:'courseware/movetotrash',
                                idlist:this.choosedItem.map((item)=>{
                                    return item.id;
                                }),
                            }).done((data)=>{
                                if(data.errcode==0){
                                    self.$message({
                                        type:'success',
                                        message:'移入回收站'
                                    });
                                    self.getFiles({page:1});
                                }else{
                                    self.$message.error('移入回收站失败')
                                }
                            })
                        }
                      }
                    })

                }else{
                    this.$message({
                        type:'info',
                        message:'请选择文件'
                    })
                }
            },
            clearAll(){

                    let idlist= this.files.map(item=>{
                        return item.id;
                    })
                  this.realDelFiles(idlist);

            },
            realDelFiles(list){
                let idlist = list||this.choosedItem.map((item)=>{
                                        return item.id;
                                    });
                let self = this;

                if((list&&list.length>0)||this.choosedItem.length>0){
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      callback:action=>{
                        if(action=='cancel'){
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        }else{
                            post('/courseware/delete',{
                                uid:getCookie('uid'),
                                loginid:getCookie('uid'),
                                sessionid:getCookie('sid'),
                                command:'courseware/delete',
                                idlist:idlist,
                            }).done((data)=>{
                                if(data.errcode==0){
                                    self.$message({
                                        type:'success',
                                        message:'彻底删除'
                                    });
                                    self.getFiles({page:1,status:0});
                                }
                            })
                        }
                      }
                    })
                }else{
                    if(list&&list.length==0){
                        this.$message({
                            type:'info',
                            message:'没有要清空的文件'
                        })
                    }else{
                        this.$message({
                            type:'info',
                            message:'请选择文件'
                        })
                    }

                }
            },
            recoverFiles(){
                let self = this;
                if(this.choosedItem.length>0){
                    post('/courseware/recover',{
                        uid:getCookie('uid'),
                        loginid:getCookie('uid'),
                        sessionid:getCookie('sid'),
                        command:'courseware/recover',
                        idlist:this.choosedItem.map((item)=>{
                            return item.id;
                        }),
                    }).done((data)=>{
                        if(data.errcode==0){
                            self.$message({
                                type:'success',
                                message:'恢复到根目录成功'
                            });
                            self.getFiles({page:1,status:0});
                        }
                    })
                }
            },
            doRename(item){
                if(this.currentType=='back'){
                    return;
                }
                let self = this;
                let flag = false;
                this.files.forEach(it=>{
                    if(it.name==item.name&&it.id!=item.id){
                        this.$message.error('重命名失败，有重复的文件名');
                        this.getFiles({page:1});
                        flag = true;
                    }
                })
                if(flag){
                    return;
                }
                post('/courseware/modifyname',{
                    uid:getCookie('uid'),
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    command:'courseware/modifyname',
                    id:item.id,
                    filename:item.name,
                }).done((data)=>{
                    if(data.errcode==0){
                        item.inRename = false;
                        self.getFiles({page:1})
                    }
                })

            },
            queryByInput(){
                let self = this;
                if(this.currentType=='record'){
                    this.searchShareRecords({stime:this.stime,etime:this.etime,status:this.selectStatus,filename:this.firstInput})
                }else{
                    let option = {page:1,parent_id:self.dirs[self.dirs.length-1].id,file_class:self.currentType,key_word:this.firstInput}
                    if(this.currentType=='back'){
                        option.status=0;
                    }
                    this.searchFiles(option).then((list)=>{
                        this.files = list;
                    })
                }

            },
            dblclick(item,event){
                if(this.currentType=='back'){
                    return;
                }
                //console.log(arguments)
                this.$set(item,'inRename',true);
                //console.log(event.target.previousSibling.previousElementSibling);
                this.$nextTick(function(){
                    event.target.previousSibling.previousElementSibling.focus();
                    event.target.previousSibling.previousElementSibling.select();
                })

            },
            newFolder(){
                let  self = this;
                let num='';
                self.currentType='-1';
                self.searchFiles({page:1,parent_id:self.dirs[self.dirs.length-1].id,file_class:self.currentType,key_word:'新建文件夹'})
                .then((list)=>{
                    if(list.length>0){
                        let arr = list.map(it=>+it.name.replace(/[^0-9]/ig,""));

                        num = '('+(_.max(arr)+1)+')';
                        // let max = list[list.length-1].name.replace(/[^0-9]/ig,"");
                        // let max1 = ++max;
                        // num = '('+max1+')';
                    }else{
                        num = '';
                    }

                    //console.log(num)
                    post('/courseware/mkdir',{
                        uid:getCookie('uid'),
                        loginid:getCookie('uid'),
                        sessionid:getCookie('sid'),
                        command:'courseware/mkdir',
                        parent_id:this.dirs[this.dirs.length-1].id,
                        dirname:'新建文件夹'+num
                    }).done((data)=>{
                        if(data.errcode==0){

                            self.getFiles({page:1,'file_class':-1}).then(()=>{
                                let renameIndex = 0;
                                console.log(self.files)
                                self.files.forEach((item,index)=>{
                                    if(item.name=='新建文件夹'+num){
                                        renameIndex=index;
                                    }
                                })
                                self.$set(self.files[renameIndex],'inRename',true);
                                self.$nextTick(()=>{
                                    $('.file-name-input')[renameIndex].focus();
                                    $('.file-name-input')[renameIndex].select();
                                })
                            });
                        }
                    })
                })
            },
            download(file){
                window.open(file.filepath)

            },
            _download(){

            },
            openFile(file){
               // alert('1')
                if(file.filecls==100){
                    if(this.currentType==='back'){
                        return;
                        //this.getFiles({page:1,parent_id:file.id,status:0});
                    }else{
                        this.getFiles({page:1,parent_id:file.id,'file_class':this.currentType,});
                    }

                    this.dirs.push({name:file.name,id:file.id});
                }else if(file.suffix=='.ppt'||file.suffix=='.pptx'||file.suffix=='.doc'||file.suffix=='.docx'||file.suffix=='.xls'||file.suffix=='.xlsx'){

                    window.open('https://view.officeapps.live.com/op/embed.aspx?src='+file.filepath);
                }else if(file.suffix=='.pdf'||file.filecls==3){
                    window.open(file.filepath)

                    //window.open(file.filepath);
                }else{
                    this.$message.error('该文件不支持预览');
                }
            },
            toDir(dir,index){
                console.log(dir)
                if(this.currentType==='back'){
                    this.getFiles({page:1,parent_id:dir.id,status:0});
                }else{
                    this.getFiles({page:1,parent_id:dir.id,'file_class':this.currentType,});
                }

                this.dirs.splice(index+1,100);
            },
            getFiles(option){
                return new Promise((resolve,reject)=>{
                    let self = this;
                    post('/courseware/leveloneitem',{
                        uid:getCookie('uid'),
                        loginid:getCookie('uid'),
                        sessionid:getCookie('sid'),
                        command:"courseware/leveloneitem",
                        parent_id:self.dirs[self.dirs.length-1].id,
                        file_class:self.currentType,
                        reqnum:100,
                        ...option
                    }).done((data)=>{
                        if(data.errcode==0){
                            self.files=data.list.map((file)=>{
                                file.filename = file.name+file.suffix;
                                return file;
                            });
                            resolve();
                        }
                    })
                });

            },
            getBackFiles(option){
                let self = this;
                post('/courseware/searchrecycle',{
                    uid:getCookie('uid'),
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    command:"courseware/searchrecycle",

                    file_class:-1,
                    reqnum:24,
                    status:0,
                    ...option
                }).done((data)=>{
                    if(data.errcode==0){
                        self.files=data.list.map((file)=>{
                            file.filename = file.name+file.suffix;
                            return file;
                        });
                    }
                })
            },
            searchFiles(option){
                return new Promise((resolve,reject)=>{
                    let self = this;
                    post('/courseware/search',{
                        uid:getCookie('uid'),
                        loginid:getCookie('uid'),
                        sessionid:getCookie('sid'),
                        command:"courseware/search",
                        reqnum:24,
                        ...option
                    }).done((data)=>{
                        if(data.errcode==0){
                            resolve(data.list.map((file)=>{
                                file.filename = file.name+file.suffix;
                                return file;
                            }));
                        }
                    })
                });
            },
            getImg(file){
                if(file.filecls==100){
                    return require('../../assets/img/fd.png');
                }else if(file.filecls==1){
                    return require('../../assets/img/sp.png');
                }else if(file.filecls==2){
                    return require('../../assets/img/yinping.png');
                }else if(file.filecls==3){
                    //return require('../../assets/img/jpgimg.png');
                    return file.filepath;
                }else if(file.filecls==4){
                    if(file.suffix=='.txt'){
                        return require('../../assets/img/txt.png');
                    }else if(file.suffix=='.pdf'){
                        return require('../../assets/img/pdf.png');
                    }else if(file.suffix=='.doc'||file.suffix=='.docx'){
                        return require('../../assets/img/doc.png');
                    }else if(file.suffix=='.xls'||file.suffix=='.xlsx'){
                        return require('../../assets/img/Excel.png');
                    }else if(file.suffix=='.ppt'||file.suffix=='.pptx'){
                        return require('../../assets/img/pptimg.png');
                    }

                }else if(file.suffix==".rar"||file.suffix==".zip"){
                    return require('../../assets/img/rarimg.png');
                }else{
                    return require('../../assets/img/default.png');
                }
            },
            moveFile(pid,cids){
                let self = this;
                post('/courseware/movefiles',{
                    uid:getCookie('uid'),
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    command:"courseware/movefiles",
                    parent_id:pid,
                    idlist:cids
                }).done((data)=>{
                    if(data.errcode==0){
                        self.$message({
                            type:'success',
                            message:'移动成功'
                        });
                        self.dialogMove = false;
                        self.getFiles({page:1});
                    }else{
                        self.$message.error('移动失败');
                    }
                })
            },
            allowDrop(ev){
                ev.preventDefault();
            },
            drop(ev,id){
                console.log(ev)
                console.log(id)
                ev.preventDefault();
                var data=ev.dataTransfer.getData("Text");
                if(data==id){
                    return;
                }
                this.moveFile(id,[data])
            },
            drag(ev,id){
                console.log(ev)
                console.log(id)
                ev.dataTransfer.setData("Text",id);
            },
            initDiskUsed(){
                let self = this;
                post('/courseware/getdiskusedandtotal',{
                    uid:getCookie('uid'),
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    command:"courseware/getdiskusedandtotal",
                }).done((data)=>{
                    if(data.errcode==0){
                        self.diskUsed = data.used;
                        self.diskTotal = data.total;
                        self.diskPersent = +data.percent;
                    }
                })
            },
            dialogFileMove(){
                if(this.choosedItem.length==0){
                    this.$message({
                        type:'info',
                        message:'请先选择文件'
                    })
                    return;
                }

                    this.allDirs= [{name:'所有文件',id:0,data:{id:0,name:'所有文件'}}];

                this.dialogMove = true;
            },
            openShare(){
                if(this.choosedItem.length==0){
                    this.$message({
                        type:'info',
                        message:'请先选择要分享的文件'
                    });
                    return;
                }else{
                    this.dialogShare = true;
                }
            },
            getDirs(parent_id){
                return new Promise((resolve,reject)=>{
                    let self = this;
                    post('/courseware/dirs',{
                        uid:getCookie('uid'),
                        loginid:getCookie('uid'),
                        sessionid:getCookie('sid'),
                        command:"courseware/dirs",
                        parent_id:parent_id,
                    }).done((data)=>{
                        if(data.errcode==0){

                            resolve(data.list);
                        }
                    })
                });
            },
            loadNode(node,resolve){
                if (node.level === 0) {
                   return resolve([{ name: '所有文件',id:0 },]);
                }
                console.log(node)
                this.getDirs(node.data.id).then((data)=>{
                    console.log(data)
                    resolve(data);
                })
            },
            handleCurrentChange(data){
                this.currentDir = data.id;
            },
            moveToDir(){
                let cids = this.choosedItem.map((item)=>{
                    return item.id;
                })
                this.moveFile(this.currentDir,cids);

            },
            //choosestu
            getChildren(item){
                let self = this;
                if(item.ctype!==undefined){
                    post('/cls/listsclassStd',{
                        command:'cls/listsclassStd',
                        sessionid:getCookie('sid'),
                        loginid:getCookie('uid'),
                        id:item.id,
                    }).done((data)=>{
                        if(data.errcode==0){
                            self.leftData = data.stdlist;
                            console.log('self.checkedstu')
                            console.log(self.checkedStu)
                            console.log(self.leftData)
                            _(self.checkedStu).forEach((it)=>{
                                let temp = _.find(self.leftData,{id:it.id,name:it.name});
                                console.log('temp')
                                console.log(temp)
                                temp &&(self.$set(temp,'checked',true));
                            });
                            _(self.leftData).forEach((it)=>{
                                it.end = true;
                            })
                        }
                    })
                }


            },
            clickDir(item,index){
                let self = this;
                if(index==0){
                    this.leftData=this.classList;
                    _(this.leftData).forEach((it)=>{
                        it.checked = false;
                    })
                    console.log(this.checked)
                    _(this.checkedStu).forEach((it)=>{
                        let temp = _.find(this.leftData,{id:it.id,name:it.name});
                        temp &&(temp.checked = true);
                    })
                }/*else if(index==1){
                    post('/cls/listsclassStd',{
                        command:'cls/listsclassStd',
                        sessionid:getCookie('sid'),
                        loginid:getCookie('uid'),
                        id:item.id,
                    }).done((data)=>{
                        if(data.errcode==0){
                            self.leftData = data.stdlist;
                            _(self.checkedStu).forEach((it)=>{
                                let temp = _.find(self.leftData,{id:it.id,name:it.name});
                                temp &&(temp.checked = true);
                            })
                        }
                    })
                }*/

                this.transdirs.splice(index+1,100);
            },
            getCheckedData(data){
                this.checkedStu = data;
                console.log('checked'+data)
            },
            getAllClass(){
                let self = this;
                post('/cls/listsclassbytid',{
                    command:'cls/listsclassbytid',
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    teacherid:getCookie('uid')
                }).done((data)=>{
                    if(data.errcode==0){
                        self.classList = data.sclassList;
                        self.leftData = data.sclassList;
                    }
                })
            },
            submitCheck(){
                console.log(this.checkedStu)
                if(this.checkedStu.length==1){
                    this.checkedInfo = this.checkedStu[0].name;
                }else if(this.checkedStu.length==2){
                    this.checkedInfo = this.checkedStu[0].name+'、'+this.checkedStu[1].name;
                }else if(this.checkedStu.length>2){
                    this.checkedInfo = this.checkedStu[0].name+'、'+this.checkedStu[1].name+'等';
                }else{
                    this.checkedInfo='';
                }
                this.dialogSelStu = false;
            },
            closeDialogShare(){
                this.checkedInfo = '';
                this.shareTimeRadio="1";
                this.shareTime = '';
                this.getAllClass();
                this.$refs.translist.removeAllR();
            },
            submitShare(){
                let self = this;
                if(this.checkedInfo==''){
                    this.$message.error('请选择学生');
                    return;
                }else if(this.shareTimeRadio==2&&this.shareTime==''){
                    this.$message.error('请输入截止日期');
                    return;
                }else{
                    let endtime =this.shareTimeRadio==1?'': moment(this.shareTime).format('YYYY-MM-DD');
                    if(this.shareList[0].shareids){
                        post('/courseware/reshareFiles',{
                           command:'courseware/reshareFiles',
                            sessionid:getCookie('sid'),
                            loginid:getCookie('uid'),
                            shareids:this.shareList[0].shareids,
                            status:0,
                            endtime:endtime,
                        }).done((data)=>{
                            if(data&&data.errcode==0){
                                self.$message({
                                    type:'success',
                                    message:'重新共享成功'
                                })
                                self.dialogShare = false;
                                self.shareList[0].status=0;
                                self.shareList[0].expire = 0;
                            }else{
                                self.$message.error('重新共享失败')
                            }
                        })
                    }else{
                        let filelist = this.choosedItem.map((item)=>{
                            return {cid:item.id,uid:getCookie('uid'),filename:item.name};
                        });
                        filelist.forEach((item)=>{
                            item.sid =  _.filter(this.checkedStu,(it)=>{
                                return it.sclassid!==undefined;
                            }).map((i)=>{return i.id}).join(',');
                            item.classid = _.filter(this.checkedStu,(it)=>{
                                return it.ctype!==undefined;
                            }).map((i)=>{return i.id}).join(',');
                            item.endtime = endtime;
                        });

                        post('/courseware/sharefiles',{
                            command:'courseware/sharefiles',
                            sessionid:getCookie('sid'),
                            loginid:getCookie('uid'),
                            filelist:filelist,
                        }).done((data)=>{
                            if(data&&data.errcode==0){
                                self.$message({
                                    type:'success',
                                    message:'分享成功'
                                });
                                self.dialogShare = false;
                            }
                        })
                    }

                }
            },
            openRecords(){
                this.currentType = 'record';
                this.initShareRecords();
            },
            initShareRecords(){
                this.searchShareRecords({pagenum:1})
            },
            searchShareRecords(option){
                let self = this;
                post('/courseware/searchsharefiles4t',{
                    command:'courseware/searchsharefiles4t',
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    uid:getCookie('uid'),
                    perpagenum:6,
                    pagenum:1,
                    ...option
                }).done((data)=>{
                    if(data&&data.errcode==0){
                       self.shareRecords = data.sharefilelist;
                       self.shareTotal = data.totalnum;
                       console.log(self.shareRecords)
                    }
                })
            },
            searchShareRecords_select(){
                this.searchShareRecords({stime:this.stime,etime:this.etime,status:this.selectStatus})
            },
            reShare(item){
                console.log(item)
                item.filename = item.name+item.suffix;
                this.shareList=[item];

                this.checkedInfo=item.sharestunames;
                this.dialogShare = true;
            },
            refreshShareList(){

            },
            closeSelStu(){
                this.transdirs = [{name:'所有班级',id:0}];
            },

        }
    }

</script>
<style >
  @import "../../assets/css/common.css";
  .left-menu{
        float:left;
        width:150px;
        height:600px;
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        position:relative;
    }
    .left-menu>ul>li{
        display:block;
        width:100%;
        height:50px;
        text-align:center;
        color:#8590a6;
        margin:0 auto;
        line-height:50px;
        border-bottom:1px solid #e1eaf1;
    }
    .left-menu>ul>li:hover{
        background-color:#eef1f6;
        color:#20a0ff;
        cursor:pointer;
    }
    .li-focus{
        background-color:#20a0ff  !important;
        color:white !important;
    }
    .storage-left{
        position:absolute;
        width:100%;
        height:70px;
        bottom:0px;
        padding:20px 2px;
        box-sizing:border-box;
    }
    .right-container{
        float:left;
        width:calc(100% - 180px);
        min-height:600px;
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        margin-left:20px;
        padding:10px;
        box-sizing:border-box;
    }
    .tools{
        display:flex;
        justify-content:space-between;
    }
    .file-list{
        margin:20px 20px 0;
        padding:10px 10px 5px;
        display:flex;
        flex-wrap:wrap;
        overflow-y:auto;
        height:450px;
    }
    .file-item{
        position:relative;
        width:118px;
        height:140px;
        box-sizing:border-box;
        margin-right:10px;
        margin-bottom:10px;
        padding:15px 15px 0;
        box-sizing:border-box;
        border:1px solid #ffffff;
        font-size:13px;
        border-radius:5px;
    }
    .file-item:hover{
        background:#e1eaf1;
        border:1px solid #20a0ff;
    }
    .file-item-hover{
        background:#e1eaf1;
        border:1px solid #20a0ff;
    }
    .file-rename{
        position:absolute;
        width:90%;
        margin:0 5px;
        bottom:10px;
        left:1px;
    }
    .check{
        position:absolute;
        top:0px;
        right:0px;
        width:20px;
        height:20px;

        box-sizing:border-box;
        opacity:0;
    }
    .download-logo{
        position:absolute;
        top:0px;
        left:0px;
        width:30px;
        height:30px;
        box-sizing:border-box;
        opacity:0;
        cursor:pointer;
    }
    .file-item:hover .check{
        opacity:1;
        background-image:url(../../assets/img/nochecked.png);
        background-size:100% 100%;
    }
    .file-item:hover .download-logo{
        opacity:1;
        background-image:url(../../assets/img/down.png);
        background-size:100% 100%;
    }
    .folderNone{
        display: none !important;
    }
    .checked{
        position:absolute;
        top:0px;
        right:0px;
        width:20px;
        height:20px;
        background-size:100% 100%;
        box-sizing:border-box;
        opacity:1;
        background-image:url(../../assets/img/checked.png);
    }
    .file-item:nth-of-type(8n){
        margin-right:0px
    }
    .file-img{
        width:80px;
        height:80px;
    }
    .file-name{
        overflow : hidden;
        text-overflow: ellipsis;
        width:90px;
        white-space:nowrap;

    }
    .file-name-input{
        position:absolute;
        width:90%;
        margin:0 5px;
        bottom:10px;
        left:1px;
        height:20px;
        border-radius:5px;
    }
    .choose-stu{
        width:300px;
        margin:15px auto;

    }
    .downloadImg{
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
