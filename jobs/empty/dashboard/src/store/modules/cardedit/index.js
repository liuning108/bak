import cardeditApi from '../../../api/cardedit'
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
      state.bid = data.bid
     
    },
    isLoading(state,data){
      state.isLoading = data;
    },
    changeNodeType(state, data) {
      state.card.type = data;
    },
  },
  actions: {
    
    async getNodeById(store,data) {
       const {bid,cid} = data;
       store.commit("isLoading",true);
       var data = await cardeditApi.getNodeById({bid,cid})
       store.commit("getNodeById", data)
       store.commit("isLoading", false);
    },
    /**
     *改变节点的类型
     *
     */
    changeNodeType(store,data){
      store.commit("changeNodeType", data);
    },
    /**
     * 保存节点
     * 
     */
    async saveNode(store) {
      console.log(store.state.card)
      const {bid,card} = store.state
      const result = cardeditApi.saveNode(bid,card)
      console.log(result)
      router.push("/main/dashboard/w3de974eb2538444ba519729")
    }
  },
  getters: {

  }
}