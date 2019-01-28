import userApi from '../../../api/dashboard'
import router from '../../../router'

export default {
  namespaced: true,
  state: {
     card: {},
     isLoading:true,

  },
  mutations: {
    getNodeById(state, data) {
      state.card = data.card;
     
    },
    isLoading(store,data){
      store.isLoading=data;
    }
  },
  actions: {
    getNodeById(store,data) {
       console.log('store', store)
       console.log('data', data)
       const {bid,cid} = data;
       store.commit("isLoading",true);
       setTimeout(()=>{
         store.commit("getNodeById", {
           card: {
             name: "name" + cid,
             id: cid
           }
         });
         store.commit("isLoading", false);
       },1000)
        
       
    }
  },
  getters: {

  }
}