import * as ACTIONTYPES from './actionTypes.js'
const initState ={
    result : []
}
const reducer = (state =initState, action)=>{
  console.log("reducer Action:",action);
    switch (action.type) {
      case ACTIONTYPES.RESULT:
         return {
           ...state,
           result: state.res.result.concat(Math.random())
         }
        break;
      default:
       return state
    }

}

export default reducer
