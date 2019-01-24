import datasource from './mock_db/datasource'
const user = {
  'name': "liuning",
  'email': "liuning@xingsheng",
  'id': "1"
}

/** 模似后端接口 */
export default {
  login(info){
    return new Promise((resolve, reject) => {
       setTimeout(() => {
        resolve(user)
       }, 300);
    })
  },
  getCurUser(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(sessionStorage.getItem("user"))
      },0);
    })
  },
  getDataSource() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(datasource);
      }, 500);
    })
  }

}