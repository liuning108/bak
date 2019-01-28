<template>
  <div class="EmptyList">
     <i class="el-icon-dash-icon-empty"></i>
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
    },
  }
</script>
