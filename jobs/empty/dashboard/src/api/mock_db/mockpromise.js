export default (fun)=>{
   return new Promise((resolve, reject) => {
     setTimeout(() => {
        fun(resolve, reject)
     }, 600);
   })
}