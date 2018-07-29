import * as ACTIONTYPES from './actionTypes.js'
const initState = {
  data: []
}
const reducer = (state = initState, action) => {
  if(action.type===ACTIONTYPES.LOAD){
    console.log("showreelReducers",action);
    return {
      ...state,
      data: action.data
    }
  }
  return state
}

export default reducer
