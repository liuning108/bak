import userApi from '../../../api/dashboard'
import router from '../../../router'

export default {
  namespaced: true,
  state: {
    dashList:[]
  },
  mutations: {
   
  },
  actions: {
    getDashListByUserId(store, userId) {
      console.log(userId);
    }
  },
  getters: {
    
  }
}