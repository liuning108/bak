import cardeditApi from '../../../api/cardedit'
import router from '../../../router'

export default {
  namespaced: true,
  state: {
     card: {},
     isLoading:true,
     cardset:{}

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
    getNodeDSInfo(state,data){
      state.cardset = data;
    },
    exit(state) {
      state.card={};
       state.isLoading = false;
       state.cardset={};
    }
  },
  actions: {
    
    async getNodeById(store,data) {
       const {bid,cid} = data;
       store.commit("isLoading",true);
       var data = await cardeditApi.getNodeById({bid,cid})
       store.commit("getNodeById", data)
       store.commit("isLoading", false);
       //初始CardSet
       store.dispatch("getNodeDSInfo")
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
      const {bid,card} = store.state
      const result = await cardeditApi.saveNode(bid,card)
      store.dispatch("exit")
    },
    exit(store){
      store.commit("exit")
      router.push("/main/dashboard/w3de974eb2538444ba519729")
    },
    /**
     * 读取节点数据源信息
     */
    async getNodeDSInfo(store) {
      console.log('getNodeDSInfo', store.state.card)
      const {dsConfig} =store.state.card
      const cardset = await cardeditApi.getNodeDSInfo(dsConfig.id);
      console.log('getNodeDSInfo', cardset)
      store.commit("getNodeDSInfo", cardset);

    }

  },
  getters: {

  }
}