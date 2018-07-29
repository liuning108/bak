import * as ACTIONTYPES from '../actionTypes.js'
import DB from '../DB.js'
export const LoadAction =()=>{
  return (dispatch,getState)=>{
    setTimeout(()=>{
      console.log('old state in LoadAction method',getState());
      dispatch({
         type: ACTIONTYPES.LOAD,
         data: DB.data
      })
    },2000)
  }
}
