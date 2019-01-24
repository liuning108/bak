import userApi from '../../../api/user'
import router from '../../../router'
export default {
  namespaced: true,
  state: {
    user: {},
    code: 0
  },
  mutations: {
    login(state, user) {
      state.user = user
      state.code = 1;
    },
    loginError(state,code) {
      state.code = code;
    },
    loginOut(state) {
     state.user={};
     state.code=0;
    }
  },
  actions: {
    loginOut(store) {
     store.commit("loginOut")
    },
    async login(store, loginInfo) {
      try {
       const user =  await userApi.login(loginInfo)
       store.commit('login', user);
       sessionStorage.setItem('user', user);
       router.replace('/main')
      }catch(code){
        store.commit('loginError', code);
      }

    },
   async getCurUser(store) {
       var user = await  userApi.getCurUser();
       if(user){
          store.commit('login', user);
          return true;
       }else{
        store.dispatch("loginOut")
        return false;
       }
    }
  },
  getters: {
    loginError(state){
      return state.code!= 2 ? "" : "用户名或密码不正确"
    }
  }
}