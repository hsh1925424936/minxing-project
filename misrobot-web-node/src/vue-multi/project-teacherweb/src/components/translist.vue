<template>
    <div class = "translist">
        <div class="trans-left">
            <div class = "trans-left-header">可选</div>
            <div class ="trans-left-body">
                <el-input
                style="width:85%;margin:10px 20px"
                  placeholder="请输入关键字搜索"
                  icon="search"
                  size ="small"
                  v-model="filterText"
                  >
                </el-input>
                <breadcrumb style ="margin:0 0 10px 10px" @click = "toDir" :dirs = "dirs"></breadcrumb>

               <div style="height:290px;overflow-y:auto">
                   <div v-for="(item,index) in sdata1" class = "check-item" :key="item.id">
                       <el-checkbox @change = "itemClick(item)" v-model="item.checked">{{item.name}}</el-checkbox>

                       <i v-show="!item.checked&&!item.end" title="进入" style = "width:30px;height:30px;line-height:30px;text-align:center" class = "el-icon-d-arrow-right" @click.stop = "getChildren(item)"></i>
                   </div>
               </div>
            </div>

        </div>
        <div class ="trans-right">
            <div class = "trans-left-header">已选</div>

            <div style="height:356px;overflow-y:auto;padding-top:10px">
               <div v-for="(item,index) in data2" class = "check-item">
                   <span>{{item.name}}</span>

                   <i style = "width:30px;height:30px;line-height:30px;text-align:center" title = "移除" class = "el-icon-circle-close" @click = "removeR(item)"></i>
               </div>
           </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import breadcrumb from './breadcrumb'
    export default {
        data() {
            return {
                filterText:'',
                sdata1:[],
                defaultProps:{
                    label:'name'
                },
                data2:[],
            }
        },
        props:{
            dirs:{
                type:Array,
                default:[],
            },
            data1:{
                type:Array,
                default:[]
            },

        },
        components: {
            breadcrumb,
        },
        created() {
        },
        mounted () {
            this.sdata1 =this.data1;
        },

        methods: {
            toDir(item,index){
                this.$emit('clickDir',item,index);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            itemClick(item){
                console.log('11')
                console.log(item)
                if(item.checked){
                    this.$set(item,'checked',true);

                    this.data2.push(item);
                    console.log('22');
                    console.log(this.data2);

                }else{
                    this.$set(item,'checked',false);
                    this.data2 = _.reject(this.data2,{id:item.id,name:item.name});

                }

            },
            removeR(item){
                this.data2 = _.reject(this.data2,item);
                let temp = _.find(this.sdata1,item);
                temp&&(temp.checked = false);
            },
            getChildren(item){
                console.log('aaaa'+item)
                console.log(item)
                this.dirs.push(item);
                this.$emit('getChildrens',item);
            },
            removeAllR(){
              this.data2 = [];
            }

        },
         watch: {
              filterText(val) {
                this.sdata1 = _.filter(this.data1,(item)=>{
                    return item.name.indexOf(val)!=-1;
                })
              },
              data2(val){
                console.log('checkedright')
                console.log(val)
                this.$emit('checkedData',val);
              },
              data1(val){
                this.sdata1 =val;
              }
        },
    }

</script>
<style scoped>
  .trans-left{
    float:left;
    width:45%;
    margin:10px;
    border:1px solid #e1eAF1;
  }
  .trans-left-header{
    width:100%;
    height:40px;
    border-bottom:1px solid #e1eaf1;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
  }
  .check-item{
    display: flex;
    justify-content: space-between;
    margin:0px 10px;
    height: 22px;
    align-items: center;
    padding: 5px;
  }
  .check-item:hover{
    background: #e4e8f1;
    cursor:pointer;
    color:#4db3ff;
  }
.trans-right{
    float:left;
    width:45%;
    height:408px;
    margin:10px;
    border:1px solid #e1eaf1;
    overflow-y:auto;
  }
</style>
