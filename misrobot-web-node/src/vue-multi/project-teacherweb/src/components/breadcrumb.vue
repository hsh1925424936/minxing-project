<template>
  <div class = "bread">
    <span class = "bread-item" v-for="(item,index) in dirs">
      <span class = "bread-item-name" :class = "{lastname:index==dirs.length-1}" @click = "clickSpan(item,index)">{{item.name}}</span>
      <span class = 'sperator' :class = "{last:index==dirs.length-1}">></span>
    </span>
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props:{
          dirs:{
            type:Array,
            default:[]
          }
        },
        methods: {
          clickSpan(item,index){
            if(index!=this.dirs.length-1)
            this.$emit('click',item,index);
          }
        }
    }

</script>
<style lang="scss">
.bread-item{
  margin-right:5px;
  font-size:13px;
  color:#48576a;
}
.bread-item-name{
  margin-right:5px;
}
.bread-item-name:hover{
  color:#20a0ff;
  cursor:pointer;
}
.last{
  opacity:0;
}
.lastname{
  color:#97a8be !important;
  cursor:default !important;
}
</style>
