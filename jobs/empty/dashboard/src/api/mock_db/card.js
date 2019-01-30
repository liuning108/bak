 import util from '../../utils/util'

export default ()=>{
  const id = util.uuidv4();
  return {
    "name": "未命名的卡片",
    "x": 0,
    "y": 0,
    "w": 4,
    "h": 7,
    "i": id,
    "type":"Node1",
    "dsConfig":{
       "id":"1",
       "x_config":[],
       "y_config":[],
    }
  } 
}