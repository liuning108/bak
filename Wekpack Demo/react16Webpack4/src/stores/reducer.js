import * as ACTIONTYPES from './actionTypes.js'
const initState ={
    counter : 101
}
const reducer = (state =initState, action)=>{
  console.log("crash",state);
  console.log("reducer Action:",action);
    switch (action.type) {
      case ACTIONTYPES.INC:
         return {
           ...state,
           counter: state.counter+action.value
         }
        break;
      default:
       return state
    }

}

export default reducer
