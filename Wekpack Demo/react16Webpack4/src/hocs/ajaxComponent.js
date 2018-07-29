import React,{Component} from 'react';
let ajaxComponent = (importCmpFun)=>{
   return class extends Component {
     state  = { component :null}
     componentDidMount(){
       importCmpFun().then((cmp)=>{
         this.setState({component:cmp.default});
       })
     }
     render(){
         let C = this.state.component;
        return C ? <C {...this.props}/> : null
     }

   }
}
export default ajaxComponent
