<template>
  <div class="EmptyList">
     <i :class="icon"></i>
     <span>{{msg}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: 'el-icon-dash-icon-empty'
      },
    },
  }
</script>
