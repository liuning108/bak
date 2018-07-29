import  React, {Component} from  'react'
import { Route,Link} from 'react-router-dom';

export default class Posts extends Component{
   state={
     context:null
   }
   componentDidMount(){
      console.log("NewPost componentDidMount");
      console.log(this.props);

   }
   enterPost=(id)=>{
      this.props.history.push("/posts/"+id+"yyyy");
   }
   render(){
     return (
       <ul>
          Hehe
       </ul>
     )
   }
}
