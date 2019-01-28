<template>
  <div class="login">
    <div class="loginCard">
      <div class="loginCardHead">
        <img src="../assets/images/logo.png" alt="logo">
      </div>
      <div class="loginSpace">
        <span>{{loginError}}</span>
      </div>
      <div class="loginFrom">
        <el-input
              class="loginInput"
              placeholder="公司域"
              prefix-icon="el-icon-login-home"
              v-model="region"
              >
              </el-input>
            <el-input
              class="loginInput"
              placeholder="邮箱地扯"
              prefix-icon="el-icon-login-youxiang"
              v-model="userEmail"
             >
              </el-input>
            <el-input
              class="loginInput"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-login-suo"
              v-model="pwd"
             >
              </el-input>

            <el-button class="loginInput" type="primary" style="width:100%" @click="login" >登录</el-button>

      </div>
      <div class="loginFooter"></div>
     
    </div>
     

  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials=true;
import { createNamespacedHelpers} from 'vuex'
const { mapActions,mapGetters  } = createNamespacedHelpers('user')

  export default {
     mounted(){
      axios.get('http://127.0.0.1:8080/hello')
      .then(response => {
        console.log(response)
      })
    },
    data(){
        return {
          region:'xingsheng',
          userEmail:'liuning@xingsheng.com',
          pwd:'hehe'
        }
      },
    computed: {
      ...mapGetters(['loginError'])
    }, 
    methods:{
      ...mapActions(['login']),
    } 
  }
</script>
<style lang='sass' scoped src>
@import '../assets/styles/login.sass'
</style>
