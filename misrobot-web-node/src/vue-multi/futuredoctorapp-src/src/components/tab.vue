<template>
    <div v-show="btn.active"><slot></slot></div>
</template>

<script>
export default {
  props: {
    defaultCls: {
      type: String,
      default: 'tab'
    },
    /*name: {
      type: String,
      require: true
    },*/
    title: {
      type: String,
      require: true
    },
    active: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    data: {},
    bus: {}
  },
  data() {
    return {
      btn:{
        title: '',
        active: false
      }
    }
  },
  watch: {
    title: function(val){
      this.btn.title = val;
    }
  },
  created () {
    this.btn.title = this.title;
    this.btn.active = !!this.active;
    this.btn.data = this.data;
  },
  mounted() {
    this.bus.$emit('addtabbtn', this.btn);
  },
  computed: {

  }
}
</script>
